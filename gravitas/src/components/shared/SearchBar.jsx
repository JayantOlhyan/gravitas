import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search any object, asteroid, or debris field...', className = '' }) {
    return (
        <div className={`relative flex items-center w-[400px] max-w-full ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[var(--text-muted)]" />
            </div>
            <input
                type="text"
                className="block w-full pl-12 pr-4 py-3 bg-[rgba(10,22,40,0.8)] border border-[rgba(30,58,95,0.6)] rounded-full text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] focus:border-transparent transition-all shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
