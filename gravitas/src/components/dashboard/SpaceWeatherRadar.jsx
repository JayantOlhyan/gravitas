import React from 'react';
import GlassCard from '../shared/GlassCard';
import StatusDot from '../shared/StatusDot';
import { useCurrentWeather, useSolarFlares } from '../../hooks/useSpaceWeather';

export default function SpaceWeatherRadar() {
    const { data: currentEvents } = useCurrentWeather();
    const { data: flares } = useSolarFlares();

    const isFlareActive = Array.isArray(flares) && flares.length > 0;
    const isCmeActive = Array.isArray(currentEvents) && currentEvents.some(e => e?.messageType?.includes('CME'));

    return (
        <GlassCard className="flex flex-col overflow-hidden border-none shadow-none md:border-solid md:shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:min-h-[180px]">
            <h2 className="text-white font-bold text-[13px] uppercase tracking-wider mb-2 text-center w-full truncate">Space Weather Monitor</h2>

            <div className="flex items-center justify-between mb-3 bg-[var(--bg-card-2)] p-2 rounded-lg border border-[var(--border-subtle)]">
                <div className="flex items-center gap-1.5">
                    <StatusDot status={isFlareActive ? 'active threat' : 'safe'} pulse={isFlareActive} />
                    <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">
                        Solar Flare
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <StatusDot status={isCmeActive ? 'warning' : 'safe'} pulse={isCmeActive} />
                    <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">
                        CME Activity
                    </span>
                </div>
            </div>

            <div className="relative flex-1 rounded-lg overflow-hidden flex items-center justify-center bg-[rgba(0,0,0,0.4)] border border-[rgba(0,212,255,0.1)] min-h-[100px]">
                {/* Radar Background Circles */}
                <div className="absolute w-[80%] aspect-square rounded-full border border-[rgba(0,212,255,0.2)]"></div>
                <div className="absolute w-[50%] aspect-square rounded-full border border-[rgba(0,212,255,0.3)]"></div>
                <div className="absolute w-[20%] aspect-square rounded-full border border-[rgba(0,212,255,0.5)] bg-[rgba(0,212,255,0.1)]"></div>

                {/* Crosshairs */}
                <div className="absolute w-full h-[1px] bg-[rgba(0,212,255,0.2)]"></div>
                <div className="absolute h-full w-[1px] bg-[rgba(0,212,255,0.2)]"></div>

                {/* Radar Sweep Animation (CSS fallback) */}
                <div className="absolute w-[50%] h-[50%] top-0 right-0 origin-bottom-left border-r border-[var(--accent-green)] bg-gradient-to-br from-transparent to-[rgba(0,230,118,0.2)] radar-sweep"
                    style={{ borderBottomRightRadius: '100%' }}>
                </div>

                <style>
                    {`
               .radar-sweep {
                 animation: spin 3s linear infinite;
               }
               @keyframes spin {
                 from { transform: rotate(0deg); }
                 to { transform: rotate(360deg); }
               }
            `}
                </style>

                {/* Mock Dots */}
                <div className="absolute top-[30%] left-[60%] w-1.5 h-1.5 bg-[var(--accent-orange)] rounded-full animate-pulse shadow-[0_0_8px_var(--accent-orange)]"></div>
                <div className="absolute top-[70%] left-[20%] w-1.5 h-1.5 bg-[var(--accent-green)] rounded-full opacity-70"></div>
                <div className="absolute top-[40%] left-[30%] w-1.5 h-1.5 bg-[var(--accent-yellow)] rounded-full opacity-90 shadow-[0_0_8px_var(--accent-yellow)]"></div>
            </div>
        </GlassCard>
    );
}
