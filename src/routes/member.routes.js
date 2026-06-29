const express = require('express');
const router = express.Router();

const memberController = require('../controllers/member.controller');
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/me', authMiddleware, asyncHandler(memberController.me));
router.put('/me', authMiddleware, asyncHandler(memberController.updateMe));

module.exports = router;