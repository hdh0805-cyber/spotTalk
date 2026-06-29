const pool = require('../config/db');

const upsertPushToken = async ({
    mi_seq,
    token,
    platform,
    device_id,
}) => {
    const sql = `
        INSERT INTO public.mem_push_token (
            mpt_mi_seq,
            mpt_token,
            mpt_platform,
            mpt_device_id,
            mpt_use,
            mpt_regdt,
            mpt_lastdt
        )
        VALUES (
            $1, $2, $3, $4, 'Y', now(), now()
        )
        ON CONFLICT (mpt_token)
        DO UPDATE SET
            mpt_mi_seq = EXCLUDED.mpt_mi_seq,
            mpt_platform = EXCLUDED.mpt_platform,
            mpt_device_id = EXCLUDED.mpt_device_id,
            mpt_use = 'Y',
            mpt_lastdt = now()
        RETURNING
            mpt_seq,
            mpt_mi_seq,
            mpt_token,
            mpt_platform,
            mpt_device_id,
            mpt_use,
            mpt_regdt,
            mpt_lastdt
    `;

    const result = await pool.query(sql, [
        mi_seq,
        token,
        platform,
        device_id || null,
    ]);

    return result.rows[0];
};

const disablePushToken = async ({ mi_seq, token }) => {
    const sql = `
        UPDATE public.mem_push_token
        SET
            mpt_use = 'N',
            mpt_lastdt = now()
        WHERE mpt_mi_seq = $1
          AND mpt_token = $2
        RETURNING
            mpt_seq,
            mpt_mi_seq,
            mpt_token,
            mpt_platform,
            mpt_device_id,
            mpt_use,
            mpt_lastdt
    `;

    const result = await pool.query(sql, [mi_seq, token]);

    return result.rows[0] || null;
};

module.exports = {
    upsertPushToken,
    disablePushToken,
};