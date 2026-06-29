const pushService = require('../services/push.service');
const { success } = require('../utils/response');

const registerToken = async (req, res) => {
    const result = await pushService.registerToken(req.user.mi_seq, req.body);

    return success(res, result, '푸시 토큰 등록 성공');
};

const disableToken = async (req, res) => {
    const result = await pushService.disableToken(req.user.mi_seq, req.body);

    return success(res, result, '푸시 토큰 비활성화 성공');
};

module.exports = {
    registerToken,
    disableToken,
};