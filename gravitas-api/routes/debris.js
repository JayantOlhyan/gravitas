const express = require('express');
const router = express.Router();
const debrisController = require('../controllers/debrisController');
const { cacheMiddleware } = require('../middleware/cache');

// 14400 seconds = 4 hours
router.get('/list', cacheMiddleware(14400), debrisController.getList);
// 1800 seconds = 30 minutes
router.get('/risk-top', cacheMiddleware(1800), debrisController.getTopRisk);
router.get('/:id', cacheMiddleware(14400), debrisController.getById);

module.exports = router;
