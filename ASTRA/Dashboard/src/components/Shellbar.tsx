import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Bell, Settings, LineChart, TrendingUp, AlertTriangle } from 'lucide-react';
import type { User as UserType } from '../types';
import NotificationsPanel from './NotificationsPanel';

const currentUser: UserType = {
  name: 'John',
  role: 'Treasury Analyst',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  email: 'john.doe@example.com'
};

export default function Shellbar() {
  const location = useLocation();
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);

  return (
    <>
      <header className="bg-indigo-900 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold">Treasury Analytics</h1>
            <nav className="hidden md:flex space-x-6">
              <Link
                to="/"
                className={`flex items-center space-x-2 ${
                  location.pathname === '/' ? 'text-white' : 'text-indigo-200 hover:text-white'
                }`}
              >
                <LineChart className="w-4 h-4" />
                <span>Charts</span>
              </Link>
              <Link
                to="/insights"
                className={`flex items-center space-x-2 ${
                  location.pathname === '/insights' ? 'text-white' : 'text-indigo-200 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Market Insights</span>
              </Link>
              <Link
                to="/alerts"
                className={`flex items-center space-x-2 ${
                  location.pathname === '/alerts' ? 'text-white' : 'text-indigo-200 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Set Threshold</span>
              </Link>
            </nav>
          </div>
          
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
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-indigo-200">{currentUser.role}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <NotificationsPanel
        isOpen={isNotificationsPanelOpen}
        onClose={() => setIsNotificationsPanelOpen(false)}
      />
    </>
  );
}