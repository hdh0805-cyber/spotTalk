const express = require('express');
const router = express.Router();

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const memberRoutes = require('./member.routes');
const pushRoutes = require('./push.routes');
const categoryRoutes = require('./category.routes');   // ← 이 줄 추가

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/member', memberRoutes);
router.use('/push', pushRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;