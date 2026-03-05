import React from 'react';

export default function StatusDot({ status, pulse = false }) {
    let color = 'bg-[var(--text-muted)]';
    if (status === 'safe' || status === 'clear' || status === 'low') {
        color = 'bg-[var(--accent-green)]';
    } else if (status === 'warning' || status === 'medium' || status === 'monitoring') {
        color = 'bg-[var(--accent-yellow)]';
    } else if (status === 'critical' || status === 'high' || status === 'active threat') {
        color = 'bg-[var(--accent-red)]';
    } else if (status === 'active') {
        color = 'bg-[var(--accent-orange)]';
    }

    return (
        <span className="relative flex h-3 w-3">
            {pulse && (
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${color}`}></span>
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`}></span>
        </span>
    );
}
