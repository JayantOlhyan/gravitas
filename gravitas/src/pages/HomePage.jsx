import React from 'react';
import EarthGlobe from '../components/globe/EarthGlobe';
import CollisionRiskPanel from '../components/dashboard/CollisionRiskPanel';
import ObjectDetailPopup from '../components/dashboard/ObjectDetailPopup';
import CloseApproachEvents from '../components/dashboard/CloseApproachEvents';
import DebrisByOrbitChart from '../components/dashboard/DebrisByOrbitChart';
import SpaceWeatherRadar from '../components/dashboard/SpaceWeatherRadar';
import SearchBar from '../components/shared/SearchBar';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

export default function HomePage() {
    const navigate = useNavigate();
    const searchQuery = useAppStore(state => state.searchQuery);
    const setSearchQuery = useAppStore(state => state.setSearchQuery);
    const { layout } = useAppStore(state => state.appSettings);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            navigate('/debris');
        }
    };

    return (
        <div className="flex-1 w-full flex flex-col lg:flex-row overflow-y-auto overflow-x-hidden relative custom-scrollbar">
            <div className={`w-full lg:w-[280px] flex-shrink-0 h-auto lg:h-full overflow-y-visible lg:overflow-y-auto p-4 lg:border-r border-[var(--border-subtle)] z-10 bg-[var(--bg-primary)] lg:bg-[rgba(4,9,26,0.5)] custom-scrollbar mt-4 lg:mt-0 ${!layout.panels.collisionRisk ? 'hidden lg:hidden' : ''}`}>
                {layout.panels.collisionRisk && <CollisionRiskPanel />}
            </div>

            <div className="flex-1 flex flex-col relative min-h-[80vh] lg:min-h-0 lg:h-full">
                <div className="flex-1 relative min-h-[40vh] lg:min-h-0">
                    <EarthGlobe />

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4 md:space-y-6 z-20 pointer-events-none pb-2">
                        <button
                            onClick={() => navigate('/debris')}
                            className="pointer-events-auto bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-orange-dark)] text-white px-6 md:px-9 py-2 md:py-3 rounded-full font-bold shadow-[0_0_20px_var(--glow-orange)] hover:scale-105 transition-transform duration-200"
                        >
                            EXPLORE
                        </button>
                        <div className="pointer-events-auto w-full max-w-[300px] lg:max-w-none" onKeyDown={handleSearch}>
                            <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        </div>
                    </div>
                </div>

                {(layout.panels.closeApproaches || layout.panels.orbitChart) && (
                    <div className="h-auto lg:h-[260px] flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 z-10 bg-[var(--bg-primary)] lg:bg-[rgba(4,9,26,0.6)] lg:backdrop-blur-md border-t border-[var(--border-subtle)]">
                        {layout.panels.closeApproaches && <CloseApproachEvents />}
                        {layout.panels.orbitChart && <DebrisByOrbitChart />}
                    </div>
                )}
            </div>

            <div className={`w-full lg:w-[320px] flex-shrink-0 h-auto lg:h-full overflow-y-visible lg:overflow-y-auto p-4 lg:border-l border-[var(--border-subtle)] z-10 bg-[var(--bg-primary)] lg:bg-[rgba(4,9,26,0.5)] custom-scrollbar space-y-4 ${(!layout.panels.spaceWeather) ? 'hidden lg:hidden' : ''}`}>
                <ObjectDetailPopup />
                {layout.panels.spaceWeather && <SpaceWeatherRadar />}
            </div>
        </div>
    );
}
