import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, RefreshCw, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [locationTimeout, setLocationTimeout] = useState(false);
  const { toast } = useToast();

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
    setLocationTimeout(false);
    
    // Set up timeout for location request
    const timeoutId = setTimeout(() => {
      console.log('⏰ Location request timed out after 10 seconds');
      setLocationTimeout(true);
      setLocationLoading(false);
      setError('Turn on your location/internet and try again');
      toast({
        title: "Location Timeout",
        description: "Please turn on your location/internet and try again",
        variant: "destructive",
      });
    }, 10000); // 10 seconds timeout
    
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        clearTimeout(timeoutId);
        throw new Error('Geolocation is not supported by this browser');
      }

      // Request location with Android WebView compatible options
      const location = await new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
        const options = {
          enableHighAccuracy: false, // Set to false for better WebView compatibility
          timeout: 9000, // Slightly less than our custom timeout
          maximumAge: 600000 // 10 minutes cache for WebView
        };

        console.log('📍 Requesting geolocation with WebView-compatible options:', options);
        
        // Try with high accuracy first, then fallback
        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeoutId);
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
              timeout: 5000,
              maximumAge: 900000 // 15 minutes cache
            };
            
            console.log('📍 Trying fallback geolocation options:', fallbackOptions);
            
            navigator.geolocation.getCurrentPosition(
              (position) => {
                clearTimeout(timeoutId);
                const coords = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                };
                console.log('✅ Fallback location obtained:', coords);
                resolve(coords);
              },
              (fallbackError) => {
                clearTimeout(timeoutId);
                console.error('❌ Fallback geolocation error:', fallbackError);
                let errorMessage = 'Turn on your location/internet and try again';
                
                switch (fallbackError.code) {
                  case fallbackError.PERMISSION_DENIED:
                    errorMessage = 'Location access denied. Please check app permissions in device settings.';
                    break;
                  case fallbackError.POSITION_UNAVAILABLE:
                    errorMessage = 'Turn on your location/internet and try again';
                    break;
                  case fallbackError.TIMEOUT:
                    errorMessage = 'Turn on your location/internet and try again';
                    break;
                  default:
                    errorMessage = 'Turn on your location/internet and try again';
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
      setLocationTimeout(false);
    } catch (error: any) {
      console.error('❌ Error getting user location:', error);
      if (!locationTimeout) {
        setError(error.message || 'Turn on your location/internet and try again');
      }
    } finally {
      if (!locationTimeout) {
        setLocationLoading(false);
      }
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
    setLocationTimeout(false);
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
          {locationLoading && (
            <p className="text-sm text-gray-500 mt-2">
              This may take up to 10 seconds
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error || locationTimeout) {
    return (
      <div className={`p-4 ${className}`}>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Wifi className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-4 font-medium">
                {locationTimeout || error?.includes('location/internet') 
                  ? 'Turn on your location/internet' 
                  : error
                }
              </p>
              <p className="text-sm text-red-500 mb-4">
                Make sure location services and internet connection are enabled
              </p>
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
