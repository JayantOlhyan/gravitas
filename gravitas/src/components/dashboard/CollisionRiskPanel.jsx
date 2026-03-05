import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import GlassCard from '../shared/GlassCard';
import useAppStore from '../../store/useAppStore';
import { useTopRiskDebris } from '../../hooks/useDebrisData';
import { useHazardousNeo } from '../../hooks/useNEOData';

export default function CollisionRiskPanel() {
    const { data: topRisks, isLoading } = useTopRiskDebris();
    const { data: hazardousNeos } = useHazardousNeo();
    const setSelectedObject = useAppStore(state => state.setSelectedObject);
    const setDetailPopupOpen = useAppStore(state => state.setDetailPopupOpen);

    const handleSelectObj = (obj) => {
        setSelectedObject(obj);
        setDetailPopupOpen(true);
    };

    return (
        <GlassCard className="h-full flex flex-col gap-5 border-none shadow-none md:border-solid md:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <h2 className="text-[16px] font-bold text-white uppercase tracking-wider">Collision Risk Engine</h2>

            <div className="flex flex-col gap-3">
                <span className="text-[11px] font-bold text-[var(--accent-orange)] uppercase tracking-widest border-b border-[var(--border-subtle)] pb-1">
                    High Risk Alerts
                </span>
                {isLoading && <div className="text-[var(--text-muted)] text-[12px] animate-pulse">Scanning orbital space...</div>}

                {topRisks?.slice(0, 3).map((obj) => (
                    <div
                        key={obj.id}
                        onClick={() => handleSelectObj(obj)}
                        className="flex items-start gap-3 p-3 rounded-lg border-l-[3px] border-[var(--accent-orange)] bg-[var(--bg-card-3)] cursor-pointer hover:bg-[var(--bg-card-2)] transition-colors group"
                    >
                        <div className="w-[50px] h-[50px] bg-black rounded flex-shrink-0 overflow-hidden border border-[var(--border-subtle)] opacity-80 group-hover:opacity-100 flex items-center justify-center">
                            <span className="text-[7px] text-[var(--accent-cyan)] font-mono">{obj.id}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-[13px] tracking-wide truncate max-w-[120px]">{obj.name || `DEB-${obj.id}`}</span>
                            <div className="flex items-center gap-1 mt-1">
                                <AlertTriangle className="w-3 h-3 text-[var(--accent-orange)]" />
                                <span className="text-[10px] text-[var(--text-muted-light)]">Risk: {obj.riskScore}/10</span>
                            </div>
                            <span className="text-[9px] text-[var(--accent-orange)] mt-1 font-mono uppercase tracking-widest">Conjunction &lt; 12h</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3 mt-1">
                <span className="text-[11px] font-bold text-[var(--accent-yellow)] uppercase tracking-widest border-b border-[var(--border-subtle)] pb-1">
                    NEO Watch
                </span>

                {hazardousNeos?.slice(0, 1).map((neo) => (
                    <div key={neo.id} className="flex flex-col p-3 rounded-lg border-l-[3px] border-[var(--accent-yellow)] bg-[var(--bg-card-3)] cursor-pointer hover:bg-[var(--bg-card-2)] transition-colors">
                        <span className="text-white font-bold text-[13px] tracking-wide">{neo.name}</span>
                        <div className="flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3 text-[var(--accent-yellow)]" />
                            <span className="text-[10px] text-[var(--text-muted-light)] uppercase tracking-widest">
                                {parseFloat(neo.close_approach_data?.[0]?.miss_distance?.astronomical || 0).toFixed(4)} AU
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3 mt-1 flex-1">
                <span className="text-[11px] font-bold text-[var(--accent-cyan)] uppercase tracking-widest border-b border-[var(--border-subtle)] pb-1">
                    Recommendations
                </span>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--bg-card-3)] text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    <Info className="w-4 h-4 text-[var(--accent-cyan)] mt-0.5 flex-shrink-0" />
                    Adjusting SSO orbits &gt; 650km is recommended due to temporary debris density spike in sector Alpha.
                </div>
            </div>

            <button className="w-full py-2.5 bg-transparent border border-[var(--accent-orange)] text-[var(--accent-orange)] rounded font-bold text-[11px] tracking-widest uppercase hover:bg-[var(--accent-orange)] hover:text-white transition-colors duration-300">
                View All Alerts
            </button>

        </GlassCard>
    );
}
