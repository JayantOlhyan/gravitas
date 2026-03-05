const neoService = require('../services/nasaNeoService');

exports.getFeed = async (req, res, next) => {
    try {
        const data = await neoService.fetchNeoFeed();
        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.getHazardous = async (req, res, next) => {
    try {
        const data = await neoService.fetchHazardousNeo();
        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const data = await neoService.fetchNeoById(req.params.id);
        res.json(data);
    } catch (err) {
        next(err);
    }
};
