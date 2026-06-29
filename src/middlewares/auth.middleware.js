const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            result: 'N',
            message: '인증 토큰이 없습니다.',
            data: {},
        });
    }

    let token = authHeader;

    if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            mi_seq: decoded.mi_seq,
            mi_id: decoded.mi_id,
            mi_path: decoded.mi_path,
            mi_level: decoded.mi_level,
        };

        next();

    } catch (err) {

        return res.status(401).json({
            result: 'N',
            message: '유효하지 않은 인증 토큰입니다.',
            data: {},
        });

    }

};

module.exports = authMiddleware;