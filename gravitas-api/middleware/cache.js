const NodeCache = require('node-cache');
// Standard TTL defaults to 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

function cacheMiddleware(duration) {
    return (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }
        const key = req.originalUrl;
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            return res.json(cachedResponse);
        } else {
            res.originalJson = res.json;
            res.json = (body) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    cache.set(key, body, duration);
                }
                res.originalJson(body);
            };
            next();
        }
    };
}

module.exports = { cache, cacheMiddleware };
