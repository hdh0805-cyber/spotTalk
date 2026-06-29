const pool = require('../config/db');

const findActiveCategories = async () => {
    const sql = `
        SELECT
            pc_seq,
            pc_name,
            pc_use,
            pc_regdt
        FROM public.pos_category
        WHERE pc_use = 'Y'
        ORDER BY pc_seq ASC
    `;

    const result = await pool.query(sql);

    return result.rows;
};

module.exports = {
    findActiveCategories,
};