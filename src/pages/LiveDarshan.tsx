
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LiveDarshan = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  // RTSP stream URL - Note: This needs to be converted to HLS/WebRTC for web browsers
  const rtspStreamUrl = "http://13.61.12.204/live/stream.m3u8";
  
  // For demonstration, we'll show this message since RTSP won't work directly
  const [showRtspMessage, setShowRtspMessage] = useState(true);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      console.log('Live stream loading...', rtspStreamUrl);
      setStreamError(false);
      setShowRtspMessage(false);
    };

    const handleCanPlay = () => {
      console.log('Live stream ready to play');
      setIsStreamActive(true);
      setStreamError(false);
      setShowRtspMessage(false);
    };

    const handleError = (e: Event) => {
      console.error('Live stream error:', e);
      console.error('RTSP URL:', rtspStreamUrl);
      setIsStreamActive(false);
      setStreamError(true);
      setConnectionAttempts(prev => prev + 1);
      
      // Show RTSP message after failed attempts
      if (connectionAttempts > 0) {
        setShowRtspMessage(true);
      }
    };

    const handleLoadedData = () => {
      console.log('Live stream data loaded');
      setIsStreamActive(true);
      setShowRtspMessage(false);
    };

    const handleLoadedMetadata = () => {
      console.log('Live stream metadata loaded');
      setShowRtspMessage(false);
      // Try to play the video once metadata is loaded
      video.play().catch(error => {
        console.error('Auto-play failed:', error);
        setStreamError(true);
      });
    };

    // Add event listeners
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Attempt to load the RTSP stream (this will likely fail in browsers)
    try {
      video.src = rtspStreamUrl;
      video.load();
    } catch (error) {
      console.error('Failed to load RTSP stream:', error);
      setStreamError(true);
      setShowRtspMessage(true);
    }

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [connectionAttempts]);

  const retryConnection = () => {
    const video = videoRef.current;
    if (video) {
      setStreamError(false);
      setIsStreamActive(false);
      setShowRtspMessage(false);
      setConnectionAttempts(0);
      
      try {
        video.src = rtspStreamUrl;
        video.load();
      } catch (error) {
        console.error('Retry failed:', error);
        setStreamError(true);
        setShowRtspMessage(true);
      }
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
          {(!isStreamActive || streamError || showRtspMessage) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl">📹</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Live Darshan</h3>
                <p className="text-gray-300 text-sm mb-2">Streaming live from the temple</p>
                
                {showRtspMessage && (
                  <div className="bg-yellow-900/50 rounded-lg p-3 mb-4 text-yellow-200">
                    <p className="text-xs mb-2">
                      <strong>Technical Note:</strong> RTSP streams cannot be played directly in web browsers.
                    </p>
                    <p className="text-xs">
                      Stream URL: {rtspStreamUrl}
                    </p>
                    <p className="text-xs mt-1">
                      A streaming server (like FFmpeg, GStreamer, or Wowza) is needed to convert RTSP to HLS/WebRTC format.
                    </p>
                  </div>
                )}
                
                <p className="text-gray-300 text-sm">
                  {streamError ? 'Connecting to live feed...' : 'Live video will start soon'}
                </p>
                
                <button
                  onClick={retryConnection}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  Try Connection ({connectionAttempts + 1})
                </button>
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
                {isStreamActive ? 'Live stream is active' : 
                 showRtspMessage ? 'RTSP stream requires server conversion' : 
                 'Connecting to live stream...'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Stream: {rtspStreamUrl}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              isStreamActive ? 'bg-green-500' : 
              showRtspMessage ? 'bg-yellow-500' : 
              'bg-gray-400'
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
