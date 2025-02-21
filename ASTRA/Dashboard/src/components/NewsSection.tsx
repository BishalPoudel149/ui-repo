import React from 'react';
import { Newspaper } from 'lucide-react';
import type { NewsItem } from '../types';

const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Fed Signals Potential Rate Hike',
    description: 'Federal Reserve officials indicate possibility of interest rate increases in response to inflation concerns.',
    impact: 'high',
    timestamp: '2024-03-15T10:30:00Z',
    category: 'interest'
  },
  {
    id: '2',
    title: 'ECB Policy Meeting Results',
    description: 'European Central Bank maintains current monetary policy stance while monitoring economic indicators.',
    impact: 'medium',
    timestamp: '2024-03-15T09:15:00Z',
    category: 'exchange'
  }
];

export default function NewsSection() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Market News</h2>
        <Newspaper className="text-gray-600 w-6 h-6" />
      </div>

      <div className="space-y-4">
        {newsItems.map((news) => (
          <div
            key={news.id}
            className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-r-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{news.title}</h3>
                <p className="text-gray-600 mt-1">{news.description}</p>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                news.impact === 'high' ? 'bg-red-100 text-red-800' :
                news.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {news.impact.toUpperCase()}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {new Date(news.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}