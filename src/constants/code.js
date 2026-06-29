const LOGIN_PROVIDER = {
    NORMAL: '1',
    KAKAO: '2',
    NAVER: '3',
    FACEBOOK: '4',
    GOOGLE: '5',
};

const getLoginProviderCode = (provider) => {
    if (!provider) return null;

    const key = provider.toUpperCase();

    return LOGIN_PROVIDER[key] || null;
};

module.exports = {
    LOGIN_PROVIDER,
    getLoginProviderCode,
};