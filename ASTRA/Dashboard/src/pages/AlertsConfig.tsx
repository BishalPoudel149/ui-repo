import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import type { Alert, Currency } from '../types';

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'INR', name: 'Indian Rupee' },
];

const ALERTS_STORAGE_KEY = 'alerts';

export default function AlertsConfig() {
  const [email, setEmail] = useState('');
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const savedAlerts = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  }, [alerts]);

  const addAlert = () => {
    const newAlert: Alert = {
      id: crypto.randomUUID(),
      type: 'exchange',
      currency: 'USD',
      compareCurrency: 'INR',
      upperThreshold: 95,
      lowerThreshold: 85,
      enabled: false,
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

  const toggleAlert = (alert: Alert) => {
    const alertData = {
      userId: email,
      baseCurrency: alert.currency,
      targetCurrency: alert.compareCurrency,
      lowThreshold: alert.lowerThreshold,
      highThreshold: alert.upperThreshold
    };

    if (!alert.enabled) {
      fetch('https://nestjs-backend.cfapps.us10-001.hana.ondemand.com/forex-alerts/forex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alertData)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Alert enabled:', data);
        updateAlert(alert.id, { enabled: true });
      })
      .catch(error => console.error('Error enabling alert:', error));
    } else {
      updateAlert(alert.id, { enabled: false });
    }
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
          <span>Add Threshold</span>
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700">User Id</label>
          <div className="mt-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter your userId"
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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleAlert(alert)}
                    className={`px-4 py-2 rounded-lg text-white ${alert.enabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {alert.enabled ? 'Disable Alert' : 'Enable Alert'}
                  </button>
                  <button
                    onClick={() => console.log('Edit alert', alert.id)}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}