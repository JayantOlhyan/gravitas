const axios = require('axios');
const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

function getDateRange() {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 30);
    return {
        startStr: start.toISOString().split('T')[0],
        endStr: end.toISOString().split('T')[0]
    };
}

async function getFlares() {
    const { startStr, endStr } = getDateRange();
    const url = `https://api.nasa.gov/DONKI/FLR?startDate=${startStr}&endDate=${endStr}&api_key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (e) {
        return [];
    }
}

async function getCmes() {
    const { startStr, endStr } = getDateRange();
    const url = `https://api.nasa.gov/DONKI/CME?startDate=${startStr}&endDate=${endStr}&api_key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (e) {
        return [];
    }
}

async function getCurrentWeatherSummary() {
    const url = `https://api.nasa.gov/DONKI/notifications?type=all&api_key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        return (response.data || []).slice(0, 10);
    } catch (e) {
        return [];
    }
}

module.exports = { getFlares, getCmes, getCurrentWeatherSummary };
