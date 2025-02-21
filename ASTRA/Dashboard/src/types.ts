export interface User {
  name: string;
  role: string;
  avatar: string;
  email?: string;
}

export interface ForecastParameter {
  name: string;
  value: number;
  unit: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timestamp: string;
  url: string;
  source: string;
}


export interface ChartData {
  date: string;
  actual: number;
  forecast: number;
}

export interface Currency {
  code: string;
  name: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface Alert {
  id: string;
  type: 'interest' | 'exchange';
  currency: string;
  compareCurrency?: string;
  upperThreshold: number;
  lowerThreshold: number;
  enabled: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'system';
  read: boolean;
  timestamp: string;
}