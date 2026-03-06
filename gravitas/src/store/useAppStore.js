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

    // App Settings
    settingsModalOpen: false,
    setSettingsModalOpen: (v) => set({ settingsModalOpen: v }),
    appSettings: {
        display: {
            theme: 'dark', // dark, light, system
            accentColor: 'cyan', // orange, cyan, blue, green
            globeQuality: 'high', // ultra, high, medium, low
            reduceMotion: false
        },
        globe: {
            autoRotation: true,
            rotationSpeed: 1.0,
            showOrbitalPaths: true,
            maxOrbitsRendered: 500, // 100, 500, 1000, 'all'
            orbitColorMode: 'risk', // risk, type, agency
            showDebrisMarkers: true,
            showNeoTrajectories: true,
            atmosphereGlow: true,
            cloudLayer: true
        },
        alerts: {
            riskThreshold: 6, // 1-10
            neoWarning: true,
            neoDistanceThreshold: 0.05, // AU
            solarFlareAlerts: 'M-class', // off, M-class, X-class
            cmeAlerts: true,
            alertSound: false,
            browserNotifications: false
        },
        data: {
            refreshInterval: 5, // minutes (1, 5, 15, 30, manual)
            sourcePriority: 'CelesTrak',
            tleAgeWarning: 24, // hours
            nasaApiKey: '',
            showTimestamps: true
        },
        layout: {
            defaultPage: 'home',
            leftSidebar: 'show', // show, hide, auto
            defaultGlobeView: 'full', // full, leo, solar
            compactMode: false,
            panels: {
                collisionRisk: true,
                neoWatch: true,
                closeApproaches: true,
                orbitChart: true,
                spaceWeather: true
            }
        },
        preferences: {
            homeLocation: 'Houston, TX',
            defaultLaunchSite: 'KSC',
            distanceUnits: 'km', // km, miles, AU
            velocityUnits: 'km/s', // km/s, mph, km/h
            timeFormat: 'UTC', // 12hr, 24hr, UTC
            dateFormat: 'ISO' // DD/MM/YYYY, MM/DD/YYYY, ISO
        },
        watchlist: {
            trackedObjects: []
        }
    },
    updateAppSetting: (category, key, value) => set((state) => ({
        appSettings: {
            ...state.appSettings,
            [category]: {
                ...state.appSettings[category],
                [key]: value
            }
        }
    })),
    updateAppCategory: (category, newValues) => set((state) => ({
        appSettings: {
            ...state.appSettings,
            [category]: {
                ...state.appSettings[category],
                ...newValues
            }
        }
    })),
    clearWatchlist: () => set((state) => ({
        appSettings: {
            ...state.appSettings,
            watchlist: { trackedObjects: [] }
        }
    })),
}));

export default useAppStore;
