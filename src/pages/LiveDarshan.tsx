
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hls from 'hls.js';

const LiveDarshan = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  // HLS stream URL
  const streamUrl= `https://13.61.12.204/live/stream.m3u8?t=${Date.now()}`;
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const initializeStream = () => {
      console.log('Initializing HLS stream...', streamUrl);
      setStreamError(false);
      setIsStreamActive(false);

      // Clean up any existing HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: false,
          lowLatencyMode: true,
        });
        
        hlsRef.current = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed, starting playback');
          setIsStreamActive(true);
          setStreamError(false);
          video.play().catch(error => {
            console.error('Auto-play failed:', error);
          });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
          if (data.fatal) {
            setStreamError(true);
            setIsStreamActive(false);
            setConnectionAttempts(prev => prev + 1);
          }
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari browsers that support HLS natively
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', () => {
          console.log('Native HLS loaded, starting playback');
          setIsStreamActive(true);
          setStreamError(false);
          video.play().catch(error => {
            console.error('Auto-play failed:', error);
          });
        });
        
        video.addEventListener('error', () => {
          console.error('Native HLS error');
          setStreamError(true);
          setIsStreamActive(false);
          setConnectionAttempts(prev => prev + 1);
        });
      } else {
        console.error('HLS not supported');
        setStreamError(true);
      }
    };

    initializeStream();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [connectionAttempts]);

  const retryConnection = () => {
    console.log('Retrying connection...');
    setStreamError(false);
    setIsStreamActive(false);
    setConnectionAttempts(prev => prev + 1);
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
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            controls
          />
          
          {/* Loading/Error Overlay */}
          {(!isStreamActive || streamError) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white px-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl">📹</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Live Darshan</h3>
                <p className="text-gray-300 text-sm mb-2">Streaming live from the temple</p>
                
                <p className="text-gray-300 text-sm mb-4">
                  {streamError ? 'Connection failed. Please try again.' : 'Connecting to live feed...'}
                </p>
                
                <button
                  onClick={retryConnection}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                  disabled={!streamError}
                >
                  {streamError ? `Retry (${connectionAttempts + 1})` : 'Connecting...'}
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
                 streamError ? 'Connection failed' : 
                 'Connecting to live stream...'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Stream: {streamUrl}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              isStreamActive ? 'bg-green-500' : 
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
