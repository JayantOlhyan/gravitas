import React, { useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import GlassCard from '../components/shared/GlassCard';
import RiskBadge from '../components/shared/RiskBadge';
import SearchBar from '../components/shared/SearchBar';
import { useDebrisList } from '../hooks/useDebrisData';
import { Eye } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';

export default function DebrisPage() {
    const { data: debrisData, isLoading } = useDebrisList(5000);
    const [search, setSearch] = useState('');
    const setSelectedObject = useAppStore(state => state.setSelectedObject);
    const setDetailPopupOpen = useAppStore(state => state.setDetailPopupOpen);
    const navigate = useNavigate();

    const filteredData = React.useMemo(() => {
        if (!debrisData) return [];
        return debrisData.filter(d => (d.name || '').toLowerCase().includes(search.toLowerCase()) || (d.id || '').includes(search));
    }, [debrisData, search]);

    const handleView = (obj) => {
        setSelectedObject(obj);
        setDetailPopupOpen(true);
        navigate('/');
    };

    const Row = ({ index, style }) => {
        const obj = filteredData[index];
        if (!obj) return null;
        return (
            <div style={style} className="flex items-center border-b border-[var(--border-subtle)] hover:bg-[rgba(255,255,255,0.02)] px-4 transition-colors text-[13px]">
                <div className="w-[60px] md:w-[80px] text-[11px] md:text-[12px] text-[var(--accent-cyan)] font-mono truncate">{obj.id}</div>
                <div className="flex-1 font-bold text-white truncate pr-2 md:pr-4">{obj.name}</div>
                <div className="hidden md:block w-[100px] text-[11px] font-bold uppercase tracking-widest text-[var(--accent-blue-light)]">{obj.orbitType}</div>
                <div className="hidden sm:block w-[80px] md:w-[100px] text-[12px] text-right text-[var(--text-secondary)] font-mono pr-2 md:pr-4">{Math.round(obj.alt)}</div>
                <div className="hidden md:block w-[100px] text-[12px] text-right text-[var(--text-secondary)] font-mono pr-4">{parseFloat(obj.inclination).toFixed(1)}</div>
                <div className="w-[60px] md:w-[80px] flex justify-center"><RiskBadge score={obj.riskScore || '2.0'} /></div>
                <div className="w-[40px] md:w-[60px] flex justify-end">
                    <button onClick={() => handleView(obj)} className="text-[var(--text-muted-light)] hover:text-[var(--accent-orange)] transition-colors p-2">
                        <Eye className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 w-full h-[calc(100vh-64px)] overflow-hidden flex flex-col p-4 md:p-6 gap-4 md:gap-6 relative z-10">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-subtle)] gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 w-full md:w-auto overflow-hidden">
                    <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider truncate">Orbital Debris Catalog</h1>
                    <span className="text-[var(--accent-cyan)] font-bold text-[10px] md:text-sm bg-[rgba(0,212,255,0.1)] px-2 md:px-3 py-1 rounded-full whitespace-nowrap self-start sm:self-auto">
                        {filteredData.length.toLocaleString()} OBJECTS
                    </span>
                </div>
                <SearchBar value={search} onChange={setSearch} placeholder="Search ID or Name..." className="w-full md:w-[300px]" />
            </div>

            <GlassCard className="flex-1 flex flex-col overflow-hidden p-0 border-none shadow-none md:border-solid md:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <div className="flex items-center bg-[var(--bg-card-2)] border-b border-[var(--border-subtle)] px-4 py-3 text-[9px] md:text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
                    <div className="w-[60px] md:w-[80px]">NORAD ID</div>
                    <div className="flex-1">Object Name</div>
                    <div className="hidden md:block w-[100px]">Orbit Type</div>
                    <div className="hidden sm:block w-[80px] md:w-[100px] text-right pr-2 md:pr-4">Alt (km)</div>
                    <div className="hidden md:block w-[100px] text-right pr-4">Inc (deg)</div>
                    <div className="w-[60px] md:w-[80px] text-center">Risk Score</div>
                    <div className="w-[40px] md:w-[60px] text-right text-[var(--bg-card-2)] sm:text-transparent">Ac</div>
                </div>
                <div className="flex-1" id="debris-list-container">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center text-[var(--text-muted)] animate-pulse uppercase tracking-widest text-xs">Loading Catalog...</div>
                    ) : (
                        <List
                            height={typeof window !== 'undefined' ? window.innerHeight - 250 : 600}
                            itemCount={filteredData.length}
                            itemSize={50}
                            width="100%"
                        >
                            {Row}
                        </List>
                    )}
                </div>
            </GlassCard>
        </div>
    );
}
