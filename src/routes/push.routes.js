const express = require('express');
const router = express.Router();

const pushController = require('../controllers/push.controller');
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/token', authMiddleware, asyncHandler(pushController.registerToken));
router.delete('/token', authMiddleware, asyncHandler(pushController.disableToken));

module.exports = router;