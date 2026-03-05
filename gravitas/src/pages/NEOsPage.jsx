import React from 'react';
import GlassCard from '../components/shared/GlassCard';
import { useNeoFeed } from '../hooks/useNEOData';
import RiskBadge from '../components/shared/RiskBadge';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import useAppStore from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';

export default function NEOsPage() {
    const { data: feedData, isLoading } = useNeoFeed();
    const setSelectedObject = useAppStore(state => state.setSelectedObject);
    const setDetailPopupOpen = useAppStore(state => state.setDetailPopupOpen);
    const navigate = useNavigate();

    let approaches = [];
    if (feedData && feedData.near_earth_objects) {
        Object.values(feedData.near_earth_objects).forEach(arr => {
            approaches.push(...arr);
        });
        approaches.sort((a, b) => {
            return new Date(a.close_approach_data[0].close_approach_date) - new Date(b.close_approach_data[0].close_approach_date);
        });
    }

    const hazardousCount = approaches.filter(a => a.is_potentially_hazardous_asteroid).length;
    const nextApproach = approaches.length > 0 ? approaches[0] : null;

    const handleView = (neo) => {
        const approach = neo.close_approach_data[0];
        const adaptedObj = {
            id: neo.id,
            name: neo.name,
            alt: approach.miss_distance.kilometers || (parseFloat(approach.miss_distance.astronomical) * 149597870.7).toString(),
            velocity: approach.relative_velocity.kilometers_per_second,
            inclination: 0,
            orbitType: 'NEO',
            riskScore: neo.is_potentially_hazardous_asteroid ? '8.5' : '2.1'
        };
        setSelectedObject(adaptedObj);
        setDetailPopupOpen(true);
        navigate('/');
    };

    return (
        <div className="flex-1 w-full h-[calc(100vh-[64px])] overflow-y-auto p-4 md:p-6 gap-6 relative z-10 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-4 md:mt-0">
                <GlassCard className="flex flex-col items-center justify-center py-6 text-center border-none shadow-none md:border-solid md:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <span className="text-3xl md:text-4xl font-black text-[var(--accent-cyan)] mb-1">{feedData?.element_count || 0}</span>
                    <span className="text-[9px] md:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">NEOs Tracked</span>
                </GlassCard>
                <GlassCard className="flex flex-col items-center justify-center py-6 text-center border-l-4 border-[var(--accent-orange)] shadow-none md:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <span className="text-3xl md:text-4xl font-black text-[var(--accent-orange)] mb-1">{hazardousCount}</span>
                    <span className="text-[9px] md:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Potentially Hazardous</span>
                </GlassCard>
                <GlassCard className="flex flex-col items-center justify-center py-6 text-center col-span-1 sm:col-span-2 md:col-span-2 border-none shadow-none md:border-solid md:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <span className="text-lg md:text-2xl font-black text-white mb-2 truncate w-full px-4">{nextApproach ? nextApproach.name : 'Unknown'}</span>
                    <span className="text-[9px] md:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                        Next Approach: {nextApproach ? nextApproach.close_approach_data[0].close_approach_date : 'N/A'}
                    </span>
                </GlassCard>
            </div>

            <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-wider mb-4 border-b border-[var(--border-subtle)] pb-2 flex items-center justify-between">
                <span>Close Approach Timeline</span>
                <span className="text-[9px] md:text-[10px] text-[var(--text-muted)] bg-[var(--bg-card)] px-3 py-1 rounded-full border border-[var(--border-subtle)]">NEXT 7 DAYS</span>
            </h2>

            {isLoading ? (
                <LoadingSpinner text="Mapping Asteroid Trajectories..." />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {approaches.map((neo) => (
                        <GlassCard key={neo.id} className="flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border-none md:border-solid shadow-none md:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                            {neo.is_potentially_hazardous_asteroid && (
                                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[var(--accent-red)] to-transparent opacity-50 z-0"></div>
                            )}
                            <div className="flex justify-between items-start z-10">
                                <div className="bg-[var(--accent-blue)] text-white text-[9px] md:text-[10px] font-bold px-2 md:px-2.5 py-1 rounded-full uppercase tracking-widest">
                                    {neo.close_approach_data[0].close_approach_date}
                                </div>
                                <RiskBadge score={neo.is_potentially_hazardous_asteroid ? '8.5' : '2.1'} className="scale-90 md:scale-100 origin-top-right" />
                            </div>

                            <div className="z-10">
                                <h3 className="text-base md:text-lg font-bold text-white mb-1 truncate tracking-wide">{neo.name}</h3>
                                <span className="text-[10px] md:text-[11px] font-mono text-[var(--text-muted-light)]">ID: {neo.id}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-y-3 gap-x-2 md:gap-4 mt-1 md:mt-2 z-10">
                                <div className="flex flex-col">
                                    <span className="text-[8px] md:text-[9px] text-[var(--text-muted)] uppercase tracking-widest leading-none mb-1.5">Miss Dist</span>
                                    <span className="text-[var(--accent-cyan)] font-mono text-[13px] md:text-sm font-bold truncate">
                                        {parseFloat(neo.close_approach_data[0].miss_distance.astronomical).toFixed(3)} AU
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] md:text-[9px] text-[var(--text-muted)] uppercase tracking-widest leading-none mb-1.5">Velocity</span>
                                    <span className="text-white font-mono text-[13px] md:text-sm font-bold truncate">
                                        {parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_second).toFixed(1)} km/s
                                    </span>
                                </div>
                                <div className="flex flex-col col-span-2">
                                    <span className="text-[8px] md:text-[9px] text-[var(--text-muted)] uppercase tracking-widest leading-none mb-1.5">Est. Diameter</span>
                                    <span className="text-white font-mono text-[11px] md:text-sm truncate">
                                        {Math.round(neo.estimated_diameter.meters.estimated_diameter_min)} - {Math.round(neo.estimated_diameter.meters.estimated_diameter_max)} <span className="text-[9px] md:text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-sans ml-1">meters</span>
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleView(neo)}
                                className="w-full mt-2 md:mt-2 py-2 md:py-2.5 border border-[var(--border-subtle)] text-[9px] md:text-[10px] text-white font-bold uppercase tracking-widest rounded bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors z-10"
                            >
                                View Details
                            </button>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
}
