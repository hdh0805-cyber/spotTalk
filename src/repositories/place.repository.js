const pool = require('../config/db');

const findNearbyPlaces = async ({ lat, lng }) => {
    const sql = `
        SELECT
            pi.pi_seq,
            pi.pi_name,
            pi.pi_use,
            pi.pi_pc_seq,
            pc.pc_name,
            pi.pi_radius_m,
            ST_Distance(
                pi.pi_location,
                ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
            ) AS distance_m,
            pi.pi_regdt
        FROM public.pos_info pi
        JOIN public.pos_category pc
          ON pc.pc_seq = pi.pi_pc_seq
        WHERE pi.pi_use = 'Y'
          AND pc.pc_use = 'Y'
          AND ST_DWithin(
                pi.pi_location,
                ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
                pi.pi_radius_m
          )
        ORDER BY distance_m ASC
    `;

    const result = await pool.query(sql, [lat, lng]);
    return result.rows;
};

const findActivePlaceBySeq = async ({ pi_seq, lat, lng }) => {
    const sql = `
        SELECT
            pi.pi_seq,
            pi.pi_name,
            pi.pi_use,
            pi.pi_pc_seq,
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
        FROM public.pos_info pi
        WHERE pi.pi_seq = $1
          AND pi.pi_use = 'Y'
        LIMIT 1
    `;

    const result = await pool.query(sql, [pi_seq, lat, lng]);
    return result.rows[0] || null;
};

module.exports = {
    findNearbyPlaces,
    findActivePlaceBySeq,
};