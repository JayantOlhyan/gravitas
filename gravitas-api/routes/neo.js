const express = require('express');
const router = express.Router();
const neoController = require('../controllers/neoController');
const { cacheMiddleware } = require('../middleware/cache');

// 3600 seconds = 1 hour
router.get('/feed', cacheMiddleware(3600), neoController.getFeed);
router.get('/hazardous', cacheMiddleware(3600), neoController.getHazardous);
router.get('/:id', cacheMiddleware(3600), neoController.getById);

module.exports = router;
