const express = require('express');
const router = express.Router();
const riskController = require('../controllers/riskController');
const { cacheMiddleware } = require('../middleware/cache');

// 1800 seconds = 30 minutes
router.get('/score/:id', cacheMiddleware(1800), riskController.getScore);
router.post('/windows', riskController.computeWindows); // no cache

module.exports = router;
