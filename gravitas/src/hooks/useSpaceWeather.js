import { useQuery } from '@tanstack/react-query';
import { getCurrentWeather, getFlares, getCmes } from '../services/weatherService';

export const useCurrentWeather = () => {
    return useQuery({
        queryKey: ['weather', 'current'],
        queryFn: getCurrentWeather,
        staleTime: 1800 * 1000
    });
};

export const useSolarFlares = () => {
    return useQuery({
        queryKey: ['weather', 'flares'],
        queryFn: getFlares,
        staleTime: 1800 * 1000
    });
};

export const useCmes = () => {
    return useQuery({
        queryKey: ['weather', 'cme'],
        queryFn: getCmes,
        staleTime: 1800 * 1000
    });
};
