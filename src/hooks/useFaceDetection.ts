
import { useRef, useCallback, useEffect, useState } from 'react';
import { FaceDetection } from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';

export interface FaceDetectionResult {
  boundingBox: {
    originX: number;
    originY: number;
    width: number;
    height: number;
  };
  keypoints: Array<{
    x: number;
    y: number;
    label: string;
  }>;
}

export const useFaceDetection = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [faceDetections, setFaceDetections] = useState<FaceDetectionResult[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const faceDetectionRef = useRef<FaceDetection | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  const initializeFaceDetection = useCallback(async () => {
    try {
      console.log('Initializing MediaPipe face detection...');
      
      const faceDetection = new FaceDetection({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
        }
      });

      faceDetection.setOptions({
        model: 'short',
        minDetectionConfidence: 0.5,
      });

      faceDetection.onResults((results) => {
        if (results.detections && results.detections.length > 0) {
          const detections = results.detections.map(detection => ({
            boundingBox: {
              originX: detection.boundingBox.xCenter - detection.boundingBox.width / 2,
              originY: detection.boundingBox.yCenter - detection.boundingBox.height / 2,
              width: detection.boundingBox.width,
              height: detection.boundingBox.height,
            },
            keypoints: detection.landmarks?.map((landmark, index) => ({
              x: landmark.x,
              y: landmark.y,
              label: `point_${index}`,
            })) || [],
          }));
          setFaceDetections(detections);
        } else {
          setFaceDetections([]);
        }
      });

      faceDetectionRef.current = faceDetection;
      setIsInitialized(true);
      console.log('Face detection initialized successfully');
    } catch (error) {
      console.error('Error initializing face detection:', error);
    }
  }, []);

  const startDetection = useCallback(() => {
    if (!videoRef.current || !faceDetectionRef.current || !isInitialized) {
      console.log('Cannot start detection - not ready');
      return;
    }

    try {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (faceDetectionRef.current && videoRef.current) {
            await faceDetectionRef.current.send({ image: videoRef.current });
          }
        },
        width: 1280,
        height: 720
      });

      camera.start();
      cameraRef.current = camera;
      console.log('Face detection started');
    } catch (error) {
      console.error('Error starting face detection:', error);
    }
  }, [videoRef, isInitialized]);

  const stopDetection = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
  }, []);

  useEffect(() => {
    initializeFaceDetection();
    
    return () => {
      stopDetection();
    };
  }, [initializeFaceDetection, stopDetection]);

  return {
    faceDetections,
    isInitialized,
    startDetection,
    stopDetection,
  };
};
