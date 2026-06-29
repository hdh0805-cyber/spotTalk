const authService = require('../services/auth.service');
const { success } = require('../utils/response');

const socialLogin = async (req, res) => {
    const result = await authService.socialLogin(req.body);

    if (result.join_required === 'Y') {
        return success(res, result, '회원가입이 필요합니다.');
    }

    return success(res, result, '로그인되었습니다.');
};

const signup = async (req, res) => {
    const result = await authService.signup(req.body);

    return success(res, result, '회원가입이 완료되었습니다.');
};

module.exports = {
    socialLogin,
    signup,
};