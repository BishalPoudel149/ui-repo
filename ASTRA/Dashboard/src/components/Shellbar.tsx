import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Bell, Settings, LineChart, TrendingUp, AlertTriangle } from 'lucide-react';
import type { User as UserType } from '../types';
import NotificationsPanel from './NotificationsPanel';

const currentUser: UserType = {
  name: 'John',
  role: 'Treasury Analyst',
  email: 'john.doe@example.com'
};

export default function Shellbar() {
  const location = useLocation();
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] =
    useState(false);
  const authToken = localStorage.getItem("access_token");

  return (
    <>
      <header className="bg-indigo-900 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <h1 className="text-2xl tracking-wide glow-red-500 text-white-500 font-extrabold">
                <span className="text-4xl relative" style={{ top: "0.10em" }}>
                  Λ
                </span>
                STRA
              </h1>
            </Link>
            {authToken && authToken !== "null" && authToken !== "undefined" && (
              <nav className="hidden md:flex space-x-6">
                <Link
                  to="/"
                  className={`flex items-center space-x-2 ${
                    location.pathname === "/"
                      ? "text-white"
                      : "text-indigo-200 hover:text-white"
                  }`}
                >
                  <LineChart className="w-4 h-4" />
                  <span>Charts</span>
                </Link>
                <Link
                  to="/insights"
                  className={`flex items-center space-x-2 ${
                    location.pathname === "/insights"
                      ? "text-white"
                      : "text-indigo-200 hover:text-white"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Market Insights</span>
                </Link>
                <Link
                  to="/alerts"
                  className={`flex items-center space-x-2 ${
                    location.pathname === "/alerts"
                      ? "text-white"
                      : "text-indigo-200 hover:text-white"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Set Threshold</span>
                </Link>
                <Link
                  to="/smart-analysis"
                  className={`flex items-center space-x-2 ${
                    location.pathname === "/smart-analysis"
                      ? "text-white"
                      : "text-indigo-200 hover:text-white"
                  }`}
                >
                  <LineChart className="w-4 h-4" />
                  <span>Smart Analysis</span>
                </Link>
              </nav>
            )}
          </div>

          {authToken && authToken !== "null" && authToken !== "undefined" && (
            <div className="flex items-center space-x-6">
              <button
                className="p-2 hover:bg-indigo-800 rounded-full relative"
                onClick={() => setIsNotificationsPanelOpen(true)}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-indigo-900" />
              </button>
              <button className="p-2 hover:bg-indigo-800 rounded-full">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
              <User className="w-8 h-8 rounded-full" />
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-indigo-200">{currentUser.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {authToken && authToken !== "null" && authToken !== "undefined" && (
        <NotificationsPanel
          isOpen={isNotificationsPanelOpen}
          onClose={() => setIsNotificationsPanelOpen(false)}
        />
      )}
    </>
  );
}
