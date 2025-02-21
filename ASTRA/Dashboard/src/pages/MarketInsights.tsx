import React from 'react';
import ForecastPanel from '../components/ForecastPanel';
import NewsSection from '../components/NewsSection';

export default function MarketInsights() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Market Insights</h1>
      </div>
      
      <ForecastPanel />
      <NewsSection />
    </div>
  );
}