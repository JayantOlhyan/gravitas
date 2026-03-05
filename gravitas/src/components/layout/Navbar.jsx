import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Settings, Menu, X, Orbit } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const TABS = [
    { name: 'Home', path: '/' },
    { name: 'Debris', path: '/debris' },
    { name: 'NEOs', path: '/neos' },
    { name: 'Space Weather', path: '/weather' },
    { name: 'Risk', path: '/risk' },
];

export default function Navbar() {
    const location = useLocation();
    const hasUnreadAlerts = useAppStore(state => state.hasUnreadAlerts);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 h-[64px] z-50 flex items-center justify-between px-6 bg-[rgba(4,9,26,0.95)] backdrop-blur-[20px] border-b border-[rgba(30,58,95,0.5)]">

                {/* LEFT ZONE: Logo */}
                <div className="flex items-center space-x-3 w-[250px]">
                    <Orbit className="h-6 w-6 text-[var(--accent-cyan)] stroke-[2.5]" />
                    <Link to="/" className="text-xl font-['Arial_Black'] text-[var(--accent-orange)] tracking-wider uppercase">
                        GRAVITAS
                    </Link>
                </div>

                {/* CENTER ZONE: Tabs (Desktop) */}
                <div className="hidden md:flex items-center space-x-2">
                    {TABS.map(tab => {
                        const isActive = location.pathname === tab.path;
                        return (
                            <Link
                                key={tab.name}
                                to={tab.path}
                                className={`px-[20px] py-[8px] text-[14px] font-medium transition-colors rounded-full ${isActive
                                        ? 'bg-[var(--accent-orange)] text-white'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                {tab.name}
                            </Link>
                        );
                    })}
                </div>

                {/* RIGHT ZONE: Icons */}
                <div className="hidden md:flex items-center space-x-6 w-[250px] justify-end">
                    <button className="text-[var(--text-muted-light)] hover:text-white transition-colors">
                        <Search className="h-5 w-5" />
                    </button>

                    <button className="relative text-[var(--text-muted-light)] hover:text-white transition-colors">
                        <Bell className="h-5 w-5" />
                        {hasUnreadAlerts && (
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[var(--accent-red)] ring-2 ring-[var(--bg-primary)]"></span>
                        )}
                    </button>

                    <button className="text-[var(--text-muted-light)] hover:text-white transition-colors">
                        <Settings className="h-5 w-5" />
                    </button>

                    <div className="h-9 w-9 rounded-full bg-[var(--bg-card-2)] border border-[var(--border-subtle)] overflow-hidden flex items-center justify-center">
                        <span className="text-xs font-bold text-[var(--accent-cyan)]">JO</span>
                    </div>
                </div>

                {/* MOBILE MENU TOGGLE */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setMobileMenuOpen(true)}>
                        <Menu className="h-6 w-6 text-[var(--text-muted-light)]" />
                    </button>
                </div>
            </nav>

            {/* MOBILE DRAWER */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] flex flex-col bg-[var(--bg-primary)] px-6 py-6 md:hidden">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-3">
                            <Orbit className="h-6 w-6 text-[var(--accent-cyan)]" />
                            <span className="text-xl font-black text-[var(--accent-orange)] uppercase">GRAVITAS</span>
                        </div>
                        <button onClick={() => setMobileMenuOpen(false)}>
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <div className="flex flex-col space-y-4">
                        {TABS.map(tab => {
                            const isActive = location.pathname === tab.path;
                            return (
                                <Link
                                    key={tab.name}
                                    to={tab.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-2xl font-bold py-4 border-b border-[var(--border-subtle)] ${isActive ? 'text-[var(--accent-orange)]' : 'text-white'}`}
                                >
                                    {tab.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}
