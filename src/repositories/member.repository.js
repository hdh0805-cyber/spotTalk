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

const createMember = async ({ mi_id, mi_path, mi_name, mi_nick }) => {
    const sql = `
        INSERT INTO public.mem_info (
            mi_id,
            mi_path,
            mi_name,
            mi_nick,
            mi_use,
            mi_level,
            mi_push,
            mi_regdt
        )
        VALUES (
            $1, $2, $3, $4, 'Y', '9', 'Y', now()
        )
        RETURNING
            mi_seq,
            mi_id,
            mi_use,
            mi_path,
            mi_name,
            mi_nick,
            mi_level,
            mi_push,
            mi_regdt
    `;

    const result = await pool.query(sql, [
        mi_id,
        mi_path,
        mi_name,
        mi_nick || null,
    ]);

    return result.rows[0];
};

const findBySeq = async (mi_seq) => {
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
        WHERE mi_seq = $1
        LIMIT 1
    `;

    const result = await pool.query(sql, [mi_seq]);

    return result.rows[0] || null;
};

const updateMember = async ({ mi_seq, mi_nick, mi_push }) => {
    const sql = `
        UPDATE public.mem_info
        SET
            mi_nick = COALESCE($2, mi_nick),
            mi_push = COALESCE($3, mi_push)
        WHERE mi_seq = $1
        RETURNING
            mi_seq,
            mi_id,
            mi_use,
            mi_path,
            mi_name,
            mi_nick,
            mi_level,
            mi_push,
            mi_regdt
    `;

    const result = await pool.query(sql, [
        mi_seq,
        mi_nick,
        mi_push,
    ]);

    return result.rows[0] || null;
};

module.exports = {
    findByEmail,
    createMember,
    findBySeq,    
    updateMember,
};