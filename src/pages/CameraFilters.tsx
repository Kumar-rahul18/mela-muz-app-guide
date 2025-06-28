import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import EnhancedFilterRenderer from '@/components/EnhancedFilterRenderer';

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
    thumbnail: '/lovable-uploads/195b827b-c79e-4753-aa06-394c27e27da1.png',
    overlay: '/lovable-uploads/195b827b-c79e-4753-aa06-394c27e27da1.png',
    type: 'face'
  },
  {
    id: 'neelkanth',
    name: 'Blue Aura',
    thumbnail: '/lovable-uploads/6fc03120-10c1-40d0-b803-c082f6fa91cd.png',
    overlay: '/lovable-uploads/6fc03120-10c1-40d0-b803-c082f6fa91cd.png',
    type: 'aura'
  },
  {
    id: 'trishul',
    name: 'Trishul & Damru',
    thumbnail: '/lovable-uploads/007f17f5-6b20-44ed-b7bc-488836128d04.png',
    overlay: '/lovable-uploads/007f17f5-6b20-44ed-b7bc-488836128d04.png',
    type: 'background'
  },
  {
    id: 'crown',
    name: 'Crown & Serpent',
    thumbnail: '/lovable-uploads/36b952a4-30d9-4115-a293-9349e51a028a.png',
    overlay: '/lovable-uploads/36b952a4-30d9-4115-a293-9349e51a028a.png',
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
  const [cameraReady, setCameraReady] = useState(false);

  // Initialize face detection
  const { faceDetections, isInitialized: faceDetectionReady, startDetection, stopDetection } = useFaceDetection(videoRef);

  // Preload filter images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = filters.map(filter => {
        return new Promise<{id: string, image: HTMLImageElement}>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            console.log(`Loaded filter image: ${filter.name}`);
            resolve({ id: filter.id, image: img });
          };
          img.onerror = () => {
            console.error(`Failed to load ${filter.name}`);
            reject(new Error(`Failed to load ${filter.name}`));
          };
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
      console.log('Starting camera...');
      const constraints = {
        video: { 
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        },
        audio: false
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained');
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          setCameraReady(true);
          // Start face detection when camera is ready
          if (faceDetectionReady) {
            startDetection();
          }
        };
        videoRef.current.oncanplay = () => {
          console.log('Video can play');
          videoRef.current?.play();
        };
      }
      setError(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions and try again.');
      setCameraReady(false);
    }
  }, [faceDetectionReady, startDetection]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Camera track stopped');
      });
      setStream(null);
      setCameraReady(false);
    }
    stopDetection();
  }, [stream, stopDetection]);

  // Start face detection when both camera and face detection are ready
  useEffect(() => {
    if (cameraReady && faceDetectionReady && !faceDetections.length) {
      startDetection();
    }
  }, [cameraReady, faceDetectionReady, startDetection, faceDetections.length]);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) {
      console.log('Cannot capture - camera not ready');
      return;
    }

    setIsCapturing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw filter overlay if selected and overlay canvas exists
    if (selectedFilter && overlayCanvasRef.current) {
      ctx.drawImage(overlayCanvasRef.current, 0, 0);
    }

    const imageData = canvas.toDataURL('image/png', 0.9);
    setCapturedImage(imageData);
    setIsCapturing(false);
    console.log('Image captured successfully with face detection data');
  }, [selectedFilter, cameraReady]);

  const downloadImage = useCallback(() => {
    if (!capturedImage) return;

    const link = document.createElement('a');
    link.download = `shiva-filter-${selectedFilter?.name || 'photo'}-${Date.now()}.png`;
    link.href = capturedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('Image downloaded');
  }, [capturedImage, selectedFilter]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            🕉️ Shiva Camera Filters
          </h1>
          <p className="text-purple-200">
            Apply divine filters with AI face detection
          </p>
          {faceDetectionReady && (
            <p className="text-green-200 text-sm mt-1">
              ✨ Face Detection Active ({faceDetections.length} face{faceDetections.length !== 1 ? 's' : ''} detected)
            </p>
          )}
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
            {(!cameraReady || !faceDetectionReady) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p>
                    {!cameraReady ? 'Initializing camera...' : 'Loading face detection...'}
                  </p>
                </div>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ 
                display: cameraReady ? 'block' : 'none',
                transform: 'scaleX(-1)' // Mirror the video for selfie mode
              }}
            />
            <canvas
              ref={overlayCanvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ 
                display: cameraReady && selectedFilter ? 'block' : 'none',
                transform: 'scaleX(-1)' // Mirror the overlay to match video
              }}
            />
            
            {/* Face detection visualization (optional debug) */}
            {faceDetections.length > 0 && process.env.NODE_ENV === 'development' && (
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {faceDetections.map((face, index) => (
                  <div
                    key={index}
                    className="absolute border-2 border-green-400 opacity-50"
                    style={{
                      left: `${(1 - face.boundingBox.originX - face.boundingBox.width) * 100}%`,
                      top: `${face.boundingBox.originY * 100}%`,
                      width: `${face.boundingBox.width * 100}%`,
                      height: `${face.boundingBox.height * 100}%`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          
          {selectedFilter && cameraReady && (
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-full text-sm backdrop-blur-sm">
              ✨ {selectedFilter.name}
              {faceDetectionReady && faceDetections.length > 0 && (
                <span className="ml-2 text-green-300">👤</span>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Filter Renderer */}
        <EnhancedFilterRenderer
          videoRef={videoRef}
          canvasRef={overlayCanvasRef}
          selectedFilter={selectedFilter}
          filterImages={filterImages}
          faceDetections={faceDetections}
          cameraReady={cameraReady && faceDetectionReady}
        />

        {/* Filter Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                setSelectedFilter(filter);
                console.log(`Selected filter: ${filter.name}`);
              }}
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
              onClick={() => {
                setSelectedFilter(null);
                console.log('Filter cleared');
              }}
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
          disabled={isCapturing || !cameraReady}
          size="lg"
          className={`bg-white text-black hover:bg-gray-100 rounded-full w-16 h-16 shadow-lg border-4 border-white/20 transition-all duration-200 ${
            isCapturing ? 'scale-95' : 'hover:scale-110'
          } ${!cameraReady ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Camera className={`w-8 h-8 ${isCapturing ? 'animate-pulse' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default CameraFilters;
