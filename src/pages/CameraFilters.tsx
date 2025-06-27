
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
  const [filterImages, setFilterImages] = useState<{[key: string]: HTMLImageElement}>({});

  // Preload filter images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = filters.map(filter => {
        return new Promise<{id: string, image: HTMLImageElement}>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve({ id: filter.id, image: img });
          img.onerror = () => reject(new Error(`Failed to load ${filter.name}`));
          img.src = filter.overlay;
        });
      });

      try {
        const results = await Promise.all(imagePromises);
        const imageMap: {[key: string]: HTMLImageElement} = {};
        results.forEach(({ id, image }) => {
          imageMap[id] = image;
        });
        setFilterImages(imageMap);
        console.log('All filter images loaded successfully');
      } catch (err) {
        console.error('Error loading filter images:', err);
      }
    };

    loadImages();
  }, []);

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
    if (!selectedFilter || !videoRef.current || !overlayCanvasRef.current || !filterImages[selectedFilter.id]) {
      return;
    }

    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;
    const filterImage = filterImages[selectedFilter.id];

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    // Set canvas size to match video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply filter based on type
    ctx.globalCompositeOperation = 'source-over';
    
    switch (selectedFilter.type) {
      case 'face':
        // Tilak on forehead - center top
        const tilakWidth = canvas.width * 0.2;
        const tilakHeight = tilakWidth * 0.8;
        ctx.globalAlpha = 0.9;
        ctx.drawImage(filterImage, 
          (canvas.width - tilakWidth) / 2, 
          canvas.height * 0.12, 
          tilakWidth, 
          tilakHeight
        );
        break;
        
      case 'background':
        // Trishul & Damru in background - multiple positions
        const bgWidth = canvas.width * 0.25;
        const bgHeight = canvas.height * 0.35;
        ctx.globalAlpha = 0.6;
        // Left side
        ctx.drawImage(filterImage, 
          canvas.width * 0.05, 
          canvas.height * 0.25, 
          bgWidth, 
          bgHeight
        );
        // Right side
        ctx.drawImage(filterImage, 
          canvas.width * 0.7, 
          canvas.height * 0.25, 
          bgWidth, 
          bgHeight
        );
        break;
        
      case 'aura':
        // Blue aura around head - larger and more prominent
        ctx.globalAlpha = 0.4;
        ctx.globalCompositeOperation = 'screen';
        const auraSize = canvas.width * 0.8;
        ctx.drawImage(filterImage, 
          (canvas.width - auraSize) / 2, 
          canvas.height * 0.05, 
          auraSize, 
          auraSize * 0.8
        );
        break;
        
      case 'crown':
        // Crown on top of head - more prominent
        const crownWidth = canvas.width * 0.5;
        const crownHeight = crownWidth * 0.6;
        ctx.globalAlpha = 0.85;
        ctx.drawImage(filterImage, 
          (canvas.width - crownWidth) / 2, 
          canvas.height * 0.02, 
          crownWidth, 
          crownHeight
        );
        break;
    }
    
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }, [selectedFilter, filterImages]);

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
    link.download = `shiva-filter-${selectedFilter?.name || 'photo'}-${Date.now()}.png`;
    link.href = capturedImage;
    link.click();
  }, [capturedImage, selectedFilter]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // Draw filter overlay continuously
  useEffect(() => {
    if (!selectedFilter || !filterImages[selectedFilter.id]) return;
    
    const interval = setInterval(drawFilter, 50); // 20 FPS for smooth overlay
    return () => clearInterval(interval);
  }, [drawFilter, selectedFilter, filterImages]);

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
              style={{ mixBlendMode: selectedFilter?.type === 'aura' ? 'screen' : 'normal' }}
            />
          </div>
          
          {selectedFilter && (
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-full text-sm backdrop-blur-sm">
              ✨ {selectedFilter.name}
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
                  ? 'ring-4 ring-yellow-400 scale-105 shadow-lg shadow-yellow-400/50'
                  : 'hover:scale-105 ring-2 ring-white/20'
              }`}
            >
              <img
                src={filter.thumbnail}
                alt={filter.name}
                className="w-full h-20 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-medium truncate">
                  {filter.name}
                </p>
              </div>
              {selectedFilter?.id === filter.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              )}
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
                📸 Captured Image
              </h3>
              <img
                src={capturedImage}
                alt="Captured"
                className="max-w-sm mx-auto rounded-lg shadow-lg border-2 border-white/20"
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
          className={`bg-white text-black hover:bg-gray-100 rounded-full w-16 h-16 shadow-lg border-4 border-white/20 transition-all duration-200 ${
            isCapturing ? 'scale-95' : 'hover:scale-110'
          }`}
        >
          <Camera className={`w-8 h-8 ${isCapturing ? 'animate-pulse' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default CameraFilters;
