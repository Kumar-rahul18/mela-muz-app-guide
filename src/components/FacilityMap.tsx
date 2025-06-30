
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, RefreshCw } from 'lucide-react';

interface Facility {
  id: string;
  facility_type: string;
  name: string;
  contact_number: string;
  location_name: string;
  google_maps_link: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

interface FacilityMapProps {
  facilityType?: string;
  className?: string;
}

const FacilityMap: React.FC<FacilityMapProps> = ({ facilityType, className = '' }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFacilities();
    requestUserLocation();
  }, [facilityType]);

  useEffect(() => {
    if (userLocation && facilities.length > 0) {
      calculateDistancesAndSort();
    }
  }, [userLocation, facilities.length]);

  const fetchFacilities = async () => {
    try {
      console.log('🔍 Fetching facilities for list, type:', facilityType);
      
      let query = supabase
        .from('facilities')
        .select('*')
        .eq('is_active', true)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (facilityType) {
        query = query.eq('facility_type', facilityType);
      }

      const { data, error } = await query.order('name');

      if (error) {
        console.error('❌ Error fetching facilities:', error);
        setError('Failed to fetch facilities');
        return;
      }

      console.log('✅ Fetched facilities with coordinates:', data?.length);
      setFacilities(data || []);
    } catch (error) {
      console.error('❌ Error fetching facilities:', error);
      setError('Failed to fetch facilities');
    } finally {
      setLoading(false);
    }
  };

  const requestUserLocation = async () => {
    console.log('🎯 Requesting user location...');
    setLocationLoading(true);
    setError(null);
    
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      // Request location with Android WebView compatible options
      const location = await new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
        const options = {
          enableHighAccuracy: false, // Set to false for better WebView compatibility
          timeout: 60000, // Increased timeout for WebView
          maximumAge: 600000 // 10 minutes cache for WebView
        };

        console.log('📍 Requesting geolocation with WebView-compatible options:', options);
        
        // Try with high accuracy first, then fallback
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            console.log('✅ Location obtained:', coords);
            resolve(coords);
          },
          (error) => {
            console.error('❌ First geolocation attempt failed:', error);
            
            // Fallback with less accurate but more compatible options
            const fallbackOptions = {
              enableHighAccuracy: false,
              timeout: 30000,
              maximumAge: 900000 // 15 minutes cache
            };
            
            console.log('📍 Trying fallback geolocation options:', fallbackOptions);
            
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const coords = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                };
                console.log('✅ Fallback location obtained:', coords);
                resolve(coords);
              },
              (fallbackError) => {
                console.error('❌ Fallback geolocation error:', fallbackError);
                let errorMessage = 'Unable to get your location';
                
                switch (fallbackError.code) {
                  case fallbackError.PERMISSION_DENIED:
                    errorMessage = 'Location access denied. Please check app permissions in device settings.';
                    break;
                  case fallbackError.POSITION_UNAVAILABLE:
                    errorMessage = 'Location service unavailable. Please enable GPS and try again.';
                    break;
                  case fallbackError.TIMEOUT:
                    errorMessage = 'Location request timeout. Please check your connection and try again.';
                    break;
                  default:
                    errorMessage = 'Location access failed. Please ensure location services are enabled.';
                    break;
                }
                
                reject(new Error(errorMessage));
              },
              fallbackOptions
            );
          },
          options
        );
      });

      console.log('✅ User location obtained:', location);
      setUserLocation(location);
    } catch (error: any) {
      console.error('❌ Error getting user location:', error);
      setError(error.message || 'Unable to get your location. Please enable location services.');
    } finally {
      setLocationLoading(false);
    }
  };

  const calculateDistancesAndSort = () => {
    if (!userLocation) return;

    console.log('🧮 Calculating distances for sorting...');
    const facilitiesWithDistance = facilities.map(facility => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        facility.latitude,
        facility.longitude
      );
      return { ...facility, distance };
    });

    const sorted = facilitiesWithDistance.sort((a, b) => a.distance! - b.distance!);
    console.log('✅ Facilities sorted by distance:', sorted.length);
    setFacilities(sorted);
  };

  const handleRefresh = () => {
    fetchFacilities();
    requestUserLocation();
  };

  if (loading || locationLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
          <p className="text-gray-600">
            {locationLoading ? 'Getting your location...' : 'Loading facilities...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 ${className}`}>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userLocation || facilities.length === 0) {
    return (
      <div className={`p-4 ${className}`}>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">
                {!userLocation 
                  ? 'Location access required to show distances'
                  : 'No facilities found with location data'
                }
              </p>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Location Status */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">
                📍 Location found • Showing {facilities.length} facilities
              </span>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Facilities List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Facilities by Distance</span>
            <Badge variant="secondary">{facilities.length} found</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {facilities.map((facility, index) => (
              <div key={facility.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg font-semibold text-gray-800">{facility.name}</span>
                    {index === 0 && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        🎯 Nearest
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{facility.location_name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-blue-50">
                    📏 {formatDistance(facility.distance!)}
                  </Badge>
                  <div className="flex space-x-1">
                    {facility.contact_number && (
                      <Button 
                        size="sm" 
                        onClick={() => window.open(`tel:${facility.contact_number}`, '_self')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        📞
                      </Button>
                    )}
                    {facility.google_maps_link && (
                      // <Button 
                      //   size="sm" 
                      //   variant="outline"
                      //   onClick={() => window.open(facility.google_maps_link, '_blank')}
                      // >
                      //   Go
                      // </Button>
                <Button 
                  size="sm"
                  className="bg-green-800 text-white hover:bg-green-900"
                  onClick={() => window.open(facility.google_maps_link, '_blank')}
                >
                  Go
                </Button>

                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilityMap;
