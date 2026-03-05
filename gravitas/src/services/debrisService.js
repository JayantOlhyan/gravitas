import api from './api';

export const getDebrisList = async (limit = 2000) => {
    const res = await api.get(`/debris/list?limit=${limit}`);
    return res.data;
};

export const getTopRiskDebris = async () => {
    const res = await api.get('/debris/risk-top');
    return res.data;
};

export const getDebrisById = async (id) => {
    const res = await api.get(`/debris/${id}`);
    return res.data;
};
