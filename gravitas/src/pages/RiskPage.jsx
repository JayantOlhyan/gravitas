import React, { useState } from 'react';
import GlassCard from '../components/shared/GlassCard';
import { useMissionOptimizer } from '../hooks/useRiskEngine';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import RiskBadge from '../components/shared/RiskBadge';

export default function RiskPage() {
    const [alt, setAlt] = useState(500);
    const [inc, setInc] = useState(97.4);
    const [start, setStart] = useState(new Date().toISOString().split('T')[0]);
    const [end, setEnd] = useState(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);

    const { mutate, data, isPending, isError, error } = useMissionOptimizer();

    const handleCompute = () => {
        mutate({ alt, inc, start, end });
    };

    return (
        <div className="flex-1 w-full h-[calc(100vh-64px)] overflow-y-auto p-4 md:p-6 custom-scrollbar flex flex-col items-center">
            <div className="w-full max-w-5xl flex flex-col gap-6 mt-2 md:mt-4">
                <div className="text-center mb-2 md:mb-4 px-2">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-wider mb-2">
                        Mission Window <span className="text-[var(--accent-orange)]">Optimizer</span>
                    </h1>
                    <p className="text-[13px] md:text-sm text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                        Calculate the safest launch windows by cross-referencing projected debris orbital density against solar flare schedules inside your requested time corridor.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassCard className="md:col-span-1 flex flex-col gap-4 border-none shadow-none md:border-solid md:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                        <h2 className="text-white font-bold text-[14px] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2">Launch Parameters</h2>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Target Altitude (km)</label>
                            <input type="number" value={alt} onChange={e => setAlt(e.target.value)} className="bg-[rgba(0,0,0,0.3)] border border-[var(--border-subtle)] rounded p-2.5 text-white text-sm focus:border-[var(--accent-orange)] focus:outline-none transition-colors" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Target Inclination (deg)</label>
                            <input type="number" value={inc} onChange={e => setInc(e.target.value)} className="bg-[rgba(0,0,0,0.3)] border border-[var(--border-subtle)] rounded p-2.5 text-white text-sm focus:border-[var(--accent-orange)] focus:outline-none transition-colors" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Window Start Date</label>
                            <input type="date" value={start} onChange={e => setStart(e.target.value)} className="bg-[rgba(0,0,0,0.3)] border border-[var(--border-subtle)] rounded p-2.5 text-white text-sm focus:border-[var(--accent-orange)] focus:outline-none transition-colors" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Window End Date</label>
                            <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="bg-[rgba(0,0,0,0.3)] border border-[var(--border-subtle)] rounded p-2.5 text-white text-sm focus:border-[var(--accent-orange)] focus:outline-none transition-colors" />
                        </div>

                        <button
                            onClick={handleCompute}
                            disabled={isPending}
                            className="mt-4 w-full bg-[var(--accent-orange)] text-white font-bold text-sm uppercase tracking-widest py-3 rounded hover:bg-[var(--accent-orange-dark)] transition-colors flex justify-center items-center"
                        >
                            {isPending ? 'Computing...' : 'Compute Windows'}
                        </button>
                    </GlassCard>

                    <div className="md:col-span-2 flex flex-col gap-6 w-full">
                        <GlassCard className="min-h-[300px] flex flex-col flex-1 border-none shadow-none md:border-solid md:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                            <h2 className="text-white font-bold text-[14px] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2 mb-4">Results & Recommendations</h2>

                            {isPending ? (
                                <div className="flex-1 flex flex-col items-center justify-center gap-4 mt-8 md:mt-16">
                                    <LoadingSpinner text="Running orbital collision simulations..." />
                                    <div className="text-[10px] text-[var(--accent-cyan)] font-mono animate-pulse uppercase tracking-widest text-center max-w-xs mt-2">
                                        Cross-referencing trajectories against solar weather...
                                    </div>
                                </div>
                            ) : isError ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[var(--text-muted)] mt-8 md:mt-16">
                                    <span className="text-[var(--accent-red)] font-bold text-sm uppercase tracking-widest mb-2">Simulation Failed</span>
                                    <span className="text-[11px] leading-relaxed max-w-md">NASCOM connection timed out or rejected. Please try again.</span>
                                </div>
                            ) : !data ? (
                                <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] text-sm">Awaiting telemetry inputs...</div>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
                                        <div className="bg-[rgba(0,0,0,0.3)] border border-[var(--border-subtle)] p-4 rounded text-center col-span-2 md:col-span-1">
                                            <span className="block text-3xl font-black text-[var(--accent-cyan)]">{data.corridorDensity}</span>
                                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Objects in Corridor</span>
                                        </div>
                                    </div>
                                    <h3 className="text-[12px] font-bold text-[var(--accent-orange)] uppercase tracking-widest">Top Safe Windows</h3>
                                    <div className="flex flex-col gap-3">
                                        {data.topWindows.map((win, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[var(--bg-card-3)] rounded border-l-4 border-[var(--accent-green)] gap-3 sm:gap-0">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold tracking-wider text-[15px]">{new Date(win.datetime).toLocaleString()}</span>
                                                    <span className="text-[11px] text-[var(--text-muted-light)] mt-1.5 flex items-center gap-1.5 font-medium">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted-light)] inline-block"></span>
                                                        Weather: {win.weatherForecast}
                                                    </span>
                                                </div>
                                                <RiskBadge score={win.riskScore} className="self-start sm:self-auto py-1.5 px-3 text-xs w-[60px]" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
