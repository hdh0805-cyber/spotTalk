const express = require('express');
const router = express.Router();

const healthController = require('../controllers/health.controller');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', asyncHandler(healthController.health));
router.get('/db', asyncHandler(healthController.dbHealth));

module.exports = router;