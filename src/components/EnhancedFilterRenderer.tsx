
import React, { useRef, useEffect, useCallback } from 'react';
import { FaceDetectionResult } from '@/hooks/useFaceDetection';

interface Filter {
  id: string;
  name: string;
  overlay: string;
  type: 'face' | 'background' | 'aura' | 'crown';
}

interface EnhancedFilterRendererProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  selectedFilter: Filter | null;
  filterImages: { [key: string]: HTMLImageElement };
  faceDetections: FaceDetectionResult[];
  cameraReady: boolean;
}

const EnhancedFilterRenderer: React.FC<EnhancedFilterRendererProps> = ({
  videoRef,
  canvasRef,
  selectedFilter,
  filterImages,
  faceDetections,
  cameraReady,
}) => {
  const animationFrameRef = useRef<number>();

  const drawEnhancedFilter = useCallback(() => {
    if (!selectedFilter || !videoRef.current || !canvasRef.current || 
        !filterImages[selectedFilter.id] || !cameraReady) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;
    const filterImage = filterImages[selectedFilter.id];

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    // Set canvas size to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get the primary face detection (largest face)
    const primaryFace = faceDetections.length > 0 ? 
      faceDetections.reduce((largest, current) => 
        (current.boundingBox.width * current.boundingBox.height) > 
        (largest.boundingBox.width * largest.boundingBox.height) ? current : largest
      ) : null;

    if (!primaryFace && selectedFilter.type !== 'background') {
      // If no face detected and filter requires face positioning, skip
      return;
    }

    // Save context state
    ctx.save();

    // Apply enhanced filter based on type with face detection
    switch (selectedFilter.type) {
      case 'face':
        if (primaryFace) {
          // Position tilak on forehead using face detection
          const faceX = primaryFace.boundingBox.originX * canvas.width;
          const faceY = primaryFace.boundingBox.originY * canvas.height;
          const faceWidth = primaryFace.boundingBox.width * canvas.width;
          const faceHeight = primaryFace.boundingBox.height * canvas.height;
          
          const tilakSize = faceWidth * 0.3;
          const tilakX = faceX + (faceWidth / 2) - (tilakSize / 2);
          const tilakY = faceY + (faceHeight * 0.15);
          
          // Enhanced blending for tilak
          ctx.globalAlpha = 0.9;
          ctx.globalCompositeOperation = 'multiply';
          ctx.filter = 'contrast(1.2) saturate(1.1)';
          
          ctx.drawImage(filterImage, tilakX, tilakY, tilakSize, tilakSize);
        }
        break;
        
      case 'background':
        // Enhanced background effects
        const bgSize = Math.min(canvas.width, canvas.height) * 0.35;
        ctx.globalAlpha = 0.7;
        ctx.globalCompositeOperation = 'overlay';
        ctx.filter = 'blur(1px) brightness(1.1)';
        
        // Left side with improved positioning
        ctx.drawImage(filterImage, 
          canvas.width * 0.02, 
          canvas.height * 0.15, 
          bgSize, 
          bgSize * 1.3
        );
        
        // Right side (mirrored) with enhanced effects
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(filterImage, 
          -canvas.width * 0.98, 
          canvas.height * 0.15, 
          bgSize, 
          bgSize * 1.3
        );
        ctx.restore();
        break;
        
      case 'aura':
        if (primaryFace) {
          // Dynamic aura positioning based on face
          const faceX = primaryFace.boundingBox.originX * canvas.width;
          const faceY = primaryFace.boundingBox.originY * canvas.height;
          const faceWidth = primaryFace.boundingBox.width * canvas.width;
          const faceHeight = primaryFace.boundingBox.height * canvas.height;
          
          const auraSize = Math.max(faceWidth, faceHeight) * 1.8;
          const auraX = faceX + (faceWidth / 2) - (auraSize / 2);
          const auraY = faceY + (faceHeight / 2) - (auraSize / 2);
          
          // Multi-layer aura effect
          ctx.globalCompositeOperation = 'screen';
          
          // Outer aura (more transparent, larger)
          ctx.globalAlpha = 0.3;
          ctx.filter = 'blur(8px) brightness(1.3)';
          ctx.drawImage(filterImage, auraX - 20, auraY - 20, auraSize + 40, auraSize + 40);
          
          // Inner aura (more opaque, smaller)
          ctx.globalAlpha = 0.5;
          ctx.filter = 'blur(3px) brightness(1.1)';
          ctx.drawImage(filterImage, auraX, auraY, auraSize, auraSize);
        }
        break;
        
      case 'crown':
        if (primaryFace) {
          // Dynamic crown positioning
          const faceX = primaryFace.boundingBox.originX * canvas.width;
          const faceY = primaryFace.boundingBox.originY * canvas.height;
          const faceWidth = primaryFace.boundingBox.width * canvas.width;
          
          const crownWidth = faceWidth * 0.8;
          const crownHeight = crownWidth * 0.9;
          const crownX = faceX + (faceWidth / 2) - (crownWidth / 2);
          const crownY = faceY - (crownHeight * 0.3);
          
          // Enhanced crown rendering with shadow
          ctx.globalAlpha = 0.1;
          ctx.globalCompositeOperation = 'multiply';
          ctx.filter = 'blur(2px)';
          // Shadow
          ctx.drawImage(filterImage, crownX + 5, crownY + 5, crownWidth, crownHeight);
          
          // Main crown
          ctx.globalAlpha = 0.8;
          ctx.globalCompositeOperation = 'normal';
          ctx.filter = 'contrast(1.1) saturate(1.2)';
          ctx.drawImage(filterImage, crownX, crownY, crownWidth, crownHeight);
        }
        break;
    }
    
    // Restore context state
    ctx.restore();
    ctx.filter = 'none';
  }, [selectedFilter, filterImages, faceDetections, cameraReady, videoRef, canvasRef]);

  // Continuous filter rendering
  const renderLoop = useCallback(() => {
    drawEnhancedFilter();
    animationFrameRef.current = requestAnimationFrame(renderLoop);
  }, [drawEnhancedFilter]);

  useEffect(() => {
    if (selectedFilter && cameraReady) {
      renderLoop();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedFilter, cameraReady, renderLoop]);

  return null; // This component only handles rendering logic
};

export default EnhancedFilterRenderer;
