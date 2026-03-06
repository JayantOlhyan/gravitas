import React, { useState } from 'react';
import {
    X, Monitor, Globe, Bell, Database, LayoutDashboard,
    Sliders, Bookmark, Info, Save, Trash2, Download
} from 'lucide-react';
import GlassCard from '../shared/GlassCard';
import useAppStore from '../../store/useAppStore';

const CATEGORIES = [
    { id: 'display', label: 'Display & Theme', icon: Monitor },
    { id: 'globe', label: 'Globe Settings', icon: Globe },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'data', label: 'Data & Refresh', icon: Database },
    { id: 'layout', label: 'Dashboard Layout', icon: LayoutDashboard },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark },
    { id: 'about', label: 'About', icon: Info },
];

export default function SettingsModal() {
    const isOpen = useAppStore(state => state.settingsModalOpen);
    const setSettingsModalOpen = useAppStore(state => state.setSettingsModalOpen);
    const appSettings = useAppStore(state => state.appSettings);
    const updateAppSetting = useAppStore(state => state.updateAppSetting);
    const clearWatchlist = useAppStore(state => state.clearWatchlist);

    const [activeTab, setActiveTab] = useState('display');

    if (!isOpen) return null;

    const handleToggle = (category, key) => {
        updateAppSetting(category, key, !appSettings[category][key]);
    };

    const handleChange = (category, key, value) => {
        updateAppSetting(category, key, value);
    };

    const handlePanelToggle = (panelKey) => {
        updateAppSetting('layout', 'panels', {
            ...appSettings.layout.panels,
            [panelKey]: !appSettings.layout.panels[panelKey]
        });
    };

    const renderToggle = (category, key, label, description) => (
        <div className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.2)] rounded-lg border border-[var(--border-subtle)]">
            <div className="flex flex-col">
                <span className="text-white text-sm font-medium">{label}</span>
                {description && <span className="text-[10px] text-[var(--text-muted-light)] mt-0.5">{description}</span>}
            </div>
            <button
                onClick={() => handleToggle(category, key)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${appSettings[category][key] ? 'bg-[var(--accent-cyan)]' : 'bg-gray-700'}`}
            >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${appSettings[category][key] ? 'translate-x-2' : '-translate-x-2'}`} />
            </button>
        </div>
    );

    const renderSelect = (category, key, label, options, description) => (
        <div className="flex flex-col p-3 bg-[rgba(0,0,0,0.2)] rounded-lg border border-[var(--border-subtle)] gap-2">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-white text-sm font-medium">{label}</span>
                    {description && <span className="text-[10px] text-[var(--text-muted-light)] mt-0.5">{description}</span>}
                </div>
                <select
                    value={appSettings[category][key]}
                    onChange={(e) => handleChange(category, key, e.target.value)}
                    className="bg-[rgba(0,0,0,0.4)] border border-[var(--border-subtle)] rounded px-2 py-1 text-xs text-white outline-none focus:border-[var(--accent-cyan)]"
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );

    const renderSlider = (category, key, label, min, max, step, description) => (
        <div className="flex flex-col p-3 bg-[rgba(0,0,0,0.2)] rounded-lg border border-[var(--border-subtle)] gap-2">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-white text-sm font-medium">{label}</span>
                    {description && <span className="text-[10px] text-[var(--text-muted-light)] mt-0.5">{description}</span>}
                </div>
                <span className="text-[var(--accent-cyan)] font-mono font-bold text-sm bg-[rgba(0,212,255,0.1)] px-2 py-0.5 rounded">
                    {appSettings[category][key]}
                </span>
            </div>
            <input
                type="range"
                min={min} max={max} step={step}
                value={appSettings[category][key]}
                onChange={(e) => handleChange(category, key, Number(e.target.value))}
                className="w-full accent-[var(--accent-cyan)]"
            />
        </div>
    );

    const renderInput = (category, key, label, placeholder, type = "text") => (
        <div className="flex flex-col p-3 bg-[rgba(0,0,0,0.2)] rounded-lg border border-[var(--border-subtle)] gap-2">
            <span className="text-white text-sm font-medium">{label}</span>
            <input
                type={type}
                value={appSettings[category][key]}
                onChange={(e) => handleChange(category, key, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-[rgba(0,0,0,0.4)] border border-[var(--border-subtle)] rounded px-3 py-1.5 text-sm text-white outline-none focus:border-[var(--accent-cyan)]"
            />
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'display':
                return (
                    <div className="space-y-3 animate-in fade-in duration-200">
                        {renderSelect('display', 'theme', 'Theme', [
                            { value: 'dark', label: 'Dark (Default)' },
                            { value: 'light', label: 'Light' },
                            { value: 'system', label: 'Auto (System)' }
                        ])}
                        {renderSelect('display', 'accentColor', 'Accent Color', [
                            { value: 'cyan', label: 'Cyan' },
                            { value: 'orange', label: 'Orange' },
                            { value: 'blue', label: 'Blue' },
                            { value: 'green', label: 'Green' }
                        ])}
                        {renderSelect('display', 'globeQuality', 'Globe Rendering Quality', [
                            { value: 'ultra', label: 'Ultra (4K Textures)' },
                            { value: 'high', label: 'High' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'low', label: 'Low (Performance)' }
                        ], "Adjust this if the 3D globe causes lag on your device.")}
                        {renderToggle('display', 'reduceMotion', 'Reduce Motion', 'Disable non-essential UI animations and transitions for accessibility.')}
                    </div>
                );
            case 'globe':
                return (
                    <div className="space-y-3 animate-in fade-in duration-200">
                        {renderToggle('globe', 'autoRotation', 'Auto-Rotate Globe', 'Slowly spin the Earth when idle.')}
                        {renderSlider('globe', 'rotationSpeed', 'Rotation Speed', 0.1, 5.0, 0.1)}
                        {renderSelect('globe', 'maxOrbitsRendered', 'Max Orbits Rendered', [
                            { value: '100', label: '100 Orbits' },
                            { value: '500', label: '500 Orbits' },
                            { value: '1000', label: '1,000 Orbits' },
                            { value: 'all', label: 'All (Warning: Heavy)' }
                        ])}
                        {renderSelect('globe', 'orbitColorMode', 'Orbit Line Color Mode', [
                            { value: 'risk', label: 'By Collision Risk' },
                            { value: 'type', label: 'By Orbit Type (LEO/MEO/GEO)' },
                            { value: 'agency', label: 'By Operating Agency' }
                        ])}
                        <div className="grid grid-cols-2 gap-3 mt-4 border-t border-[var(--border-subtle)] pt-4">
                            {renderToggle('globe', 'showOrbitalPaths', 'Orbital Paths')}
                            {renderToggle('globe', 'showDebrisMarkers', 'Debris Markers')}
                            {renderToggle('globe', 'showNeoTrajectories', 'Asteroid Trajectories')}
                            {renderToggle('globe', 'atmosphereGlow', 'Atmosphere Glow')}
                            {renderToggle('globe', 'cloudLayer', 'Cloud Layer')}
                        </div>
                    </div>
                );
            case 'alerts':
                return (
                    <div className="space-y-3 animate-in fade-in duration-200">
                        {renderSlider('alerts', 'riskThreshold', 'Risk Alert Threshold', 1, 10, 1, 'Only trigger critical alerts when risk score exceeds this number.')}
                        <div className="h-px bg-[var(--border-subtle)] my-2"></div>
                        {renderToggle('alerts', 'neoWarning', 'NEO Close Approach Warnings')}
                        {renderSelect('alerts', 'neoDistanceThreshold', 'NEO Warning Distance', [
                            { value: '0.01', label: '< 0.01 AU (Critical)' },
                            { value: '0.05', label: '< 0.05 AU' },
                            { value: '0.1', label: '< 0.10 AU' }
                        ])}
                        <div className="h-px bg-[var(--border-subtle)] my-2"></div>
                        {renderSelect('alerts', 'solarFlareAlerts', 'Solar Flare Alerts', [
                            { value: 'off', label: 'Disabled' },
                            { value: 'M-class', label: 'M-Class and above' },
                            { value: 'X-class', label: 'X-Class only' }
                        ])}
                        {renderToggle('alerts', 'cmeAlerts', 'CME Activity Alerts')}
                        <div className="h-px bg-[var(--border-subtle)] my-2"></div>
                        <div className="grid grid-cols-2 gap-3">
                            {renderToggle('alerts', 'alertSound', 'Sound Notifications')}
                            {renderToggle('alerts', 'browserNotifications', 'Browser Push')}
                        </div>
                    </div>
                );
            case 'data':
                return (
                    <div className="space-y-3 animate-in fade-in duration-200">
                        {renderSelect('data', 'refreshInterval', 'Auto-Refresh Interval', [
                            { value: '1', label: 'Every 1 minute' },
                            { value: '5', label: 'Every 5 minutes' },
                            { value: '15', label: 'Every 15 minutes' },
                            { value: '30', label: 'Every 30 minutes' },
                            { value: 'manual', label: 'Manual Refresh Only' }
                        ])}
                        {renderSelect('data', 'sourcePriority', 'Primary Data Source', [
                            { value: 'CelesTrak', label: 'CelesTrak (Default)' },
                            { value: 'SpaceTrack', label: 'Space-Track.org' }
                        ])}
                        {renderSlider('data', 'tleAgeWarning', 'TLE Expiration Warning (Hours)', 6, 72, 6, 'Warn if Two-Line Element data is older than this duration.')}
                        {renderInput('data', 'nasaApiKey', 'Custom NASA API Key', 'DEMO_KEY')}
                        {renderToggle('data', 'showTimestamps', 'Show Data Timestamps', 'Display "last updated X min ago" on panel widgets.')}
                    </div>
                );
            case 'layout':
                return (
                    <div className="space-y-3 animate-in fade-in duration-200">
                        {renderSelect('layout', 'defaultPage', 'Default Startup Page', [
                            { value: 'home', label: 'Mission Control Dashboard' },
                            { value: 'debris', label: 'Debris Catalog' },
                            { value: 'neos', label: 'NEO Watch' },
                            { value: 'weather', label: 'Space Weather' },
                            { value: 'risk', label: 'Risk Optimizer' }
                        ])}
                        {renderSelect('layout', 'leftSidebar', 'Left Sidebar Behavior', [
                            { value: 'show', label: 'Always Show' },
                            { value: 'auto', label: 'Auto-Collapse' },
                            { value: 'hide', label: 'Hidden (Hover to reveal)' }
                        ])}
                        {renderSelect('layout', 'defaultGlobeView', 'Default Globe Startup View', [
                            { value: 'full', label: 'Full Earth View' },
                            { value: 'leo', label: 'LEO Focus (Zoomed in)' },
                            { value: 'solar', label: 'Solar System (Zoomed out)' }
                        ])}
                        {renderToggle('layout', 'compactMode', 'Compact UI Mode', 'Enable denser data cards with smaller text for power users.')}

                        <div className="p-3 bg-[rgba(0,0,0,0.2)] rounded-lg border border-[var(--border-subtle)] mt-4">
                            <span className="text-white text-sm font-medium mb-3 block">Dashboard Panel Visibility</span>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                    <input type="checkbox" checked={appSettings.layout.panels.collisionRisk} onChange={() => handlePanelToggle('collisionRisk')} className="accent-[var(--accent-cyan)]" /> Collision Risk
                                </label>
                                <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                    <input type="checkbox" checked={appSettings.layout.panels.neoWatch} onChange={() => handlePanelToggle('neoWatch')} className="accent-[var(--accent-cyan)]" /> NEO Watch
                                </label>
                                <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                    <input type="checkbox" checked={appSettings.layout.panels.closeApproaches} onChange={() => handlePanelToggle('closeApproaches')} className="accent-[var(--accent-cyan)]" /> Close Approaches
                                </label>
                                <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                    <input type="checkbox" checked={appSettings.layout.panels.orbitChart} onChange={() => handlePanelToggle('orbitChart')} className="accent-[var(--accent-cyan)]" /> Orbit Distributions
                                </label>
                                <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                    <input type="checkbox" checked={appSettings.layout.panels.spaceWeather} onChange={() => handlePanelToggle('spaceWeather')} className="accent-[var(--accent-cyan)]" /> Space Weather
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 'preferences':
                return (
                    <div className="space-y-3 animate-in fade-in duration-200">
                        {renderInput('preferences', 'homeLocation', 'Home Location', 'e.g. Houston, TX')}
                        {renderSelect('preferences', 'defaultLaunchSite', 'Default Launch Site', [
                            { value: 'KSC', label: 'Kennedy Space Center, USA' },
                            { value: 'VAFB', label: 'Vandenberg SFB, USA' },
                            { value: 'CSG', label: 'Guiana Space Centre, EU' },
                            { value: 'JQS', label: 'Jiuquan, CHN' },
                            { value: 'TNSC', label: 'Tanegashima, JPN' }
                        ])}
                        <div className="grid grid-cols-2 gap-3 mt-4 border-t border-[var(--border-subtle)] pt-4">
                            {renderSelect('preferences', 'distanceUnits', 'Distance Units', [
                                { value: 'km', label: 'Kilometers' },
                                { value: 'miles', label: 'Miles' },
                                { value: 'AU', label: 'Astron. Units (AU)' }
                            ])}
                            {renderSelect('preferences', 'velocityUnits', 'Velocity Units', [
                                { value: 'km/s', label: 'km/s' },
                                { value: 'mph', label: 'mph' },
                                { value: 'km/h', label: 'km/h' }
                            ])}
                            {renderSelect('preferences', 'timeFormat', 'Time Format', [
                                { value: 'UTC', label: 'UTC Only' },
                                { value: '24hr', label: '24-hour Local' },
                                { value: '12hr', label: '12-hour Local (AM/PM)' }
                            ])}
                            {renderSelect('preferences', 'dateFormat', 'Date Format', [
                                { value: 'ISO', label: 'YYYY-MM-DD (ISO)' },
                                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' }
                            ])}
                        </div>
                    </div>
                );
            case 'watchlist':
                return (
                    <div className="flex flex-col h-full animate-in fade-in duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-white text-sm">You are tracking <strong className="text-[var(--accent-cyan)]">{appSettings.watchlist.trackedObjects.length}</strong> objects.</span>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] rounded text-xs text-white transition-colors">
                                    <Download className="w-3.5 h-3.5" /> Export
                                </button>
                                <button onClick={clearWatchlist} className="flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(255,51,102,0.1)] hover:bg-[rgba(255,51,102,0.2)] text-[var(--accent-red)] rounded text-xs transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-[rgba(0,0,0,0.3)] border border-[var(--border-subtle)] rounded-lg flex items-center justify-center p-8 text-center min-h-[200px]">
                            {appSettings.watchlist.trackedObjects.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 opacity-50">
                                    <Bookmark className="w-8 h-8 text-[var(--text-muted-light)] mb-2" />
                                    <p className="text-sm text-white">Your watchlist is empty.</p>
                                    <p className="text-xs text-[var(--text-muted-light)]">Pin debris or asteroids from the database to track them here.</p>
                                </div>
                            ) : (
                                <div className="w-full h-full overflow-y-auto">
                                    {/* List goes here */}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'about':
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-in fade-in duration-200">
                        <div className="w-16 h-16 rounded-2xl bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)] shadow-[0_0_20px_rgba(0,212,255,0.2)] flex items-center justify-center mb-6">
                            <Orbit className="w-8 h-8 text-[var(--accent-cyan)]" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-widest mb-1">GRAVITAS</h2>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent-cyan)] font-mono mb-8">Version 1.0.0-rc.1</span>

                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-left w-full max-w-sm mb-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mb-1">Developer</span>
                                <span className="text-sm text-white font-medium">Jayant Olhyan</span>
                                <span className="text-xs text-[var(--text-muted-light)]">Hack Homies</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mb-1">Affiliation</span>
                                <span className="text-sm text-white font-medium">Advitiya '26</span>
                                <span className="text-xs text-[var(--text-muted-light)]">IIT Ropar</span>
                            </div>
                            <div className="flex flex-col col-span-2 mt-2 pt-4 border-t border-[var(--border-subtle)]">
                                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mb-2">Data Sources</span>
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-xs px-2 py-1 bg-[rgba(255,255,255,0.05)] rounded text-[var(--text-muted-light)] hover:text-white cursor-pointer transition-colors">NASA NeoWs</span>
                                    <span className="text-xs px-2 py-1 bg-[rgba(255,255,255,0.05)] rounded text-[var(--text-muted-light)] hover:text-white cursor-pointer transition-colors">NASA DONKI</span>
                                    <span className="text-xs px-2 py-1 bg-[rgba(255,255,255,0.05)] rounded text-[var(--text-muted-light)] hover:text-white cursor-pointer transition-colors">CelesTrak</span>
                                </div>
                            </div>
                        </div>

                        <a href="https://github.com/JayantOlhyan/gravitas" target="_blank" rel="noopener noreferrer" className="text-[11px] uppercase tracking-wider text-[var(--accent-cyan)] hover:text-white transition-colors underline underline-offset-4">
                            View GitHub Repository
                        </a>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
                onClick={() => setSettingsModalOpen(false)}
            />

            <GlassCard className="relative w-full max-w-4xl h-[80vh] min-h-[500px] flex flex-row overflow-hidden border-solid border-[rgba(0,212,255,0.2)] shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300 p-0">
                {/* Sidebar */}
                <div className="w-64 bg-[rgba(0,0,0,0.5)] border-r border-[var(--border-subtle)] flex flex-col pt-6 pb-4">
                    <div className="px-6 mb-6">
                        <h2 className="text-white font-bold text-lg tracking-wider">Settings</h2>
                        <span className="text-[10px] text-[var(--accent-cyan)] font-mono uppercase tracking-widest">Global Configuration</span>
                    </div>

                    <div className="flex flex-col space-y-1 px-3 flex-1 overflow-y-auto custom-scrollbar">
                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            const isActive = activeTab === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left ${isActive
                                        ? 'bg-[var(--accent-cyan)] text-[var(--bg-primary)] font-bold shadow-[0_0_15px_rgba(0,212,255,0.3)]'
                                        : 'text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--bg-primary)]' : 'opacity-70'}`} />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col relative h-full">
                    <button
                        onClick={() => setSettingsModalOpen(false)}
                        className="absolute top-4 right-4 text-[var(--text-muted-light)] hover:text-white p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors z-[100] cursor-pointer"
                        title="Close Settings"
                    >
                        <X className="w-5 h-5 pointer-events-auto" />
                    </button>

                    <div className="px-8 pt-8 pb-4 border-b border-[var(--border-subtle)]">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            {React.createElement(CATEGORIES.find(c => c.id === activeTab)?.icon || Monitor, { className: "w-6 h-6 text-[var(--accent-cyan)]" })}
                            {CATEGORIES.find(c => c.id === activeTab)?.label}
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                        {renderContent()}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
