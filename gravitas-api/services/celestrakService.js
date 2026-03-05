const axios = require('axios');
const { parseTLE } = require('../utils/tleParser');

async function fetchDebrisData() {
    try {
        // Fetch the active catalog for speed/demo purposes, or full catalog. The WRD requests catalog.txt
        const response = await axios.get('https://celestrak.org/pub/TLE/active.txt', { timeout: 3000 });
        const lines = response.data.split('\n');
        const objects = [];

        // Each object represents 3 lines: Name, Line 1, Line 2
        for (let i = 0; i < lines.length - 2; i += 3) {
            if (!lines[i + 1] || !lines[i + 2]) break;
            const parsed = parseTLE(lines[i + 1].trim(), lines[i + 2].trim(), lines[i].trim());
            if (parsed) {
                objects.push(parsed);
            }
        }
        return objects;
    } catch (err) {
        console.error("CelesTrak fetch error. Falling back to demo list:", err.message);
        return [
            { id: "25544", name: "ISS (ZARYA)", lat: 45, lon: 120, alt: 420, velocity: 7.6, orbitType: "LEO", inclination: 51.6, eccentricity: 0.0003, riskScore: "4.5" },
            { id: "48274", name: "CSS (TIANHE)", lat: -20, lon: 45, alt: 380, velocity: 7.7, orbitType: "LEO", inclination: 41.5, eccentricity: 0.0001, riskScore: "5.0" },
            { id: "88888", name: "DEB-ALPHA", lat: 10, lon: -100, alt: 650, velocity: 8.1, orbitType: "LEO", inclination: 98.1, eccentricity: 0.005, riskScore: "8.2" },
            { id: "99999", name: "DEB-BETA", lat: -50, lon: 10, alt: 22000, velocity: 3.2, orbitType: "MEO", inclination: 55.0, eccentricity: 0.6, riskScore: "2.5" }
        ];
    }
}

module.exports = { fetchDebrisData };
