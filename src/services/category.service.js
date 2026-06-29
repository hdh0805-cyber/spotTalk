const categoryRepository = require('../repositories/category.repository');

const getCategories = async () => {
    const categories = await categoryRepository.findActiveCategories();

    return {
        categories,
    };
};

module.exports = {
    getCategories,
};