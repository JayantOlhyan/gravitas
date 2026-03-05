import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import GlassCard from '../shared/GlassCard';
import { useDebrisList } from '../../hooks/useDebrisData';

export default function DebrisByOrbitChart() {
    const { data: debrisData } = useDebrisList(2000);

    const chartData = useMemo(() => {
        if (!debrisData) return [];

        const counts = { LEO: 0, MEO: 0, GEO: 0, HEO: 0 };
        debrisData.forEach(d => {
            if (counts[d.orbitType] !== undefined) {
                counts[d.orbitType]++;
            }
        });

        return [
            { name: 'LEO', count: counts.LEO, fill: '#00D4FF' },
            { name: 'MEO', count: counts.MEO, fill: '#1A6EBD' },
            { name: 'GEO', count: counts.GEO, fill: '#FF6B2B' },
            { name: 'HEO', count: counts.HEO, fill: '#FFD600' }
        ];
    }, [debrisData]);

    return (
        <GlassCard className="flex flex-col h-full border-none shadow-none md:border-solid md:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <h2 className="text-white font-bold text-[13px] uppercase tracking-wider mb-2">Debris by Orbit Type</h2>
            <div className="flex-1 w-full min-h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 'bold' }} width={35} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}
