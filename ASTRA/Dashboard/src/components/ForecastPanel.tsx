import React, { useState } from 'react';
import { TrendingUp, DollarSign, Percent } from 'lucide-react';
import type { ForecastParameter } from '../types';

const parameters: ForecastParameter[] = [
  { name: 'GDP Growth', value: 2.5, unit: '%' },
  { name: 'Inflation Rate', value: 3.2, unit: '%' },
  { name: 'Forward Rate', value: 5.1, unit: '%' }
];

export default function ForecastPanel() {
  const [forecast, setForecast] = useState({
    interestRate: 4.25,
    exchangeRate: 1.18
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Market Forecasts</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Interest Rate Forecast</h3>
            <Percent className="text-indigo-600 w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-indigo-600">{forecast.interestRate}%</p>
          <p className="text-sm text-gray-600 mt-2">Projected 3-month rate</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Exchange Rate Forecast</h3>
            <DollarSign className="text-emerald-600 w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-emerald-600">{forecast.exchangeRate}</p>
          <p className="text-sm text-gray-600 mt-2">EUR/USD</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Key Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {parameters.map((param) => (
            <div key={param.name} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">{param.name}</p>
              <p className="text-xl font-semibold mt-1">
                {param.value}{param.unit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}