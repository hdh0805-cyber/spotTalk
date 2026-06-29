const memberService = require('../services/member.service');
const { success } = require('../utils/response');

const me = async (req, res) => {
    const result = await memberService.getMyInfo(req.user.mi_seq);

    return success(res, result, '회원 정보 조회 성공');
};

const updateMe = async (req, res) => {
    const result = await memberService.updateMyInfo(req.user.mi_seq, req.body);

    return success(res, result, '회원 정보 수정 성공');
};

module.exports = {
    me,
    updateMe,    
};