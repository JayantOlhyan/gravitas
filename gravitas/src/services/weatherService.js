import api from './api';

export const getCurrentWeather = async () => {
    const res = await api.get('/weather/current');
    return res.data;
};

export const getFlares = async () => {
    const res = await api.get('/weather/flares');
    return res.data;
};

export const getCmes = async () => {
    const res = await api.get('/weather/cme');
    return res.data;
};
