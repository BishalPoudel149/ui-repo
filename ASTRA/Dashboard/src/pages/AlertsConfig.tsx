import React, { useState } from 'react';
import { Bell, Save, Plus, Trash2 } from 'lucide-react';
import type { Alert, Currency } from '../types';

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'INR', name: 'Indian Rupee' },
];

export default function AlertsConfig() {
  const [email, setEmail] = useState('');
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = () => {
    const newAlert: Alert = {
      id: crypto.randomUUID(),
      type: 'interest',
      currency: 'USD',
      upperThreshold: 0,
      lowerThreshold: 0,
      enabled: true,
      createdAt: new Date().toISOString()
    };
    setAlerts([...alerts, newAlert]);
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const updateAlert = (id: string, updates: Partial<Alert>) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, ...updates } : alert
    ));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Threshold Configuration</h1>
        <button
          onClick={addAlert}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Alert</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <div className="mt-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter your email"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            You will receive notifications at this email address when alerts are triggered.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Configured Thresholds</h2>
        <div className="space-y-6">
          {alerts.map((alert) => (
            <div key={alert.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <select
                    value={alert.type}
                    onChange={(e) => updateAlert(alert.id, { type: e.target.value as 'interest' | 'exchange' })}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="interest">Interest Rate</option>
                    <option value="exchange">Exchange Rate</option>
                  </select>
                  <select
                    value={alert.currency}
                    onChange={(e) => updateAlert(alert.id, { currency: e.target.value })}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code}
                      </option>
                    ))}
                  </select>
                  {alert.type === 'exchange' && (
                    <select
                      value={alert.compareCurrency}
                      onChange={(e) => updateAlert(alert.id, { compareCurrency: e.target.value })}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      {currencies
                        .filter((c) => c.code !== alert.currency)
                        .map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Upper Threshold</label>
                  <input
                    type="number"
                    value={alert.upperThreshold}
                    onChange={(e) => updateAlert(alert.id, { upperThreshold: parseFloat(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lower Threshold</label>
                  <input
                    type="number"
                    value={alert.lowerThreshold}
                    onChange={(e) => updateAlert(alert.id, { lowerThreshold: parseFloat(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={alert.enabled}
                  onChange={(e) => updateAlert(alert.id, { enabled: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">Enable Alert</label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}