import React from 'react';
import CountUp from 'react-countup';

export default function DataStat({ label, value, unit, color = 'var(--text-primary)', animate = false }) {
    // If value is a number and animate is true, use CountUp
    const isNumber = typeof value === 'number';

    return (
        <div className="flex flex-col">
            <span className="text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
                {label}
            </span>
            <div className="flex items-baseline space-x-1">
                <span
                    className="text-2xl md:text-3xl font-black font-['Arial_Black']"
                    style={{ color }}
                >
                    {isNumber && animate ? (
                        <CountUp end={value} duration={2} separator="," decimals={value % 1 !== 0 ? 1 : 0} />
                    ) : (
                        value
                    )}
                </span>
                {unit && (
                    <span className="text-sm font-bold text-[var(--text-muted-light)] uppercase">
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}
