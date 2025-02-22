import React, { useEffect, useState } from 'react';
import { Newspaper } from 'lucide-react';
import type { NewsItem } from '../types';

const apiEndpoint = 'https://news-analysis.cfapps.us10-001.hana.ondemand.com/news-analysis';
const CACHE_KEY = 'newsItems';
const CACHE_EXPIRATION_KEY = 'newsItemsExpiration';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const cachedNews = localStorage.getItem(CACHE_KEY);
    const cachedExpiration = localStorage.getItem(CACHE_EXPIRATION_KEY);
    const now = new Date().getTime();

    if (cachedNews && cachedExpiration && now < parseInt(cachedExpiration, 10)) {
      setNewsItems(JSON.parse(cachedNews));
      setLoading(false);
    } else {
      fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
          const formattedNewsItems = data.results.map((item: any, index: number) => ({
            id: index.toString(),
            title: item.title,
            description: item.description,
            impact: item.analysis.toLowerCase(),
            timestamp: item.publishedAt,
            url: item.url,
            source: item.source.name,
          }));
          setNewsItems(formattedNewsItems);
          localStorage.setItem(CACHE_KEY, JSON.stringify(formattedNewsItems));
          localStorage.setItem(CACHE_EXPIRATION_KEY, (now + CACHE_DURATION).toString());
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching news:', error);
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mt-6 overflow-y-auto" style={{ maxHeight: '430px' }}>
      <div className="flex items-center justify-between p-6 mb-6">
        <h2 className="text-2xl font-bold">Market News</h2>
        <Newspaper className="text-gray-600 w-6 h-6" />
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
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
                <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                Read more
                </a>
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
              <p className="text-gray-600 mt-1">{new Date(news.timestamp).toLocaleString()} <span>&nbsp;&nbsp;&nbsp;&nbsp;</span> Source: {news.source}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}