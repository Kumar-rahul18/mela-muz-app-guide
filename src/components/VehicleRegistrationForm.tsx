
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import CameraUpload from "@/components/CameraUpload";

const VehicleRegistrationForm = () => {
  const [formData, setFormData] = useState({
    owner_name: '',
    phone_number: '',
    parking_location: '',
  });
  const [vehiclePhoto, setVehiclePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registeredVehicle, setRegisteredVehicle] = useState<string | null>(null);

  const parkingOptions = [
    { value: 'parking-1', label: 'Parking 1' },
    { value: 'parking-2', label: 'Parking 2' },
    { value: 'parking-3', label: 'Parking 3' },
    { value: 'parking-4', label: 'Parking 4' },
    { value: 'parking-5', label: 'Parking 5' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('Input changed:', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParkingLocationChange = (value: string) => {
    console.log('Parking location changed:', value);
    setFormData(prev => ({
      ...prev,
      parking_location: value
    }));
  };

  const handlePhotoSelected = (file: File) => {
    console.log('Photo selected:', file.name, file.size);
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
      
      console.log('Uploading photo with filename:', fileName);
      
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

      console.log('Photo uploaded successfully:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-photos')
        .getPublicUrl(fileName);

      console.log('Public URL generated:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error in uploadPhoto:', error);
      throw new Error(`Failed to upload photo: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData, 'Photo:', vehiclePhoto);
    
    if (!formData.owner_name || !formData.phone_number || !formData.parking_location || !vehiclePhoto) {
      console.log('Validation failed - missing fields');
      toast.error('Please fill all fields, select parking location, and upload a vehicle photo');
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone_number)) {
      console.log('Validation failed - invalid phone number');
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    console.log('Starting vehicle registration process...');
    setLoading(true);

    try {
      // Generate vehicle ID
      console.log('Calling generate_vehicle_id function...');
      const { data: vehicleIdData, error: vehicleIdError } = await supabase
        .rpc('generate_vehicle_id');

      if (vehicleIdError) {
        console.error('generate_vehicle_id FAILED', vehicleIdError);
        throw new Error(`Failed to generate vehicle ID: ${vehicleIdError.message}`);
      }

      const vehicleId = vehicleIdData;
      console.log('Generated vehicle ID:', vehicleId);

      if (!vehicleId) {
        throw new Error('No vehicle ID returned from function');
      }

      // Upload photo
      console.log('Starting photo upload...');
      const photoUrl = await uploadPhoto(vehiclePhoto, vehicleId);
      console.log('Photo uploaded successfully, URL:', photoUrl);

      // Save vehicle registration
      console.log('Saving vehicle registration to database...');
      const { data: insertData, error: insertError } = await supabase
        .from('vehicle_registrations')
        .insert({
          vehicle_id: vehicleId,
          owner_name: formData.owner_name,
          phone_number: formData.phone_number,
          parking_location: formData.parking_location,
          vehicle_photo_url: photoUrl,
          parking_status: 'parked'
        })
        .select();

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error(`Failed to save vehicle registration: ${insertError.message}`);
      }

      console.log('Vehicle registered successfully:', insertData);
      setRegisteredVehicle(vehicleId);
      toast.success(`Vehicle registered successfully! ID: ${vehicleId}`);
      
      // Reset form
      setFormData({ owner_name: '', phone_number: '', parking_location: '' });
      setVehiclePhoto(null);
      setPhotoPreview(null);

    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to register vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    console.log('Resetting form...');
    setRegisteredVehicle(null);
    setFormData({ owner_name: '', phone_number: '', parking_location: '' });
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

        <div>
          <Label htmlFor="parking_location">Parking Location *</Label>
          <Select value={formData.parking_location} onValueChange={handleParkingLocationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select parking location" />
            </SelectTrigger>
            <SelectContent>
              {parkingOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CameraUpload
          label="Vehicle Photo"
          onPhotoSelected={handlePhotoSelected}
          preview={photoPreview}
          required
        />
      </div>

      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full"
      >
        {loading ? 'Registering...' : 'Register Vehicle'}
      </Button>
    </form>
  );
};

export default VehicleRegistrationForm;
