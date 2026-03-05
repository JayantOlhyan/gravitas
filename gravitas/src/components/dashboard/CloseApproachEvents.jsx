import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../shared/GlassCard';
import { useNeoFeed } from '../../hooks/useNEOData';

export default function CloseApproachEvents() {
    const { data: feedData, isLoading } = useNeoFeed();

    let approaches = [];
    if (feedData && feedData.near_earth_objects) {
        Object.values(feedData.near_earth_objects).forEach(arr => {
            approaches.push(...arr);
        });
        approaches.sort((a, b) => {
            return new Date(a.close_approach_data[0].close_approach_date) - new Date(b.close_approach_data[0].close_approach_date);
        });
    }

    return (
        <GlassCard className="flex flex-col h-full border-none shadow-none md:border-solid md:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-white font-bold text-[13px] uppercase tracking-wider">Close Approach Events</h2>
                <Link to="/neos" className="text-[var(--text-muted-light)] hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <span className="text-[var(--text-muted)] text-[12px] animate-pulse">Tracking trajectories...</span>
                </div>
            ) : (
                <div className="flex flex-col gap-2.5 overflow-y-auto custom-scrollbar pr-1 flex-1">
                    {approaches.slice(0, 4).map((neo) => (
                        <div key={neo.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg bg-[rgba(10,22,40,0.5)] border border-[var(--border-subtle)] hover:bg-[rgba(10,22,40,0.8)] transition-colors gap-1 sm:gap-0">
                            <div className="flex items-center gap-2.5">
                                <div className="bg-[var(--accent-orange)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap">
                                    {neo.close_approach_data[0].close_approach_date}
                                </div>
                                <span className="text-white font-bold text-[12px] tracking-wide truncate max-w-[100px] sm:max-w-none">{neo.name}</span>
                            </div>
                            <div className="flex items-center gap-4 sm:gap-5 mt-1 sm:mt-0">
                                <div className="flex flex-col items-end">
                                    <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-widest">Miss Dist</span>
                                    <span className="text-[var(--accent-cyan)] font-mono text-[10px] font-bold">
                                        {parseFloat(neo.close_approach_data[0].miss_distance.astronomical).toFixed(4)} AU
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-widest">Velocity</span>
                                    <span className="text-white font-mono text-[10px]">
                                        {parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_second).toFixed(1)} km/s
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </GlassCard>
    );
}
