import { useMutation } from '@tanstack/react-query';
import { computeOptimalWindows } from '../services/riskService';

export const useMissionOptimizer = () => {
    return useMutation({
        mutationFn: computeOptimalWindows
    });
};
