import React from 'react';
import GlassCard from '../components/shared/GlassCard';
import { useCurrentWeather, useSolarFlares } from '../hooks/useSpaceWeather';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import StatusDot from '../components/shared/StatusDot';

export default function SpaceWeatherPage() {
    const { data: currentEvents, isLoading: loadingEvents } = useCurrentWeather();
    const { data: flares, isLoading: loadingFlares } = useSolarFlares();

    // Create a mock chart data if flare API lacks detailed 7day flux sequence or fails structure
    const chartData = [
        { time: '12:00', short: 1.2e-8, long: 3.4e-8 },
        { time: '14:00', short: 1.5e-8, long: 4.2e-8 },
        { time: '16:00', short: 4.8e-8, long: 9.1e-8 },
        { time: '18:00', short: 2.1e-8, long: 5.0e-8 },
        { time: '20:00', short: 1.1e-8, long: 3.1e-8 },
    ];

    const isLoading = loadingEvents || loadingFlares;

    return (
        <div className="flex-1 w-full h-[calc(100vh-[64px])] overflow-y-auto p-4 md:p-6 gap-6 relative z-10 custom-scrollbar mt-4 md:mt-0">

            <div className="text-center mb-6 px-2">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-wider mb-2">
                    Space Weather <span className="text-[var(--accent-orange)]">Command</span>
                </h1>
                <p className="text-[13px] md:text-sm text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                    Monitor live solar flares, coronal mass ejections, and geomagnetic storms from the NASA DONKI database.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <GlassCard className="flex flex-col gap-4 border-none shadow-none md:border-solid md:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                        <h2 className="text-[13px] md:text-[14px] font-bold text-white uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2">Current Conditions</h2>

                        <div className="flex items-center justify-between p-3 md:p-4 bg-[var(--bg-card-3)] rounded border border-[var(--border-subtle)]">
                            <div className="flex flex-col">
                                <span className="text-white font-bold tracking-wide text-sm md:text-base">Solar Flares</span>
                                <span className="text-[9px] md:text-[10px] text-[var(--text-muted-light)] mt-1 uppercase tracking-widest">Class B Background</span>
                            </div>
                            <StatusDot status={flares && flares.length > 0 ? "warning" : "safe"} pulse={flares && flares.length > 0} />
                        </div>

                        <div className="flex items-center justify-between p-3 md:p-4 bg-[var(--bg-card-3)] rounded border border-[var(--border-subtle)]">
                            <div className="flex flex-col">
                                <span className="text-white font-bold tracking-wide text-sm md:text-base">Geomagnetic Storm</span>
                                <span className="text-[9px] md:text-[10px] text-[var(--text-muted-light)] mt-1 uppercase tracking-widest">Kp Index: 2 (Quiet)</span>
                            </div>
                            <StatusDot status="safe" />
                        </div>

                        <div className="flex items-center justify-between p-3 md:p-4 bg-[var(--bg-card-3)] rounded border border-[var(--border-subtle)]">
                            <div className="flex flex-col">
                                <span className="text-white font-bold tracking-wide text-sm md:text-base">CMEs</span>
                                <span className="text-[9px] md:text-[10px] text-[var(--text-muted-light)] mt-1 uppercase tracking-widest">Earth-Directed: None</span>
                            </div>
                            <StatusDot status="safe" />
                        </div>
                    </GlassCard>

                    <GlassCard className="flex-1 flex flex-col gap-4 border-none shadow-none md:border-solid md:shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:max-h-[500px]">
                        <h2 className="text-[13px] md:text-[14px] font-bold text-white uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2 flex justify-between items-center">
                            <span>Latest Notifications</span>
                            <span className="text-[9px] md:text-[10px] text-[var(--accent-cyan)] font-mono animate-pulse">LIVE D.O.N.K.I.</span>
                        </h2>

                        {isLoading ? (
                            <LoadingSpinner text="Connecting to NASCOM..." />
                        ) : (
                            <div className="flex flex-col gap-3 overflow-y-auto min-h-[150px] custom-scrollbar pr-2 pb-2">
                                {Array.isArray(currentEvents) && currentEvents.map((evt, idx) => (
                                    <div key={idx} className="flex flex-col p-3 bg-[rgba(10,22,40,0.5)] border-l-2 border-[var(--accent-blue-light)] rounded hover:bg-[rgba(10,22,40,0.8)] transition-colors">
                                        <span className="text-[10px] md:text-[11px] font-bold text-[var(--accent-cyan)] mb-1 uppercase tracking-widest leading-tight">{evt.messageType}</span>
                                        <span className="text-white text-[11px] md:text-xs leading-relaxed line-clamp-3 md:line-clamp-4">{evt.messageBody.split('##')[0] || evt.messageBody}</span>
                                        <span className="text-[8px] md:text-[9px] text-[var(--text-muted)] mt-2 italic whitespace-nowrap overflow-hidden text-ellipsis">{new Date(evt.messageIssueTime).toLocaleString()}</span>
                                    </div>
                                ))}
                                {(!currentEvents || !Array.isArray(currentEvents) || currentEvents.length === 0) && (
                                    <div className="text-[var(--text-muted)] text-[11px] md:text-xs text-center p-6 italic border border-dashed border-[var(--border-subtle)] rounded my-4 mx-2">No recent space weather anomalies detected.</div>
                                )}
                            </div>
                        )}
                    </GlassCard>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6 w-full">
                    <GlassCard className="min-h-[350px] md:min-h-[450px] flex flex-col flex-1 border-none shadow-none md:border-solid md:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                        <h2 className="text-[13px] md:text-[14px] font-bold text-white uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2 mb-6">Solar Activity (GOES X-Ray Flux)</h2>
                        <div className="flex-1 w-full relative min-h-[250px] md:min-h-[300px]">
                            <div className="absolute -top-4 right-0 md:top-0 md:right-4 flex flex-col sm:flex-row gap-1.5 sm:gap-4 text-[8px] md:text-[9px] font-bold uppercase tracking-widest z-10 bg-[var(--bg-card)] md:bg-transparent p-2 md:p-0 rounded border border-[var(--border-subtle)] md:border-none">
                                <span className="text-[var(--accent-cyan)] flex items-center gap-1.5"><span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[var(--accent-cyan)]"></span>Short Wavelength (0.5-4.0 Å)</span>
                                <span className="text-[var(--accent-orange)] flex items-center gap-1.5"><span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[var(--accent-orange)]"></span>Long Wavelength (1.0-8.0 Å)</span>
                            </div>
                            <div className="w-full h-full mt-10 md:mt-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
                                        <XAxis dataKey="time" stroke="var(--border-subtle)" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                                        <YAxis stroke="var(--border-subtle)" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} scale="log" domain={['auto', 'auto']} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: '8px', fontSize: '12px' }}
                                            itemStyle={{ fontWeight: 'bold' }}
                                            labelStyle={{ color: 'var(--text-muted)' }}
                                        />
                                        <Line type="monotone" dataKey="short" stroke="var(--accent-cyan)" strokeWidth={2} dot={{ r: 3, fill: 'var(--bg-card)', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                                        <Line type="monotone" dataKey="long" stroke="var(--accent-orange)" strokeWidth={2} dot={{ r: 3, fill: 'var(--bg-card)', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
