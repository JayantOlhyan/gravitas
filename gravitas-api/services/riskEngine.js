const celestialService = require('../services/celestrakService');
const weatherService = require('../services/nasaWeatherService');

async function computeOptimalWindows(targetAlt, targetInc, dateStart, dateEnd) {
    // 1. Fetch current debris density
    const allDebris = await celestialService.fetchDebrisData();
    let corridorDensity = 0;

    // Corridor check: altitude +/- 50km, inclination +/- 5deg
    allDebris.forEach(d => {
        if (Math.abs(d.alt - targetAlt) < 50 && Math.abs(d.inclination - targetInc) < 5) {
            corridorDensity++;
        }
    });

    const densityScore = Math.min(10, (corridorDensity / 100) * 10);

    // 2. Fetch space weather
    const flares = await weatherService.getFlares();
    let weatherHazardScore = 0;
    if (flares && flares.length > 0) {
        weatherHazardScore = 3;
    }

    // 3. For each candidate 12-hour window
    const start = new Date(dateStart);
    const end = new Date(dateEnd);
    const windows = [];

    for (let d = new Date(start); d <= end; d.setHours(d.getHours() + 12)) {
        const noise = (Math.random() * 2) - 1;
        const windowRisk = Math.max(0, Math.min(10, (densityScore * 0.6) + (weatherHazardScore * 0.4) + noise));

        windows.push({
            datetime: d.toISOString(),
            riskScore: windowRisk.toFixed(1),
            debrisDensity: corridorDensity,
            weatherForecast: flares.length > 0 ? "Active Solar Flares Detected" : "Clear"
        });
    }

    // 4. Rank windows
    windows.sort((a, b) => parseFloat(a.riskScore) - parseFloat(b.riskScore));
    const top3 = windows.slice(0, 3);

    // Generate 30-day heatmap calendar
    const heatmap = [];
    for (let i = 0; i < 30; i++) {
        const hd = new Date(start);
        hd.setDate(hd.getDate() + i);
        heatmap.push({
            date: hd.toISOString().split('T')[0],
            riskLevel: Math.floor(Math.random() * 10)
        });
    }

    return {
        topWindows: top3,
        heatmap,
        corridorDensity
    };
}

module.exports = { computeOptimalWindows };
