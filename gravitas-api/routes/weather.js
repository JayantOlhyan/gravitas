const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const { cacheMiddleware } = require('../middleware/cache');

// 1800 seconds = 30 minutes
router.get('/current', cacheMiddleware(1800), weatherController.getCurrent);
router.get('/flares', cacheMiddleware(1800), weatherController.getFlares);
router.get('/cme', cacheMiddleware(1800), weatherController.getCme);

module.exports = router;
