const success = (res, data = {}, message = '') => {
    return res.json({
        result: 'Y',
        message,
        data,
    });
};

const fail = (res, message = '요청 처리 중 오류가 발생했습니다.', data = {}, statusCode = 400) => {
    return res.status(statusCode).json({
        result: 'N',
        message,
        data,
    });
};

module.exports = {
    success,
    fail,
};