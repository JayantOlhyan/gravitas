import api from './api';

export const computeOptimalWindows = async (params) => {
    const res = await api.post('/risk/windows', params);
    return res.data;
};
