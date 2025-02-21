import React, { useState } from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import ChartCard from '../components/ChartCard';
import type { Currency, DateRange } from '../types';

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'INR', name: 'Indian Rupee' },
];

// Mock data generator
const generateChartData = (months: number, baseValue: number, volatility: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = -12; i < months; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const actual = i < 0 ? baseValue + (Math.random() - 0.5) * volatility : null;
    const forecast = baseValue + (Math.random() - 0.5) * volatility;
    
    data.push({
      date: date.toISOString(),
      actual: actual || forecast,
      forecast: forecast
    });
  }
  
  return data;
};

export default function ChartsDashboard() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [compareCurrency, setCompareCurrency] = useState('EUR');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    end: new Date(new Date().setFullYear(new Date().getFullYear() + 2))
  });

  const interestRateData = generateChartData(36, 4.5, 1);
  const exchangeRateData = generateChartData(36, 1.1, 0.2);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Market Analysis Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="text-gray-500 w-5 h-5" />
            <select
              className="form-select rounded-md border-gray-300 shadow-sm"
              onChange={(e) => {
                const years = parseInt(e.target.value);
                setDateRange({
                  start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
                  end: new Date(new Date().setFullYear(new Date().getFullYear() + years))
                });
              }}
            >
              <option value="1">1 Year</option>
              <option value="2">2 Years</option>
              <option value="3" selected>3 Years</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Interest Rate Forecast</h2>
            <select
              className="form-select rounded-md border-gray-300 shadow-sm"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.code})
                </option>
              ))}
            </select>
          </div>
          <ChartCard
            title={`${selectedCurrency} Interest Rate Forecast`}
            data={interestRateData}
            yAxisLabel="Interest Rate (%)"
            dateRange={dateRange}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Exchange Rate Forecast</h2>
            <div className="flex items-center space-x-2">
              <select
                className="form-select rounded-md border-gray-300 shadow-sm"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code}
                  </option>
                ))}
              </select>
              <DollarSign className="text-gray-500 w-5 h-5" />
              <select
                className="form-select rounded-md border-gray-300 shadow-sm"
                value={compareCurrency}
                onChange={(e) => setCompareCurrency(e.target.value)}
              >
                {currencies.filter(c => c.code !== selectedCurrency).map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ChartCard
            title={`${selectedCurrency}/${compareCurrency} Exchange Rate`}
            data={exchangeRateData}
            yAxisLabel="Exchange Rate"
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
}