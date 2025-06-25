
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Upload, X } from "lucide-react";
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
      onPhotoSelected(file);
    }
    // Reset the input
    e.target.value = '';
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label>{label} {required && '*'}</Label>
      
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        required={required}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept={accept}
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleCameraCapture}
          className="flex-1 flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Take Photo
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleFileUpload}
          className="flex-1 flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload File
        </Button>
      </div>

      {/* Preview */}
      {preview && (
        <div className="mt-2">
          <Label>Photo Preview</Label>
          <div className="mt-2 border rounded-lg p-2 relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-32 object-cover rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraUpload;
