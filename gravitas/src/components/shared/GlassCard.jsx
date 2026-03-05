import React from 'react';

export default function GlassCard({ children, className = '', isAlert = false, ...props }) {
    const panelClass = isAlert ? 'glass-panel-alert' : 'glass-panel';
    return (
        <div className={`${panelClass} ${className}`} {...props}>
            {children}
        </div>
    );
}
