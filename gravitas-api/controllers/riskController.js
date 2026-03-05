const riskEngine = require('../services/riskEngine');

exports.getScore = async (req, res, next) => {
    res.json({ id: req.params.id, score: 7.5 });
};

exports.computeWindows = async (req, res, next) => {
    try {
        const { alt, inc, start, end } = req.body;

        const targetAlt = alt ? parseFloat(alt) : 500;
        const targetInc = inc ? parseFloat(inc) : 97.4;
        const dateStart = start || new Date().toISOString();
        const dateEnd = end || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        const data = await riskEngine.computeOptimalWindows(targetAlt, targetInc, dateStart, dateEnd);
        res.json(data);
    } catch (e) {
        next(e);
    }
};
