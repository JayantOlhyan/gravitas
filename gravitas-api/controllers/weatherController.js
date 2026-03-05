const weatherService = require('../services/nasaWeatherService');

exports.getCurrent = async (req, res, next) => {
    try {
        const data = await weatherService.getCurrentWeatherSummary();
        res.json({ notifications: data });
    } catch (err) {
        next(err);
    }
};

exports.getFlares = async (req, res, next) => {
    try {
        const data = await weatherService.getFlares();
        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.getCme = async (req, res, next) => {
    try {
        const data = await weatherService.getCmes();
        res.json(data);
    } catch (err) {
        next(err);
    }
};
