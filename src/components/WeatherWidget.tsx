
import React, { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  feels_like: number;
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const API_KEY = 'edf9c19eb512a084c9008c0fa16ae592';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Muzaffarpur,Bihar,IN&appid=${API_KEY}&units=metric`
      );
      
      if (response.ok) {
        const data = await response.json();
        setWeather({
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          humidity: data.main.humidity,
          feels_like: Math.round(data.main.feels_like)
        });
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <span className="text-lg">🌤️</span>
        </div>
        <div>
          <p className="font-medium text-gray-800 text-sm">Weather</p>
          <p className="text-xs text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <span className="text-lg">🌤️</span>
        </div>
        <div>
          <p className="font-medium text-gray-800 text-sm">Weather</p>
          <p className="text-xs text-gray-500">Unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
        <span className="text-lg">🌤️</span>
      </div>
      <div>
        <p className="font-medium text-gray-800 text-sm">
          {weather.temperature}°C
        </p>
        <p className="text-xs text-gray-500 capitalize">
          {weather.description}
        </p>
      </div>
    </div>
  );
};

export default WeatherWidget;
