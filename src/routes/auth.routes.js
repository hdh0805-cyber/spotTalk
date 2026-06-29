const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const asyncHandler = require('../utils/asyncHandler');

router.post('/social-login', asyncHandler(authController.socialLogin));

module.exports = router;