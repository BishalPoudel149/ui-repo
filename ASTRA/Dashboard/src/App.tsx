import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shellbar from './components/Shellbar';
import ChartsDashboard from './pages/ChartsDashboard';
import MarketInsights from './pages/MarketInsights';
import AlertsConfig from './pages/AlertsConfig';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Shellbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ChartsDashboard />} />
            <Route path="/insights" element={<MarketInsights />} />
            <Route path="/alerts" element={<AlertsConfig />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;