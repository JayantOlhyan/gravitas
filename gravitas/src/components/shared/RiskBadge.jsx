import React from 'react';

export default function RiskBadge({ score, className = '' }) {
    const numScore = parseFloat(score);
    let colorClass = 'bg-[#00E676] text-black w-[40px]'; // LOW <4

    if (numScore >= 8) {
        colorClass = 'bg-[#FF3D00] text-white'; // CRITICAL
    } else if (numScore >= 6) {
        colorClass = 'bg-[#FF6B2B] text-white'; // HIGH
    } else if (numScore >= 4) {
        colorClass = 'bg-[#FFD600] text-black'; // MEDIUM
    }

    return (
        <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold ${colorClass} ${className}`}>
            {parseFloat(score).toFixed(1)}/10
        </span>
    );
}
