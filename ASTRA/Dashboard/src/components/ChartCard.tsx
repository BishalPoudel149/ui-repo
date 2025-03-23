import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import type { ChartData } from '../types';
import ChatComponent from './ChatComponent';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartCardProps {
  title: string;
  data: ChartData[];
  yAxisLabel: string;
  dateRange: { start: Date; end: Date };
}

export default function ChartCard({ title, data, yAxisLabel, dateRange }: ChartCardProps) {
  const filteredData = data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= dateRange.start && itemDate <= dateRange.end;
  });

  const chartData = {
    labels: filteredData.map(item => format(new Date(item.date), 'MMM yyyy')),
    datasets: [
      {
        label: 'Actual',
        data: filteredData.map(item => item.actual),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Forecast',
        data: filteredData.map(item => item.forecast),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderDash: [5, 5],
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: yAxisLabel,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 relative ">
      <div className="relative">
      </div>
      <div className="h-[400px]">
        <button
          className="fixed bottom-10 right-10 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-transform z-[1000]"
          onClick={() => alert('Test button clicked!')}
        >
          Test
        </button>
        <ChatComponent />
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}