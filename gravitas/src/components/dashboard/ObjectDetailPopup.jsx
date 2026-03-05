import React, { useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import GlassCard from '../shared/GlassCard';
import useAppStore from '../../store/useAppStore';
import RiskBadge from '../shared/RiskBadge';
import StatusDot from '../shared/StatusDot';
import { useTopRiskDebris } from '../../hooks/useDebrisData';

export default function ObjectDetailPopup() {
    const selectedObject = useAppStore(state => state.selectedObject);
    const setSelectedObject = useAppStore(state => state.setSelectedObject);
    const isOpen = useAppStore(state => state.detailPopupOpen);
    const setDetailPopupOpen = useAppStore(state => state.setDetailPopupOpen);

    const { data: topRisks } = useTopRiskDebris();

    useEffect(() => {
        // Select highest risk by default if not set
        if (!selectedObject && topRisks && topRisks.length > 0 && !isOpen) {
            setSelectedObject(topRisks[0]);
            setDetailPopupOpen(true);
        }
    }, [selectedObject, topRisks, isOpen, setSelectedObject, setDetailPopupOpen]);

    if (!isOpen && !selectedObject) return null;

    if (!selectedObject) {
        return (
            <GlassCard className="h-48 flex flex-col justify-center items-center text-center opacity-50 w-full mb-4 md:mb-0 border-none shadow-none md:border-solid md:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <span className="text-[var(--text-muted)] text-sm mb-2">No object selected</span>
                <span className="text-[10px] text-[var(--accent-cyan)] uppercase tracking-widest">Select an object on the globe</span>
            </GlassCard>
        );
    }

    const handleClose = () => {
        setDetailPopupOpen(false);
        setSelectedObject(null);
    };

    const isCritical = parseFloat(selectedObject.riskScore) >= 8;

    return (
        <GlassCard isAlert={isCritical} className="relative flex flex-col gap-4 overflow-hidden border-none shadow-none md:border-solid md:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <button onClick={handleClose} className="absolute top-4 right-4 text-[var(--text-muted-light)] hover:text-white transition-colors z-10">
                <X className="w-4 h-4" />
            </button>

            <div className="border-b border-[var(--border-subtle)] pb-3 pr-6">
                <h2 className="text-white font-bold text-[16px] leading-tight truncate">
                    {selectedObject.name || 'UNKNOWN DEBRIS'}
                    <span className="text-[var(--text-muted-light)] font-mono text-xs ml-2 block sm:inline mt-1 sm:mt-0">· {selectedObject.id}</span>
                </h2>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div>
                    <span className="block text-[9px] text-[var(--text-muted)] uppercase tracking-widest mb-1">Altitude</span>
                    <span className="text-white font-bold text-xl md:text-2xl font-['Arial_Black']">{Math.round(selectedObject.alt || 500)} <span className="text-[10px] text-[var(--text-muted-light)] uppercase tracking-widest font-sans ml-0.5">km</span></span>
                </div>
                <div>
                    <span className="block text-[9px] text-[var(--text-muted)] uppercase tracking-widest mb-1">Velocity</span>
                    <span className="text-white font-bold text-xl md:text-2xl font-['Arial_Black']">{parseFloat(selectedObject.velocity || 7.5).toFixed(1)} <span className="text-[10px] text-[var(--text-muted-light)] uppercase tracking-widest font-sans ml-0.5">km/s</span></span>
                </div>
                <div>
                    <span className="block text-[9px] text-[var(--text-muted)] uppercase tracking-widest mb-1">Inclination</span>
                    <span className="text-white font-bold text-xl md:text-2xl font-['Arial_Black']">{parseFloat(selectedObject.inclination || 0).toFixed(1)} <span className="text-[10px] text-[var(--text-muted-light)] uppercase tracking-widest font-sans ml-0.5">deg</span></span>
                </div>
                <div className="flex flex-col justify-end">
                    <span className="block text-[9px] text-[var(--text-muted)] uppercase tracking-widest mb-1">Orbit Type</span>
                    <span className="text-[var(--accent-cyan)] font-bold text-lg leading-none uppercase tracking-widest">{selectedObject.orbitType || 'LEO'}</span>
                </div>
            </div>

            <div className="flex flex-col gap-2 mt-1">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-[var(--text-muted-light)] uppercase tracking-widest text-[9px] font-bold">Risk Assessment</span>
                    <RiskBadge score={selectedObject.riskScore || '2.0'} />
                </div>
                <div className="w-full bg-[rgba(0,0,0,0.4)] h-1 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${isCritical ? 'bg-[var(--accent-red)]' : 'bg-[var(--accent-orange)]'} shadow-[0_0_10px_currentColor]`}
                        style={{ width: `${(parseFloat(selectedObject.riskScore) / 10) * 100}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between mt-1 pt-3 border-t border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                    <StatusDot status={isCritical ? 'active threat' : 'monitoring'} pulse={isCritical} />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-secondary)]">
                        {isCritical ? 'Active Threat' : 'Monitoring'}
                    </span>
                </div>
                <button className="text-[var(--accent-orange)] hover:text-white hover:bg-[var(--accent-orange)] border border-[var(--accent-orange)] w-7 h-7 rounded-full flex items-center justify-center transition-colors">
                    <Plus className="w-3 h-3" />
                </button>
            </div>
        </GlassCard>
    );
}
