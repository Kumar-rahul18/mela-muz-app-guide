
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, User, Phone, Car, Camera, CheckCircle, MapPin } from "lucide-react";
import VehicleUnparkDialog from "@/components/VehicleUnparkDialog";

interface Vehicle {
  id: string;
  vehicle_id: string;
  owner_name: string;
  phone_number: string;
  vehicle_photo_url: string;
  parking_status: string;
  parking_location: string;
  created_at: string;
}

const VehicleSearch = () => {
  const [searchId, setSearchId] = useState('');
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUnparkDialog, setShowUnparkDialog] = useState(false);

  const getParkingLocationLabel = (location: string) => {
    const parkingMap: { [key: string]: string } = {
      'parking-1': 'Parking 1',
      'parking-2': 'Parking 2',
      'parking-3': 'Parking 3',
      'parking-4': 'Parking 4',
      'parking-5': 'Parking 5',
    };
    return parkingMap[location] || location;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchId.trim()) {
      toast.error('Please enter a vehicle ID');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('vehicle_registrations')
        .select('*')
        .eq('vehicle_id', searchId.toUpperCase())
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        toast.error('Vehicle not found');
        setVehicle(null);
        return;
      }

      setVehicle(data);
      toast.success('Vehicle found!');

    } catch (error) {
      console.error('Error searching vehicle:', error);
      toast.error('Failed to search vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnparkSuccess = () => {
    if (vehicle) {
      setVehicle({
        ...vehicle,
        parking_status: 'unparked'
      });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <Label htmlFor="search_id">Vehicle ID</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="search_id"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter vehicle ID (e.g., MUZ12345)"
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>
      </form>

      {vehicle && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded">
                    <Car className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vehicle ID</p>
                    <p className="font-mono font-bold text-lg">{vehicle.vehicle_id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-2 rounded">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Owner Name</p>
                    <p className="font-semibold">{vehicle.owner_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 p-2 rounded">
                    <Phone className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-semibold">{vehicle.phone_number}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-yellow-100 p-2 rounded">
                    <MapPin className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Parking Location</p>
                    <p className="font-semibold">{getParkingLocationLabel(vehicle.parking_location)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded ${
                    vehicle.parking_status === 'parked' 
                      ? 'bg-orange-100' 
                      : 'bg-red-100'
                  }`}>
                    <CheckCircle className={`h-4 w-4 ${
                      vehicle.parking_status === 'parked' 
                        ? 'text-orange-600' 
                        : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Parking Status</p>
                    <p className={`font-semibold capitalize ${
                      vehicle.parking_status === 'parked' 
                        ? 'text-orange-600' 
                        : 'text-red-600'
                    }`}>
                      {vehicle.parking_status}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="h-4 w-4 text-gray-600" />
                  <p className="text-sm text-gray-600">Vehicle Photo</p>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={vehicle.vehicle_photo_url}
                    alt="Vehicle"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </div>

            {vehicle.parking_status === 'parked' && (
              <div className="pt-4 border-t">
                <Button 
                  onClick={() => setShowUnparkDialog(true)}
                  variant="destructive"
                  className="w-full"
                >
                  Mark as Unparked
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {vehicle && showUnparkDialog && (
        <VehicleUnparkDialog
          vehicle={vehicle}
          isOpen={showUnparkDialog}
          onClose={() => setShowUnparkDialog(false)}
          onSuccess={handleUnparkSuccess}
        />
      )}
    </div>
  );
};

export default VehicleSearch;
