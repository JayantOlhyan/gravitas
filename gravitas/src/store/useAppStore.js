import { create } from 'zustand';

const useAppStore = create((set, get) => ({
    // Selected object
    selectedObject: null,          // Current object in detail popup
    setSelectedObject: (obj) => set({ selectedObject: obj }),

    // Globe state
    globeFilter: 'ALL',           // 'ALL'|'DEBRIS'|'NEO'|'SATELLITE'
    setGlobeFilter: (f) => set({ globeFilter: f }),
    orbitType: 'ALL',             // 'ALL'|'LEO'|'MEO'|'GEO'|'HEO'
    setOrbitType: (t) => set({ orbitType: t }),

    // Alerts
    activeAlerts: [],             // Array of critical risk objects
    setActiveAlerts: (a) => set({ activeAlerts: a }),
    hasUnreadAlerts: false,
    setHasUnreadAlerts: (v) => set({ hasUnreadAlerts: v }),

    // Search
    searchQuery: '',
    setSearchQuery: (q) => set({ searchQuery: q }),
    searchResults: [],
    setSearchResults: (r) => set({ searchResults: r }),

    // Space weather
    weatherStatus: null,          // Current space weather summary
    setWeatherStatus: (w) => set({ weatherStatus: w }),

    // UI state
    activeTab: 'home',            // Current nav tab
    setActiveTab: (t) => set({ activeTab: t }),
    detailPopupOpen: false,
    setDetailPopupOpen: (v) => set({ detailPopupOpen: v }),
    sidebarOpen: true,            // Mobile sidebar toggle
    setSidebarOpen: (v) => set({ sidebarOpen: v }),
    profileModalOpen: false,      // Profile editing modal toggle
    setProfileModalOpen: (v) => set({ profileModalOpen: v }),

    // User Profile
    userProfile: {
        name: 'Jayant Olhyan',
        initials: 'JO',
        role: 'Admin',
        department: 'Orbital Def. Command',
        avatarUrl: ''
    },
    setUserProfile: (profile) => set((state) => ({
        userProfile: { ...state.userProfile, ...profile }
    })),
}));

export default useAppStore;
