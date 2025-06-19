
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CrowdStatus = () => {
  const navigate = useNavigate();

  const locations = [
    { name: 'Main Temple', status: 'high', count: '500+', color: 'red' },
    { name: 'Entrance Gate', status: 'medium', count: '200-300', color: 'yellow' },
    { name: 'Prasad Counter', status: 'low', count: '50-100', color: 'green' },
    { name: 'Parking Area', status: 'medium', count: '150-250', color: 'yellow' },
    { name: 'Food Court', status: 'low', count: '30-80', color: 'green' },
    { name: 'Rest Area', status: 'low', count: '20-50', color: 'green' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-gradient text-white px-4 py-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/')} className="text-white">
            ← 
          </button>
          <h1 className="text-lg font-semibold">Crowd Status</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Overall Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Current Crowd Level</h2>
            <div className="w-24 h-24 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 mb-2">MODERATE</p>
            <p className="text-gray-600 text-sm">Last updated: 2 minutes ago</p>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Crowd Levels</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mb-1"></div>
              <span className="text-xs text-gray-600">Low</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mb-1"></div>
              <span className="text-xs text-gray-600">Moderate</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mb-1"></div>
              <span className="text-xs text-gray-600">High</span>
            </div>
          </div>
        </div>

        {/* Location Status */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Live Status by Location</h3>
          {locations.map((location, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    location.color === 'green' ? 'bg-green-500' :
                    location.color === 'yellow' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-800">{location.name}</p>
                    <p className="text-xs text-gray-500">People: {location.count}</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  location.color === 'green' ? 'bg-green-100 text-green-700' :
                  location.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {location.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-2xl p-4 mt-6">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Tips for Better Experience</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Visit during off-peak hours (early morning or late evening)</li>
            <li>• Use alternative entrances during high crowd times</li>
            <li>• Keep hydrated and follow safety guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CrowdStatus;
