const jwt = require('jsonwebtoken');

const signAccessToken = (member) => {
    return jwt.sign(
        {
            mi_seq: member.mi_seq,
            mi_id: member.mi_id,
            mi_path: member.mi_path,
            mi_level: member.mi_level,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        }
    );
};

module.exports = {
    signAccessToken,
};