import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Settings, Menu, X, Orbit, Moon, Sun, Monitor, User, LogOut, ChevronRight } from 'lucide-react';
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
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [theme, setTheme] = useState('dark');

    // Close dropdowns when clicking outside
    const settingsRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setSettingsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 h-[64px] z-50 flex items-center justify-between px-6 bg-[rgba(4,9,26,0.95)] backdrop-blur-[20px] border-b border-[rgba(30,58,95,0.5)]">

                {/* LEFT ZONE: Logo */}
                <div className="flex items-center space-x-3 w-[250px]">
                    <Link to="/" className="flex items-center space-x-3">
                        <img src="/logo.svg" alt="GRAVITAS Logo" className="h-8 w-8 object-contain" />
                        <span className="text-xl font-['Arial_Black'] text-[var(--accent-orange)] tracking-wider uppercase">
                            GRAVITAS
                        </span>
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
                    <button onClick={() => navigate('/debris')} className="text-[var(--text-muted-light)] hover:text-white transition-colors">
                        <Search className="h-5 w-5" />
                    </button>

                    <button
                        onClick={() => useAppStore.getState().setHasUnreadAlerts(!hasUnreadAlerts)}
                        className="relative text-[var(--text-muted-light)] hover:text-white transition-colors"
                    >
                        <Bell className="h-5 w-5" />
                        {hasUnreadAlerts && (
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[var(--accent-red)] ring-2 ring-[var(--bg-primary)]"></span>
                        )}
                    </button>

                    <div className="relative" ref={settingsRef}>
                        <button
                            onClick={() => { setSettingsOpen(!settingsOpen); setProfileOpen(false); }}
                            className={`transition-colors p-2 rounded-full ${settingsOpen ? 'text-white bg-[rgba(255,255,255,0.1)]' : 'text-[var(--text-muted-light)] hover:text-white'}`}
                        >
                            <Settings className="h-5 w-5" />
                        </button>

                        {settingsOpen && (
                            <div className="absolute top-12 right-0 w-56 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                                    <span className="text-white font-bold text-[13px] uppercase tracking-wider">Preferences</span>
                                </div>
                                <div className="flex flex-col p-2 space-y-1">
                                    <div className="px-2 py-1 flex items-center justify-between">
                                        <span className="text-[11px] text-[var(--text-muted-light)] uppercase tracking-widest font-bold">Theme</span>
                                    </div>
                                    <button onClick={() => setTheme('dark')} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${theme === 'dark' ? 'bg-[var(--accent-orange)] text-white' : 'text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'}`}>
                                        <Moon className="w-4 h-4" /> Dark Mode
                                    </button>
                                    <button onClick={() => setTheme('light')} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${theme === 'light' ? 'bg-[var(--accent-orange)] text-white' : 'text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'}`}>
                                        <Sun className="w-4 h-4" /> Light Mode
                                    </button>
                                    <button onClick={() => setTheme('system')} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${theme === 'system' ? 'bg-[var(--accent-orange)] text-white' : 'text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'}`}>
                                        <Monitor className="w-4 h-4" /> System
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={profileRef}>
                        <div
                            onClick={() => { setProfileOpen(!profileOpen); setSettingsOpen(false); }}
                            className={`h-9 w-9 rounded-full overflow-hidden flex items-center justify-center cursor-pointer transition-colors shadow-[0_0_10px_rgba(0,212,255,0.1)] ${profileOpen ? 'bg-[var(--accent-cyan)] border-transparent' : 'bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)] hover:bg-[rgba(0,212,255,0.2)]'}`}
                        >
                            <span className={`text-xs font-bold select-none ${profileOpen ? 'text-[var(--bg-primary)]' : 'text-[var(--accent-cyan)]'}`}>JO</span>
                        </div>

                        {profileOpen && (
                            <div className="absolute top-12 right-0 w-48 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-3 border-b border-[var(--border-subtle)] flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-[var(--accent-cyan)] flex items-center justify-center">
                                        <span className="text-[var(--bg-primary)] font-bold text-sm">JO</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-sm">Jayant Olhyan</span>
                                        <span className="text-[10px] text-[var(--accent-cyan)] uppercase tracking-widest">Admin</span>
                                    </div>
                                </div>
                                <div className="flex flex-col p-2">
                                    <button className="flex items-center justify-between px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white transition-colors text-sm text-left">
                                        <div className="flex items-center gap-3"><User className="w-4 h-4" /> My Profile</div>
                                        <ChevronRight className="w-3 h-3 opacity-50" />
                                    </button>
                                    <div className="h-px bg-[var(--border-subtle)] my-1 mx-2"></div>
                                    <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--accent-red)] hover:bg-[rgba(255,51,102,0.1)] transition-colors text-sm text-left font-medium">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
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
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3">
                            <img src="/logo.svg" alt="GRAVITAS Logo" className="h-8 w-8 object-contain" />
                            <span className="text-xl font-black text-[var(--accent-orange)] uppercase">GRAVITAS</span>
                        </Link>
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
