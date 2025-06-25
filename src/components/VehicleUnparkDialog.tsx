
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
  const [unparkerPhoto, setUnparkerPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoSelected = (file: File) => {
    setUnparkerPhoto(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `unparker-${vehicle.vehicle_id}-${Date.now()}.${fileExt}`;
    
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
    
    if (!unparkerPhone || !unparkerPhoto) {
      toast.error('Please provide phone number and photo');
      return;
    }

    if (!/^[0-9]{10}$/.test(unparkerPhone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      // Upload unparker photo
      const photoUrl = await uploadPhoto(unparkerPhoto);

      // Create unparking record
      const { error: unparkError } = await supabase
        .from('vehicle_unparking_records')
        .insert({
          vehicle_registration_id: vehicle.id,
          unparker_phone: unparkerPhone,
          unparker_photo_url: photoUrl,
        });

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
    setUnparkerPhoto(null);
    setPhotoPreview(null);
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
            label="Photo of Person Taking Vehicle"
            onPhotoSelected={handlePhotoSelected}
            preview={photoPreview}
            required
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
