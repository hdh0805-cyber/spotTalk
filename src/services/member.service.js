const memberRepository = require('../repositories/member.repository');

const getMyInfo = async (mi_seq) => {
    const member = await memberRepository.findBySeq(mi_seq);

    if (!member) {
        const error = new Error('회원 정보를 찾을 수 없습니다.');
        error.statusCode = 404;
        throw error;
    }

    if (member.mi_use !== 'Y') {
        const error = new Error('탈퇴 또는 이용 중지된 회원입니다.');
        error.statusCode = 403;
        throw error;
    }

    return {
        member: {
            mi_seq: member.mi_seq,
            mi_id: member.mi_id,
            mi_path: member.mi_path,
            mi_name: member.mi_name,
            mi_nick: member.mi_nick,
            mi_level: member.mi_level,
            mi_push: member.mi_push,
            mi_regdt: member.mi_regdt,
        },
    };
};

const updateMyInfo = async (mi_seq, { nick, push }) => {
    if (push && !['Y', 'N'].includes(push)) {
        const error = new Error('푸시 수신 여부는 Y 또는 N만 가능합니다.');
        error.statusCode = 400;
        throw error;
    }

    const member = await memberRepository.findBySeq(mi_seq);

    if (!member) {
        const error = new Error('회원 정보를 찾을 수 없습니다.');
        error.statusCode = 404;
        throw error;
    }

    if (member.mi_use !== 'Y') {
        const error = new Error('탈퇴 또는 이용 중지된 회원입니다.');
        error.statusCode = 403;
        throw error;
    }

    const updatedMember = await memberRepository.updateMember({
        mi_seq,
        mi_nick: nick,
        mi_push: push,
    });

    return {
        member: {
            mi_seq: updatedMember.mi_seq,
            mi_id: updatedMember.mi_id,
            mi_path: updatedMember.mi_path,
            mi_name: updatedMember.mi_name,
            mi_nick: updatedMember.mi_nick,
            mi_level: updatedMember.mi_level,
            mi_push: updatedMember.mi_push,
            mi_regdt: updatedMember.mi_regdt,
        },
    };
};

module.exports = {
    getMyInfo,
    updateMyInfo,    
};