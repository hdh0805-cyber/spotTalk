const pool = require('../config/db');

const createChatRoom = async (client, {
    cr_name,
    cr_pi_seq,
    cr_mi_seq,
    cr_expire_kind,
}) => {
    const sql = `
        INSERT INTO public.chat_room (
            cr_name,
            cr_pi_seq,
            cr_use,
            cr_regdt,
            cr_mi_seq,
            cr_expire_kind
        )
        VALUES (
            $1, $2, 'Y', now(), $3, $4
        )
        RETURNING
            cr_seq,
            cr_name,
            cr_pi_seq,
            cr_use,
            cr_regdt,
            cr_mi_seq,
            cr_expire_kind
    `;

    const result = await client.query(sql, [
        cr_name,
        cr_pi_seq,
        cr_mi_seq,
        cr_expire_kind || '1',
    ]);

    return result.rows[0];
};

const findNearbyRooms = async ({ lat, lng }) => {
    const sql = `
        SELECT
            cr.cr_seq,
            cr.cr_name,
            cr.cr_pi_seq,
            cr.cr_use,
            cr.cr_regdt,
            cr.cr_mi_seq,
            cr.cr_expire_kind,

            pi.pi_name,
            pi.pi_radius_m,
            pc.pc_seq,
            pc.pc_name,

            ST_Distance(
                pi.pi_location,
                ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
            ) AS distance_m,

            (
                SELECT COUNT(*)
                FROM public.chat_room_member crm
                WHERE crm.crm_cr_seq = cr.cr_seq
                  AND crm.crm_state = 'Y'
                  AND crm.crm_expel = 'N'
            ) AS member_count

        FROM public.chat_room cr
        JOIN public.pos_info pi
          ON pi.pi_seq = cr.cr_pi_seq
        JOIN public.pos_category pc
          ON pc.pc_seq = pi.pi_pc_seq
        WHERE cr.cr_use = 'Y'
          AND pi.pi_use = 'Y'
          AND pc.pc_use = 'Y'
          AND ST_DWithin(
                pi.pi_location,
                ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
                pi.pi_radius_m
          )
        ORDER BY distance_m ASC, cr.cr_regdt DESC
    `;

    const result = await pool.query(sql, [lat, lng]);

    return result.rows;
};

const findRoomDetailBySeq = async ({ cr_seq, mi_seq }) => {
    const sql = `
        SELECT
            cr.cr_seq,
            cr.cr_name,
            cr.cr_pi_seq,
            cr.cr_use,
            cr.cr_regdt,
            cr.cr_mi_seq,
            cr.cr_expire_kind,

            pi.pi_name,
            pi.pi_radius_m,

            pc.pc_seq,
            pc.pc_name,

            owner.mi_seq AS owner_mi_seq,
            owner.mi_id AS owner_mi_id,
            owner.mi_name AS owner_mi_name,
            owner.mi_nick AS owner_mi_nick,

            (
                SELECT COUNT(*)
                FROM public.chat_room_member crm
                WHERE crm.crm_cr_seq = cr.cr_seq
                  AND crm.crm_state = 'Y'
                  AND crm.crm_expel = 'N'
            ) AS member_count,

            my.crm_state AS my_state,
            my.crm_admin AS my_admin,
            my.crm_expel AS my_expel,
            my.crm_join_dt AS my_join_dt,
            my.crm_leave_dt AS my_leave_dt

        FROM public.chat_room cr
        JOIN public.pos_info pi
          ON pi.pi_seq = cr.cr_pi_seq
        JOIN public.pos_category pc
          ON pc.pc_seq = pi.pi_pc_seq
        JOIN public.mem_info owner
          ON owner.mi_seq = cr.cr_mi_seq
        LEFT JOIN public.chat_room_member my
          ON my.crm_cr_seq = cr.cr_seq
         AND my.crm_mi_seq = $2
        WHERE cr.cr_seq = $1
          AND cr.cr_use = 'Y'
        LIMIT 1
    `;

    const result = await pool.query(sql, [cr_seq, mi_seq]);

    return result.rows[0] || null;
};

const findRoomAccessInfo = async ({ cr_seq, lat, lng }) => {
    const sql = `
        SELECT
            cr.cr_seq,
            cr.cr_name,
            cr.cr_use,
            cr.cr_pi_seq,
            pi.pi_seq,
            pi.pi_name,
            pi.pi_use,
            pi.pi_radius_m,
            ST_DWithin(
                pi.pi_location,
                ST_SetSRID(ST_MakePoint($3, $2), 4326)::geography,
                pi.pi_radius_m
            ) AS is_inside,
            ST_Distance(
                pi.pi_location,
                ST_SetSRID(ST_MakePoint($3, $2), 4326)::geography
            ) AS distance_m
        FROM public.chat_room cr
        JOIN public.pos_info pi
          ON pi.pi_seq = cr.cr_pi_seq
        WHERE cr.cr_seq = $1
          AND cr.cr_use = 'Y'
          AND pi.pi_use = 'Y'
        LIMIT 1
    `;

    const result = await pool.query(sql, [cr_seq, lat, lng]);
    return result.rows[0] || null;
};

module.exports = {
    createChatRoom,
    findNearbyRooms,
    findRoomDetailBySeq,
    findRoomAccessInfo,
};