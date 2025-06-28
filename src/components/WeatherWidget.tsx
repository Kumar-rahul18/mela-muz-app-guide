
import React, { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  feels_like: number;
  aqi?: number;
  air_quality_description?: string;
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherAndAQI();
  }, []);

  const fetchWeatherAndAQI = async () => {
    try {
      const API_KEY = 'edf9c19eb512a084c9008c0fa16ae592';
      
      // Fetch weather data
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Muzaffarpur,Bihar,IN&appid=${API_KEY}&units=metric`
      );
      
      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json();
        
        // Fetch AQI data using coordinates
        const lat = weatherData.coord.lat;
        const lon = weatherData.coord.lon;
        
        const aqiResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        
        let aqiData = null;
        if (aqiResponse.ok) {
          aqiData = await aqiResponse.json();
        }
        
        const getAQIDescription = (aqi: number) => {
          switch (aqi) {
            case 1: return 'Good';
            case 2: return 'Fair';
            case 3: return 'Moderate';
            case 4: return 'Poor';
            case 5: return 'Very Poor';
            default: return 'Unknown';
          }
        };

        // Calculate exact AQI from PM2.5 values if available
        const calculateExactAQI = (pm25: number) => {
          if (pm25 <= 12) return Math.round((50 / 12) * pm25);
          if (pm25 <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
          if (pm25 <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
          if (pm25 <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
          if (pm25 <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
          return Math.round(((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5) + 301);
        };

        let exactAQI = null;
        if (aqiData?.list[0]?.components?.pm2_5) {
          exactAQI = calculateExactAQI(aqiData.list[0].components.pm2_5);
        }
        
        setWeather({
          temperature: Math.round(weatherData.main.temp),
          description: weatherData.weather[0].description,
          humidity: weatherData.main.humidity,
          feels_like: Math.round(weatherData.main.feels_like),
          aqi: exactAQI || aqiData?.list[0]?.main?.aqi,
          air_quality_description: exactAQI ? undefined : (aqiData ? getAQIDescription(aqiData.list[0].main.aqi) : undefined)
        });
      }
    } catch (error) {
      console.error('Error fetching weather and AQI:', error);
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
        {weather.aqi && (
          <p className="text-xs text-gray-500">
            AQI: {weather.aqi}{weather.air_quality_description && ` (${weather.air_quality_description})`}
          </p>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;
