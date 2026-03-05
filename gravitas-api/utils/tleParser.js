const satellite = require('satellite.js');

function parseTLE(tleLine1, tleLine2, name = "Unknown") {
    try {
        const satrec = satellite.twoline2satrec(tleLine1, tleLine2);
        // Propagate to current time
        const positionAndVelocity = satellite.propagate(satrec, new Date());
        if (!positionAndVelocity.position) return null;

        // Convert to geographic
        const positionEci = positionAndVelocity.position;
        const gmst = satellite.gstime(new Date());
        const positionGd = satellite.eciToGeodetic(positionEci, gmst);
        const velocity = positionAndVelocity.velocity;

        // Calculate velocity in km/s roughly
        const v_km_s = Math.sqrt(
            Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2) + Math.pow(velocity.z, 2)
        );

        const lat = satellite.degreesLat(positionGd.latitude);
        const lon = satellite.degreesLong(positionGd.longitude);
        const alt = positionGd.height; // km

        let orbitType = 'Unknown';
        if (alt < 2000) orbitType = 'LEO';
        else if (alt < 35000) orbitType = 'MEO';
        else if (alt > 35000 && alt < 36000) orbitType = 'GEO';
        else orbitType = 'HEO';

        const noradId = tleLine1.substring(2, 7).trim();

        return {
            id: noradId,
            name: name.trim(),
            line1: tleLine1,
            line2: tleLine2,
            lat,
            lon,
            alt,
            velocity: v_km_s,
            orbitType,
            inclination: satrec.inclo * (180 / Math.PI),
            eccentricity: satrec.ecco
        };
    } catch (err) {
        return null;
    }
}

module.exports = { parseTLE };
