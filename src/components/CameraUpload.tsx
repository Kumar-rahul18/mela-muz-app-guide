
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Upload, X, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface CameraUploadProps {
  label: string;
  onPhotoSelected: (file: File) => void;
  preview?: string | null;
  required?: boolean;
  accept?: string;
}

const CameraUpload: React.FC<CameraUploadProps> = ({
  label,
  onPhotoSelected,
  preview,
  required = false,
  accept = "image/*"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file size (15MB limit)
    const maxSize = 15 * 1024 * 1024; // 15MB in bytes
    if (file.size > maxSize) {
      toast.error('File size must be less than 15MB');
      return false;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
      onPhotoSelected(file);
      toast.success('Photo selected successfully!');
    }
    // Reset the input to allow selecting the same file again
    e.target.value = '';
  };

  const handleCameraCapture = () => {
    console.log('Opening camera...');
    cameraInputRef.current?.click();
  };

  const handleFileUpload = () => {
    console.log('Opening file picker...');
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label} {required && <span className="text-red-500">*</span>}</Label>
      
      {/* Standard file input for gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {/* Camera input with capture attribute */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload options */}
      <div className="space-y-2">
        {/* Camera button */}
        <Button
          type="button"
          onClick={handleCameraCapture}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg font-medium text-lg"
        >
          <Camera className="h-6 w-6" />
          Take Photo with Camera
        </Button>
        
        {/* File upload button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleFileUpload}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-lg font-medium border-2 border-gray-300 text-lg"
        >
          <Upload className="h-6 w-6" />
          Choose from Gallery
        </Button>
      </div>

      {/* Preview section */}
      {preview && (
        <div className="mt-3">
          <Label className="text-sm font-medium text-gray-700">Photo Preview</Label>
          <div className="mt-2 border-2 border-gray-200 rounded-lg p-2 relative bg-gray-50">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-md"
            />
            <div className="absolute top-3 right-3">
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                ✓ Ready
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraUpload;
