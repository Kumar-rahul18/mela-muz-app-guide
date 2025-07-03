
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LiveDarshan = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-gradient text-white px-4 py-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/')} className="text-white">
            ← 
          </button>
          <h1 className="text-lg font-semibold">Live Darshan</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Live Video Section */}
        <div className="bg-black rounded-2xl aspect-video mb-6 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-2xl">📹</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Live Darshan</h3>
            <p className="text-gray-300 text-sm">Streaming live from the temple</p>
          </div>
        </div>

        {/* Status Cards */}
{/*         <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm font-medium text-gray-800">Live Status</p>
              <p className="text-xs text-green-600">Active</p>
            </div>
          </div> */}
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg">👥</span>
              </div>
              <p className="text-sm font-medium text-gray-800">Viewers</p>
              <p className="text-xs text-blue-600">1,247</p>
            </div>
          </div>
        </div>

        {/* Aarti Schedule */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Aarti Schedule</h3>
          <div className="space-y-3">
            {[
              { time: '5:00 AM', name: 'Mangla Aarti', status: 'completed' },
              { time: '12:00 PM', name: 'Bhog Aarti', status: 'live' },
              { time: '7:00 PM', name: 'Sandhya Aarti', status: 'upcoming' },
              { time: '10:00 PM', name: 'Shayan Aarti', status: 'upcoming' }
            ].map((aarti, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    aarti.status === 'completed' ? 'bg-gray-400' :
                    aarti.status === 'live' ? 'bg-red-500 animate-pulse' :
                    'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-800">{aarti.name}</p>
                    <p className="text-xs text-gray-500">{aarti.time}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  aarti.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                  aarti.status === 'live' ? 'bg-red-100 text-red-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {aarti.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDarshan;
