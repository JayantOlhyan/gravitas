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

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            navigate('/debris');
        }
    };

    return (
        <div className="flex-1 w-full flex flex-col md:flex-row overflow-hidden relative">
            <div className="w-full md:w-[280px] flex-shrink-0 h-auto md:h-full overflow-y-auto p-4 md:border-r border-[var(--border-subtle)] z-10 bg-[var(--bg-primary)] md:bg-[rgba(4,9,26,0.5)] custom-scrollbar mt-4 md:mt-0">
                <CollisionRiskPanel />
            </div>

            <div className="flex-1 flex flex-col relative h-[100vh] md:h-full">
                <div className="flex-1 relative min-h-[40vh] md:min-h-0">
                    <EarthGlobe />

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4 md:space-y-6 z-20 pointer-events-none pb-2">
                        <button
                            onClick={() => navigate('/debris')}
                            className="pointer-events-auto bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-orange-dark)] text-white px-6 md:px-9 py-2 md:py-3 rounded-full font-bold shadow-[0_0_20px_var(--glow-orange)] hover:scale-105 transition-transform duration-200"
                        >
                            EXPLORE
                        </button>
                        <div className="pointer-events-auto w-full max-w-[300px] md:max-w-none" onKeyDown={handleSearch}>
                            <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        </div>
                    </div>
                </div>

                <div className="h-auto md:h-[260px] flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 z-10 bg-[var(--bg-primary)] md:bg-[rgba(4,9,26,0.6)] md:backdrop-blur-md border-t border-[var(--border-subtle)]">
                    <CloseApproachEvents />
                    <DebrisByOrbitChart />
                </div>
            </div>

            <div className="w-full md:w-[320px] flex-shrink-0 h-auto md:h-full overflow-y-auto p-4 md:border-l border-[var(--border-subtle)] z-10 bg-[var(--bg-primary)] md:bg-[rgba(4,9,26,0.5)] custom-scrollbar space-y-4">
                <ObjectDetailPopup />
                <SpaceWeatherRadar />
            </div>
        </div>
    );
}
