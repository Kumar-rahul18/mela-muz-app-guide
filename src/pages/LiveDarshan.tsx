
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
       
        {/* Aarti Schedule */}
  
      </div>
    </div>
  );
};

export default LiveDarshan;
