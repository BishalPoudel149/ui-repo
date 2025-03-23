import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shellbar from './components/Shellbar';
import ChartsDashboard from './pages/ChartsDashboard';
import MarketInsights from './pages/MarketInsights';
import AlertsConfig from './pages/AlertsConfig';
import WebSocketClientEmbed from './components/WebSocketClientEmbed';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Shellbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <ChartsDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/insights"
              element={
                <PrivateRoute>
                  <MarketInsights />
                </PrivateRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <PrivateRoute>
                  <AlertsConfig />
                </PrivateRoute>
              }
            />
            <Route
              path="/smart-analysis"
              element={
                <PrivateRoute>
                  <WebSocketClientEmbed />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;