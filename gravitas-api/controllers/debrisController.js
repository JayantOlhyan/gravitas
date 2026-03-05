const celestialService = require('../services/celestrakService');
const NodeCache = require('node-cache');
const appCache = new NodeCache({ stdTTL: 14400 });

let isFetching = false;

async function getOrFetchData() {
    let data = appCache.get('full_debris');
    if (!data && !isFetching) {
        isFetching = true;
        try {
            data = await celestialService.fetchDebrisData();
            appCache.set('full_debris', data);
            console.log("Cached " + data.length + " objects from CelesTrak");
        } catch (e) {
            console.error("Failed CelesTrak cache fetch", e);
        } finally {
            isFetching = false;
        }
    }
    return data || [];
}

// Initial background load
getOrFetchData();

exports.getList = async (req, res, next) => {
    try {
        const data = await getOrFetchData();
        // Return early if still fetching initial load
        if (!data.length) return res.json([]);

        // Return a manageable chunk for the frontend by default unless specified
        const limit = Number(req.query.limit) || 2000;
        res.json(data.slice(0, limit));
    } catch (err) {
        next(err);
    }
};

exports.getTopRisk = async (req, res, next) => {
    try {
        const data = await getOrFetchData();
        if (!data.length) return res.json([]);

        const sorted = [...data].sort((a, b) => {
            return calculateRisk(b) - calculateRisk(a);
        });

        const top20 = sorted.slice(0, 20).map(item => ({
            ...item,
            riskScore: calculateRisk(item)
        }));

        res.json(top20);
    } catch (err) {
        next(err);
    }
};

function calculateRisk(obj) {
    let score = 0;
    if (obj.orbitType === 'LEO') score += 4;
    score += (obj.velocity / 10);
    score += (obj.eccentricity * 10);
    return Math.min(10, score).toFixed(1);
}

exports.getById = async (req, res, next) => {
    try {
        const data = await getOrFetchData();
        const item = data.find(x => x.id === req.params.id);
        if (!item) return res.status(404).json({ error: "Not Found" });
        res.json({
            ...item,
            riskScore: calculateRisk(item)
        });
    } catch (err) {
        next(err);
    }
};
