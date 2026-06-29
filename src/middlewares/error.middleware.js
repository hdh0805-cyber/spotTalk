const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    return res.status(err.statusCode || 500).json({
        result: 'N',
        message: err.message || '서버 오류가 발생했습니다.',
        data: {},
    });
};

module.exports = errorMiddleware;