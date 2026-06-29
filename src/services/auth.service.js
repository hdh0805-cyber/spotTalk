const memberRepository = require('../repositories/member.repository');
const { signAccessToken } = require('../config/jwt');
const { getLoginProviderCode } = require('../constants/code');

const socialLogin = async ({ provider, email, name }) => {
    if (!provider || !email) {
        const error = new Error('로그인 제공자와 이메일은 필수입니다.');
        error.statusCode = 400;
        throw error;
    }

    const mi_path = getLoginProviderCode(provider);

    if (!mi_path) {
        const error = new Error('지원하지 않는 로그인 방식입니다.');
        error.statusCode = 400;
        throw error;
    }

    const member = await memberRepository.findByEmail(email);

    if (!member) {
        return {
            join_required: 'Y',
            social: {
                provider,
                mi_path,
                email,
                name: name || '',
            },
        };
    }

    if (member.mi_use !== 'Y') {
        const error = new Error('탈퇴 또는 이용 중지된 회원입니다.');
        error.statusCode = 403;
        throw error;
    }

    const accessToken = signAccessToken(member);

    return {
        join_required: 'N',
        access_token: accessToken,
        member: {
            mi_seq: member.mi_seq,
            mi_id: member.mi_id,
            mi_path: member.mi_path,
            mi_name: member.mi_name,
            mi_nick: member.mi_nick,
            mi_level: member.mi_level,
            mi_push: member.mi_push,
        },
    };
};

module.exports = {
    socialLogin,
};