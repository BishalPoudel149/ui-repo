import React from 'react';
import { Bell, X } from 'lucide-react';
import type { Notification } from '../types';

// Mock notifications data
const notifications: Notification[] = [
  {
    id: '1',
    title: 'EUR/USD Alert',
    message: 'Exchange rate has exceeded upper threshold of 1.20',
    type: 'alert',
    read: false,
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    title: 'System Update',
    message: 'New market data available for analysis',
    type: 'system',
    read: true,
    timestamp: new Date(Date.now() - 86400000).toISOString()
  }
];

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 h-0 overflow-y-auto">
              <div className="py-6 px-4 bg-indigo-700 sm:px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-white">Notifications</h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button
                      type="button"
                      className="rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                      onClick={onClose}
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-6 sm:px-6 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Bell className={`h-6 w-6 ${
                          notification.type === 'alert' ? 'text-red-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}