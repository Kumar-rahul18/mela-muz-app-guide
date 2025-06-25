
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import CameraUpload from "@/components/CameraUpload";

const VehicleRegistrationForm = () => {
  const [formData, setFormData] = useState({
    owner_name: '',
    phone_number: '',
  });
  const [vehiclePhoto, setVehiclePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registeredVehicle, setRegisteredVehicle] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoSelected = (file: File) => {
    setVehiclePhoto(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async (file: File, vehicleId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${vehicleId}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('vehicle-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-photos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadPhoto:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.owner_name || !formData.phone_number || !vehiclePhoto) {
      toast.error('Please fill all fields and upload a vehicle photo');
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone_number)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      console.log('Starting vehicle registration...');
      
      // Generate vehicle ID
      const { data: vehicleIdData, error: vehicleIdError } = await supabase
        .rpc('generate_vehicle_id');

      if (vehicleIdError) {
        console.error('Vehicle ID generation error:', vehicleIdError);
        throw vehicleIdError;
      }

      const vehicleId = vehicleIdData;
      console.log('Generated vehicle ID:', vehicleId);

      // Upload photo
      console.log('Uploading photo...');
      const photoUrl = await uploadPhoto(vehiclePhoto, vehicleId);
      console.log('Photo uploaded successfully:', photoUrl);

      // Save vehicle registration
      console.log('Saving vehicle registration...');
      const { error: insertError } = await supabase
        .from('vehicle_registrations')
        .insert({
          vehicle_id: vehicleId,
          owner_name: formData.owner_name,
          phone_number: formData.phone_number,
          vehicle_photo_url: photoUrl,
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      console.log('Vehicle registered successfully!');
      setRegisteredVehicle(vehicleId);
      toast.success(`Vehicle registered successfully! ID: ${vehicleId}`);
      
      // Reset form
      setFormData({ owner_name: '', phone_number: '' });
      setVehiclePhoto(null);
      setPhotoPreview(null);

    } catch (error) {
      console.error('Error registering vehicle:', error);
      toast.error('Failed to register vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRegisteredVehicle(null);
    setFormData({ owner_name: '', phone_number: '' });
    setVehiclePhoto(null);
    setPhotoPreview(null);
  };

  if (registeredVehicle) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <h3 className="text-2xl font-bold text-green-800">Vehicle Registered Successfully!</h3>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-600 mb-2">Vehicle ID</p>
              <p className="text-3xl font-mono font-bold text-blue-600">{registeredVehicle}</p>
            </div>
            <Button onClick={resetForm} className="mt-4">
              Register Another Vehicle
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="owner_name">Owner Name *</Label>
          <Input
            id="owner_name"
            name="owner_name"
            value={formData.owner_name}
            onChange={handleInputChange}
            placeholder="Enter owner's full name"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone_number">Phone Number *</Label>
          <Input
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            placeholder="10-digit phone number"
            pattern="[0-9]{10}"
            maxLength={10}
            required
          />
        </div>

        <CameraUpload
          label="Vehicle Photo"
          onPhotoSelected={handlePhotoSelected}
          preview={photoPreview}
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Registering...' : 'Register Vehicle'}
      </Button>
    </form>
  );
};

export default VehicleRegistrationForm;
