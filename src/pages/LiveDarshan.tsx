
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LiveDarshan = () => {
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isStreamLoaded, setIsStreamLoaded] = useState(false);
  const [streamError, setStreamError] = useState(false);
  
  // Live stream URL - updated to the correct format
  const streamUrl = 'https://www.ipcamlive.com/64a530efb34bd';
  
  const handleIframeLoad = () => {
    console.log('Live stream iframe loaded successfully');
    setIsStreamLoaded(true);
    setStreamError(false);
  };

  const handleIframeError = () => {
    console.error('Live stream iframe failed to load');
    setStreamError(true);
    setIsStreamLoaded(false);
  };

  const retryConnection = () => {
    console.log('Retrying live stream connection...');
    setStreamError(false);
    setIsStreamLoaded(false);
    
    if (iframeRef.current) {
      iframeRef.current.src = streamUrl;
    }
  };

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
        <div className="bg-black rounded-2xl aspect-video mb-6 relative overflow-hidden">
          {/* Live Stream Iframe */}
          <iframe
            ref={iframeRef}
            src={streamUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ border: 'none' }}
          />
          
          {/* Loading/Error Overlay */}
          {(!isStreamLoaded || streamError) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white px-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl">📹</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Live Darshan</h3>
                <p className="text-gray-300 text-sm mb-2">Streaming live from the temple</p>
                
                <p className="text-gray-300 text-sm mb-4">
                  {streamError ? 'Connection failed. Please try again.' : 'Loading live feed...'}
                </p>
                
                {streamError && (
                  <button
                    onClick={retryConnection}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                  >
                    Retry Connection
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Live indicator when stream is loaded */}
          {isStreamLoaded && !streamError && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          )}
        </div>

        {/* Stream Status */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Stream Status</h3>
              <p className="text-sm text-gray-600">
                {isStreamLoaded && !streamError ? 'Live stream is active' : 
                 streamError ? 'Connection failed' : 
                 'Loading live stream...'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Direct video stream
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              isStreamLoaded && !streamError ? 'bg-green-500' : 
              streamError ? 'bg-red-500' : 
              'bg-yellow-500'
            }`}></div>
          </div>
        </div>

        {/* Aarti Schedule */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">Today's Aarti Schedule</h3>
          <div className="space-y-3">
            {[
              { time: '5:00 AM', name: 'Mangla Aarti', status: 'completed' },
              { time: '12:00 PM', name: 'Bhog Aarti', status: 'completed' },
              { time: '7:00 PM', name: 'Sandhya Aarti', status: 'live' },
              { time: '10:00 PM', name: 'Shayan Aarti', status: 'upcoming' }
            ].map((aarti, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-gray-800">{aarti.name}</div>
                  <div className="text-sm text-gray-600">{aarti.time}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  aarti.status === 'live' ? 'bg-red-100 text-red-700' :
                  aarti.status === 'completed' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {aarti.status === 'live' ? 'LIVE' : 
                   aarti.status === 'completed' ? 'Completed' : 'Upcoming'}
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
