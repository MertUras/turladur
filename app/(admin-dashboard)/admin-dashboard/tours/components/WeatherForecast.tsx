'use client';

import { useState, useEffect } from 'react';
import {
  CloudIcon,
  SunIcon,
  CloudArrowDownIcon,
  BoltIcon,
  CloudArrowUpIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface WeatherData {
  date: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

interface WeatherForecastProps {
  location: string;
  coordinates: [number, number];
  startDate: string;
  endDate: string;
}

export default function WeatherForecast({
  location,
  coordinates,
  startDate,
  endDate
}: WeatherForecastProps) {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Gerçek API entegrasyonu burada yapılacak
        // Şimdilik mock data kullanıyoruz
        const mockData: WeatherData[] = [
          {
            date: '2024-03-15',
            temperature: 15,
            condition: 'cloudy',
            icon: 'cloud',
            humidity: 65,
            windSpeed: 12,
            precipitation: 20
          },
          {
            date: '2024-03-16',
            temperature: 18,
            condition: 'sunny',
            icon: 'sun',
            humidity: 55,
            windSpeed: 8,
            precipitation: 0
          },
          {
            date: '2024-03-17',
            temperature: 12,
            condition: 'rainy',
            icon: 'rain',
            humidity: 80,
            windSpeed: 15,
            precipitation: 60
          }
        ];

        setWeatherData(mockData);
        setLoading(false);
      } catch (err) {
        setError('Hava durumu verileri alınamadı');
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location, coordinates, startDate, endDate]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <SunIcon className="h-8 w-8 text-yellow-500" />;
      case 'cloudy':
        return <CloudIcon className="h-8 w-8 text-gray-500" />;
      case 'rainy':
        return <CloudArrowDownIcon className="h-8 w-8 text-blue-500" />;
      case 'stormy':
        return <BoltIcon className="h-8 w-8 text-yellow-600" />;
      case 'snowy':
        return <CloudArrowUpIcon className="h-8 w-8 text-blue-300" />;
      default:
        return <ArrowPathIcon className="h-8 w-8 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          {location} Hava Durumu
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {startDate} - {endDate}
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {weatherData.map((day) => (
            <div
              key={day.date}
              className="bg-gray-50 rounded-lg p-4 text-center"
            >
              <div className="flex justify-center mb-2">
                {getWeatherIcon(day.condition)}
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {day.temperature}°C
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {new Date(day.date).toLocaleDateString('tr-TR', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Nem:</span>
                  <span>{day.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Rüzgar:</span>
                  <span>{day.windSpeed} km/s</span>
                </div>
                <div className="flex justify-between">
                  <span>Yağış:</span>
                  <span>{day.precipitation}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 