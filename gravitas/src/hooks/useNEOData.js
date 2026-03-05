import { useQuery } from '@tanstack/react-query';
import { getNeoFeed, getHazardousNeo, getNeoById } from '../services/neoService';

export const useNeoFeed = () => {
    return useQuery({
        queryKey: ['neo', 'feed'],
        queryFn: getNeoFeed,
        staleTime: 3600 * 1000
    });
};

export const useHazardousNeo = () => {
    return useQuery({
        queryKey: ['neo', 'hazardous'],
        queryFn: getHazardousNeo,
        staleTime: 3600 * 1000
    });
};

export const useNeoDetails = (id) => {
    return useQuery({
        queryKey: ['neo', id],
        queryFn: () => getNeoById(id),
        enabled: !!id,
        staleTime: 3600 * 1000
    });
};
