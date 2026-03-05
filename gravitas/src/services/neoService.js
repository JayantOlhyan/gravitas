import api from './api';

export const getNeoFeed = async () => {
    const res = await api.get('/neo/feed');
    return res.data;
};

export const getHazardousNeo = async () => {
    const res = await api.get('/neo/hazardous');
    return res.data;
};

export const getNeoById = async (id) => {
    const res = await api.get(`/neo/${id}`);
    return res.data;
};
