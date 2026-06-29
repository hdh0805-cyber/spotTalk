const pushRepository = require('../repositories/push.repository');

const registerToken = async (mi_seq, { token, platform, device_id }) => {
    if (!token || !platform) {
        const error = new Error('푸시 토큰과 플랫폼은 필수입니다.');
        error.statusCode = 400;
        throw error;
    }

    if (!['android', 'ios'].includes(platform)) {
        const error = new Error('플랫폼은 android 또는 ios만 가능합니다.');
        error.statusCode = 400;
        throw error;
    }

    const pushToken = await pushRepository.upsertPushToken({
        mi_seq,
        token,
        platform,
        device_id,
    });

    return {
        push_token: {
            mpt_seq: pushToken.mpt_seq,
            mpt_mi_seq: pushToken.mpt_mi_seq,
            mpt_platform: pushToken.mpt_platform,
            mpt_device_id: pushToken.mpt_device_id,
            mpt_use: pushToken.mpt_use,
            mpt_lastdt: pushToken.mpt_lastdt,
        },
    };
};

const disableToken = async (mi_seq, { token }) => {
    if (!token) {
        const error = new Error('푸시 토큰은 필수입니다.');
        error.statusCode = 400;
        throw error;
    }

    const pushToken = await pushRepository.disablePushToken({
        mi_seq,
        token,
    });

    if (!pushToken) {
        const error = new Error('등록된 푸시 토큰을 찾을 수 없습니다.');
        error.statusCode = 404;
        throw error;
    }

    return {
        push_token: {
            mpt_seq: pushToken.mpt_seq,
            mpt_mi_seq: pushToken.mpt_mi_seq,
            mpt_platform: pushToken.mpt_platform,
            mpt_device_id: pushToken.mpt_device_id,
            mpt_use: pushToken.mpt_use,
            mpt_lastdt: pushToken.mpt_lastdt,
        },
    };
};

module.exports = {
    registerToken,
    disableToken,    
};