import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, DollarSign } from 'lucide-react';
import type { Currency, DateRange } from '../types';
import finalPredictedData from '../final_predicted_data.json';
import ChatComponent from './ChatComponent';

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'INR', name: 'Indian Rupee' },
];

const ChartsDashboard = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [compareCurrency, setCompareCurrency] = useState('INR');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    end: new Date()
  });

  const filterDataEvery15Days = (data: any[]) => {
    return data.filter((_, index) => index % 15 === 0);
  };

  const filteredInterestRateData = filterDataEvery15Days(finalPredictedData.filter((item: any) => {
    const date = new Date(item.Date);
    return date >= dateRange.start && date <= dateRange.end;
  }).map((item: any) => ({
    date: item.Date,
    actual: item.RBI_Interest_Rate,
    predicted: item.prediction_IR
  })));

  const filteredExchangeRateData = filterDataEvery15Days(finalPredictedData.filter((item: any) => {
    const date = new Date(item.Date);
    return date >= dateRange.start && date <= dateRange.end;
  }).map((item: any) => ({
    date: item.Date,
    actual: item.USD_INR,
    predicted: item.prediction_EX
  })));

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
                const value = e.target.value;
                let startDate;
                switch (value) {
                  case '3 Months':
                    startDate = new Date(new Date().setMonth(new Date().getMonth() - 3));
                    break;
                  case '6 Months':
                    startDate = new Date(new Date().setMonth(new Date().getMonth() - 6));
                    break;
                  case '1 Year':
                    startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
                    break;
                  case '2 Years':
                    startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 2));
                    break;
                  case '3 Years':
                    startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 3));
                    break;
                  default:
                    startDate = new Date(new Date().setMonth(new Date().getMonth() - 3));
                }
                setDateRange({
                  start: startDate,
                  end: new Date()
                });
              }}
            >
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year" selected>1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
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
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredInterestRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="predicted" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
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
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredExchangeRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="predicted" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <ChatComponent />
      </div>
    </div>
  );
};

export default ChartsDashboard;