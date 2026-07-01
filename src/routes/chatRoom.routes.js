const express = require('express');
const router = express.Router();

const chatRoomController = require('../controllers/chatRoom.controller');
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, asyncHandler(chatRoomController.create));
router.get('/nearby', authMiddleware, asyncHandler(chatRoomController.nearby));
router.get('/:cr_seq', authMiddleware, asyncHandler(chatRoomController.detail));
router.post('/:cr_seq/join', authMiddleware, asyncHandler(chatRoomController.join));
router.post('/:cr_seq/leave', authMiddleware, asyncHandler(chatRoomController.leave));

module.exports = router;