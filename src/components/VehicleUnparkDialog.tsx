
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CameraUpload from "@/components/CameraUpload";

interface Vehicle {
  id: string;
  vehicle_id: string;
  owner_name: string;
  phone_number: string;
  vehicle_photo_url: string;
  parking_status: string;
  parking_location: string;
}

interface VehicleUnparkDialogProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const VehicleUnparkDialog: React.FC<VehicleUnparkDialogProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [unparkerPhone, setUnparkerPhone] = useState('');
  const [unparkerPhoto1, setUnparkerPhoto1] = useState<File | null>(null);
  const [unparkerPhoto2, setUnparkerPhoto2] = useState<File | null>(null);
  const [photoPreview1, setPhotoPreview1] = useState<string | null>(null);
  const [photoPreview2, setPhotoPreview2] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePhoto1Selected = (file: File) => {
    setUnparkerPhoto1(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview1(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePhoto2Selected = (file: File) => {
    setUnparkerPhoto2(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview2(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async (file: File, suffix: string = '') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `unparker-${vehicle.vehicle_id}-${Date.now()}${suffix}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('vehicle-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('vehicle-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!unparkerPhone || !unparkerPhoto1) {
      toast.error('Please provide phone number and at least the first photo');
      return;
    }

    if (!/^[0-9]{10}$/.test(unparkerPhone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      // Upload first photo (required)
      const photoUrl1 = await uploadPhoto(unparkerPhoto1, '-1');
      
      // Upload second photo if provided
      let photoUrl2 = null;
      if (unparkerPhoto2) {
        photoUrl2 = await uploadPhoto(unparkerPhoto2, '-2');
      }

      // Create unparking record
      const unparkingData: any = {
        vehicle_registration_id: vehicle.id,
        unparker_phone: unparkerPhone,
        unparker_photo_url: photoUrl1,
      };

      if (photoUrl2) {
        unparkingData.unparker_photo_url_2 = photoUrl2;
      }

      const { error: unparkError } = await supabase
        .from('vehicle_unparking_records')
        .insert(unparkingData);

      if (unparkError) {
        throw unparkError;
      }

      // Update vehicle status
      const { error: updateError } = await supabase
        .from('vehicle_registrations')
        .update({ 
          parking_status: 'unparked',
          updated_at: new Date().toISOString()
        })
        .eq('id', vehicle.id);

      if (updateError) {
        throw updateError;
      }

      toast.success('Vehicle marked as unparked successfully!');
      onSuccess();
      onClose();

    } catch (error) {
      console.error('Error unparking vehicle:', error);
      toast.error('Failed to unpark vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUnparkerPhone('');
    setUnparkerPhoto1(null);
    setUnparkerPhoto2(null);
    setPhotoPreview1(null);
    setPhotoPreview2(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mark Vehicle as Unparked</DialogTitle>
          <DialogDescription>
            Please provide details of the person taking the vehicle.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="unparker_phone">Phone Number of Person Taking Vehicle *</Label>
            <Input
              id="unparker_phone"
              value={unparkerPhone}
              onChange={(e) => setUnparkerPhone(e.target.value)}
              placeholder="10-digit phone number"
              pattern="[0-9]{10}"
              maxLength={10}
              required
            />
          </div>

          <CameraUpload
            label="Photo of Person Taking Vehicle (Required) *"
            onPhotoSelected={handlePhoto1Selected}
            preview={photoPreview1}
            required
          />

          <CameraUpload
            label="Additional Photo (Optional)"
            onPhotoSelected={handlePhoto2Selected}
            preview={photoPreview2}
            required={false}
          />

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} variant="destructive">
              {loading ? 'Processing...' : 'Mark as Unparked'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleUnparkDialog;
