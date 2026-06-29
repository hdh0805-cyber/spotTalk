const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category.controller');
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, asyncHandler(categoryController.list));

module.exports = router;