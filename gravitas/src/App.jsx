import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/shared/LoadingSpinner';

import ErrorBoundary from './components/shared/ErrorBoundary';

const HomePage = lazy(() => import('./pages/HomePage'));
const DebrisPage = lazy(() => import('./pages/DebrisPage'));
const NEOsPage = lazy(() => import('./pages/NEOsPage'));
const SpaceWeatherPage = lazy(() => import('./pages/SpaceWeatherPage'));
const RiskPage = lazy(() => import('./pages/RiskPage'));

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner fullScreen text="INITIALIZING GRAVITAS CORE..." />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="debris" element={<DebrisPage />} />
              <Route path="neos" element={<NEOsPage />} />
              <Route path="weather" element={<SpaceWeatherPage />} />
              <Route path="risk" element={<RiskPage />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
