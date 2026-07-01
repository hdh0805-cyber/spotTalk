const placeService = require('../services/place.service');
const { success } = require('../utils/response');

const nearby = async (req, res) => {
    const result = await placeService.getNearbyPlaces(req.query);

    return success(res, result, '주변 장소 목록 조회 성공');
};

module.exports = {
    nearby,
};