const pool = require('../config/db');

const findByEmail = async (mi_id) => {
    const sql = `
        SELECT
            mi_seq,
            mi_id,
            mi_use,
            mi_path,
            mi_name,
            mi_nick,
            mi_level,
            mi_push,
            mi_regdt
        FROM public.mem_info
        WHERE mi_id = $1
        LIMIT 1
    `;

    const result = await pool.query(sql, [mi_id]);

    return result.rows[0] || null;
};

module.exports = {
    findByEmail,
};