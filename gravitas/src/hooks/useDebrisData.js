import { useQuery } from '@tanstack/react-query';
import { getDebrisList, getTopRiskDebris } from '../services/debrisService';

export const useDebrisList = (limit) => {
    return useQuery({
        queryKey: ['debris', 'list', limit],
        queryFn: () => getDebrisList(limit),
        staleTime: 14400 * 1000 // 4 hours
    });
};

export const useTopRiskDebris = () => {
    return useQuery({
        queryKey: ['debris', 'top-risk'],
        queryFn: getTopRiskDebris,
        staleTime: 1800 * 1000,
        refetchInterval: 1800 * 1000
    });
};
