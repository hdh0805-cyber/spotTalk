const pool = require('../config/db');

const createRoomOwner = async (client, {
    crm_cr_seq,
    crm_mi_seq,
}) => {
    const sql = `
        INSERT INTO public.chat_room_member (
            crm_cr_seq,
            crm_mi_seq,
            crm_state,
            crm_join_dt,
            crm_admin,
            crm_expel
        )
        VALUES (
            $1, $2, 'Y', now(), 'Y', 'N'
        )
        RETURNING
            crm_seq,
            crm_cr_seq,
            crm_mi_seq,
            crm_state,
            crm_join_dt,
            crm_leave_dt,
            crm_admin,
            crm_expel
    `;

    const result = await client.query(sql, [
        crm_cr_seq,
        crm_mi_seq,
    ]);

    return result.rows[0];
};

const findRoomMember = async ({ crm_cr_seq, crm_mi_seq }) => {
    const sql = `
        SELECT
            crm_seq,
            crm_cr_seq,
            crm_mi_seq,
            crm_state,
            crm_join_dt,
            crm_leave_dt,
            crm_admin,
            crm_expel
        FROM public.chat_room_member
        WHERE crm_cr_seq = $1
          AND crm_mi_seq = $2
        LIMIT 1
    `;

    const result = await pool.query(sql, [crm_cr_seq, crm_mi_seq]);
    return result.rows[0] || null;
};

const joinRoomMember = async ({ crm_cr_seq, crm_mi_seq }) => {
    const sql = `
        INSERT INTO public.chat_room_member (
            crm_cr_seq,
            crm_mi_seq,
            crm_state,
            crm_join_dt,
            crm_leave_dt,
            crm_admin,
            crm_expel
        )
        VALUES (
            $1, $2, 'Y', now(), NULL, 'N', 'N'
        )
        ON CONFLICT (crm_cr_seq, crm_mi_seq)
        DO UPDATE SET
            crm_state = 'Y',
            crm_join_dt = now(),
            crm_leave_dt = NULL
        RETURNING
            crm_seq,
            crm_cr_seq,
            crm_mi_seq,
            crm_state,
            crm_join_dt,
            crm_leave_dt,
            crm_admin,
            crm_expel
    `;

    const result = await pool.query(sql, [crm_cr_seq, crm_mi_seq]);
    return result.rows[0] || null;
};

const leaveRoomMember = async ({ crm_cr_seq, crm_mi_seq }) => {
    const sql = `
        UPDATE public.chat_room_member
        SET
            crm_state = 'N',
            crm_leave_dt = now()
        WHERE crm_cr_seq = $1
          AND crm_mi_seq = $2
          AND crm_state = 'Y'
        RETURNING
            crm_seq,
            crm_cr_seq,
            crm_mi_seq,
            crm_state,
            crm_join_dt,
            crm_leave_dt,
            crm_admin,
            crm_expel
    `;

    const result = await pool.query(sql, [crm_cr_seq, crm_mi_seq]);

    return result.rows[0] || null;
};

module.exports = {
    createRoomOwner,
    findRoomMember,
    joinRoomMember,
    leaveRoomMember,
};