const axios = require('axios');
const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

async function fetchNeoFeed() {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 7);

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startStr}&end_date=${endStr}&api_key=${API_KEY}`;

    const response = await axios.get(url);
    return response.data;
}

async function fetchHazardousNeo() {
    const feed = await fetchNeoFeed();
    const hazardous = [];
    if (feed && feed.near_earth_objects) {
        Object.values(feed.near_earth_objects).forEach(dateArray => {
            dateArray.forEach(neo => {
                if (neo.is_potentially_hazardous_asteroid) {
                    hazardous.push(neo);
                }
            });
        });
    }
    return hazardous;
}

async function fetchNeoById(id) {
    const url = `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${API_KEY}`;
    const response = await axios.get(url);
    return response.data;
}

module.exports = { fetchNeoFeed, fetchHazardousNeo, fetchNeoById };
