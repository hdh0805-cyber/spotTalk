const pool = require('../config/db');
const { success } = require('../utils/response');

const health = async (req, res) => {
    return success(res, {
        server: 'spotTalk API',
        version: '1.0.0',
    }, 'OK');
};

const dbHealth = async (req, res) => {
    const result = await pool.query('SELECT NOW() AS now');

    return success(res, {
        db: 'OK',
        time: result.rows[0].now,
    }, 'DB OK');
};

module.exports = {
    health,
    dbHealth,
};