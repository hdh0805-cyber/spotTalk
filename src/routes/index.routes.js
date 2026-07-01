const express = require('express');
const router = express.Router();

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const memberRoutes = require('./member.routes');
const pushRoutes = require('./push.routes');
const categoryRoutes = require('./category.routes');
const placeRoutes = require('./place.routes');
const chatRoomRoutes = require('./chatRoom.routes');

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/member', memberRoutes);
router.use('/push', pushRoutes);
router.use('/categories', categoryRoutes);
router.use('/places', placeRoutes);
router.use('/chat-rooms', chatRoomRoutes);

module.exports = router;