const categoryService = require('../services/category.service');
const { success } = require('../utils/response');

const list = async (req, res) => {
    const result = await categoryService.getCategories();

    return success(res, result, '카테고리 목록 조회 성공');
};

module.exports = {
    list,
};