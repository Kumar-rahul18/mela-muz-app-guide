
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LiveDarshan = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [streamError, setStreamError] = useState(false);
  
  // Live feed URL
  const liveStreamUrl = "	http://webcam.kielmonitor.de:8080/mjpg/video.mjpg";//https://ipcamlive.com/64a530efb34bd
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      console.log('Live stream loading...');
      setStreamError(false);
    };

    const handleCanPlay = () => {
      console.log('Live stream ready to play');
      setIsStreamActive(true);
      setStreamError(false);
    };

    const handleError = (e: Event) => {
      console.error('Live stream error:', e);
      setIsStreamActive(false);
      setStreamError(true);
    };

    const handleLoadedData = () => {
      console.log('Live stream data loaded');
      setIsStreamActive(true);
    };

    const handleLoadedMetadata = () => {
      console.log('Live stream metadata loaded');
      // Try to play the video once metadata is loaded
      video.play().catch(error => {
        console.error('Auto-play failed:', error);
      });
    };

    // Add event listeners
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Load the live stream
    video.src = liveStreamUrl;
    video.load();

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const retryConnection = () => {
    const video = videoRef.current;
    if (video) {
      setStreamError(false);
      setIsStreamActive(false);
      video.src = liveStreamUrl;
      video.load();
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
          {/* Live Video Stream */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${isStreamActive ? 'block' : 'hidden'}`}
            autoPlay
            muted
            playsInline
            controls
            crossOrigin="anonymous"
          />
          
          {/* Placeholder when stream is not available */}
          {(!isStreamActive || streamError) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl">📹</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Live Darshan</h3>
                <p className="text-gray-300 text-sm">Streaming live from the temple</p>
                <p className="text-gray-300 text-sm">
                  {streamError ? 'Live video will start soon' : 'Connecting to live feed...'}
                </p>
                {streamError && (
                  <button
                    onClick={retryConnection}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                  >
                    Retry Connection
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Live indicator when stream is active */}
          {isStreamActive && (
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
                {isStreamActive ? 'Live stream is active' : 'Waiting for live stream'}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${isStreamActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
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
