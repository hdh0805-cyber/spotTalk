const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const asyncHandler = require('../utils/asyncHandler');

router.post('/social-login', asyncHandler(authController.socialLogin));
router.post('/signup', asyncHandler(authController.signup));

module.exports = router;