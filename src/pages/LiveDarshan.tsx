
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LiveDarshan = () => {
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isStreamLoaded, setIsStreamLoaded] = useState(false);
  const [streamError, setStreamError] = useState(false);
  
  // Updated live stream URL - using the RTSP.me embed link
  const streamUrl = 'https://rtsp.me/embed/hY7DS2rk/';
  const directLink = 'https://rtsp.me/embed/hY7DS2rk/';
  
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

  const openFullScreen = () => {
    window.open(directLink, '_blank');
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
            title="Live Darshan Stream"
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
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors mr-2"
                  >
                    Retry Connection
                  </button>
                )}
                
                <button
                  onClick={openFullScreen}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Open Full Screen
                </button>
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

          {/* Full Screen Button */}
          {isStreamLoaded && !streamError && (
            <button
              onClick={openFullScreen}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
              title="Open in full screen"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          )}
        </div>

        {/* Stream Information */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-800">Stream Status</h3>
              <p className="text-sm text-gray-600">
                {isStreamLoaded && !streamError ? 'Live stream is active' : 
                 streamError ? 'Connection failed' : 
                 'Loading live stream...'}
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
              { time: '5:00 AM', name: 'Mangla Aarti'  },
              { time: '12:00 PM', name: 'Bhog Aarti' },
              { time: '7:00 PM', name: 'Sandhya Aarti' },
              { time: '10:00 PM', name: 'Shayan Aarti' }
            ].map((aarti, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-gray-800">{aarti.name}</div>
                  <div className="text-sm text-gray-600">{aarti.time}</div>
                </div>
               
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDarshan;
