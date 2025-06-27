
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Filter {
  id: string;
  name: string;
  thumbnail: string;
  overlay: string;
  type: 'face' | 'background' | 'aura' | 'crown';
}

const filters: Filter[] = [
  {
    id: 'tilak',
    name: 'Shiva Tilak',
    thumbnail: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=100&h=100&fit=crop',
    overlay: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop',
    type: 'face'
  },
  {
    id: 'trishul',
    name: 'Trishul & Damru',
    thumbnail: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=100&h=100&fit=crop',
    overlay: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300&h=400&fit=crop',
    type: 'background'
  },
  {
    id: 'neelkanth',
    name: 'Blue Aura',
    thumbnail: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=100&h=100&fit=crop',
    overlay: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=400&fit=crop',
    type: 'aura'
  },
  {
    id: 'crown',
    name: 'Crown & Serpent',
    thumbnail: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=100&h=100&fit=crop',
    overlay: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=300&h=200&fit=crop',
    type: 'crown'
  }
];

const CameraFilters = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const drawFilter = useCallback(() => {
    if (!selectedFilter || !videoRef.current || !overlayCanvasRef.current) return;

    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create filter overlay based on type
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.globalAlpha = 0.8;
      
      switch (selectedFilter.type) {
        case 'face':
          // Tilak on forehead - center top
          const tilakWidth = canvas.width * 0.15;
          const tilakHeight = tilakWidth * 0.6;
          ctx.drawImage(img, 
            (canvas.width - tilakWidth) / 2, 
            canvas.height * 0.15, 
            tilakWidth, 
            tilakHeight
          );
          break;
          
        case 'background':
          // Trishul & Damru in background
          const bgWidth = canvas.width * 0.3;
          const bgHeight = canvas.height * 0.4;
          ctx.drawImage(img, 
            canvas.width * 0.05, 
            canvas.height * 0.3, 
            bgWidth, 
            bgHeight
          );
          break;
          
        case 'aura':
          // Blue aura around head
          ctx.globalAlpha = 0.3;
          const auraSize = canvas.width * 0.6;
          ctx.drawImage(img, 
            (canvas.width - auraSize) / 2, 
            canvas.height * 0.1, 
            auraSize, 
            auraSize
          );
          break;
          
        case 'crown':
          // Crown on top of head
          const crownWidth = canvas.width * 0.4;
          const crownHeight = crownWidth * 0.5;
          ctx.drawImage(img, 
            (canvas.width - crownWidth) / 2, 
            canvas.height * 0.05, 
            crownWidth, 
            crownHeight
          );
          break;
      }
    };
    img.src = selectedFilter.overlay;
  }, [selectedFilter]);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw filter overlay if selected
    if (selectedFilter && overlayCanvasRef.current) {
      ctx.drawImage(overlayCanvasRef.current, 0, 0);
    }

    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);
    setIsCapturing(false);
  }, [selectedFilter]);

  const downloadImage = useCallback(() => {
    if (!capturedImage) return;

    const link = document.createElement('a');
    link.download = `shiva-filter-${Date.now()}.png`;
    link.href = capturedImage;
    link.click();
  }, [capturedImage]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    const interval = setInterval(drawFilter, 100);
    return () => clearInterval(interval);
  }, [drawFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            🕉️ Shiva Camera Filters
          </h1>
          <p className="text-purple-200">
            Apply divine filters and capture blessed moments
          </p>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-red-100 border-red-300">
            <p className="text-red-700">{error}</p>
            <Button 
              onClick={startCamera}
              className="mt-2"
              variant="outline"
            >
              Try Again
            </Button>
          </Card>
        )}

        <div className="relative mb-6">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video max-w-2xl mx-auto">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas
              ref={overlayCanvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />
          </div>
          
          {selectedFilter && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedFilter.name}
            </div>
          )}
        </div>

        {/* Filter Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter)}
              className={`relative group rounded-lg overflow-hidden transition-all duration-300 ${
                selectedFilter?.id === filter.id
                  ? 'ring-4 ring-purple-400 scale-105'
                  : 'hover:scale-105'
              }`}
            >
              <img
                src={filter.thumbnail}
                alt={filter.name}
                className="w-full h-20 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-medium truncate">
                  {filter.name}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Clear Filter Button */}
        {selectedFilter && (
          <div className="text-center mb-6">
            <Button
              onClick={() => setSelectedFilter(null)}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filter
            </Button>
          </div>
        )}

        {/* Capture Preview */}
        {capturedImage && (
          <Card className="p-4 mb-6 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">
                Captured Image
              </h3>
              <img
                src={capturedImage}
                alt="Captured"
                className="max-w-sm mx-auto rounded-lg shadow-lg"
              />
              <div className="mt-4 space-x-4">
                <Button
                  onClick={downloadImage}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => setCapturedImage(null)}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Fixed Camera Button */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          onClick={captureImage}
          disabled={isCapturing || !stream}
          size="lg"
          className="bg-white text-black hover:bg-gray-100 rounded-full w-16 h-16 shadow-lg border-4 border-white/20"
        >
          <Camera className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
};

export default CameraFilters;
