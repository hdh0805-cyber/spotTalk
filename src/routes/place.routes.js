const express = require('express');
const router = express.Router();

const placeController = require('../controllers/place.controller');
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/nearby', authMiddleware, asyncHandler(placeController.nearby));

module.exports = router;