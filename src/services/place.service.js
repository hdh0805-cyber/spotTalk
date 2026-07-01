const placeRepository = require('../repositories/place.repository');

const getNearbyPlaces = async ({ lat, lng }) => {
    if (!lat || !lng) {
        const error = new Error('위도와 경도는 필수입니다.');
        error.statusCode = 400;
        throw error;
    }

    const latNum = Number(lat);
    const lngNum = Number(lng);

    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
        const error = new Error('위도와 경도 형식이 올바르지 않습니다.');
        error.statusCode = 400;
        throw error;
    }

    const places = await placeRepository.findNearbyPlaces({
        lat: latNum,
        lng: lngNum,
    });

    return {
        places,
    };
};

module.exports = {
    getNearbyPlaces,
};