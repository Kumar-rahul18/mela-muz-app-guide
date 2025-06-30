
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, ExternalLink, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { calculateDistance, formatDistance, getCurrentLocation } from '@/utils/locationUtils';

interface Facility {
  id: string;
  facility_type: string;
  name: string;
  contact_number: string;
  location_name: string;
  google_maps_link: string;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  distance?: number;
}

const FacilityDetail = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const facilityConfig = {
    'paid-hotels': {
      title: 'Paid Hotels',
      icon: '🏨',
      description: 'Comfortable accommodation options near the mela grounds'
    },
    'atm': {
      title: t('atm'),
      icon: '🏧',
      description: 'ATM and banking facilities for your convenience'
    },
    'parking': {
      title: t('parking'),
      icon: '🅿️',
      description: 'Secure parking facilities for vehicles'
    },
    'bhandara': {
      title: 'Bhandara',
      icon: '🍽️',
      description: 'Free food service and community kitchen'
    },
    'drinking-water': {
      title: t('drinking_water'),
      icon: '🚰',
      description: 'Clean drinking water stations'
    },
    'toilet': {
      title: t('toilet'),
      icon: '🚻',
      description: 'Public toilet facilities'
    },
    'bathroom': {
      title: t('bathroom'),
      icon: '🛁',
      description: 'Bathroom and washing facilities'
    },
    'rest-room': {
      title: t('rest_room'),
      icon: '🛏️',
      description: 'Rest areas and relaxation spaces'
    },
    'dharamshala': {
      title: t('dharamshala'),
      icon: '🏛️',
      description: 'Traditional accommodation facilities'
    },
    'shivir': {
      title: t('shivir'),
      icon: '🏕️',
      description: 'Camp and temporary stay arrangements'
    },
    'health-centre': {
      title: t('health_centre'),
      icon: '🏥',
      description: 'Medical facilities and health services'
    },
    'mela-route': {
      title: t('mela_route'),
      icon: '🗺️',
      description: 'Route information and directions to the mela'
    }
  };

  useEffect(() => {
    if (type) {
      fetchFacilities();
      requestUserLocation();
    }
  }, [type]);

  // Calculate distances for all facilities when user location is obtained
  useEffect(() => {
    if (userLocation && facilities.length > 0) {
      console.log('User location available:', userLocation);
      console.log('Processing facilities for distance calculation:', facilities.length);
      
      const facilitiesWithDistance = facilities.map(facility => {
        console.log(`Processing facility: ${facility.name}`);
        console.log(`Facility coordinates: lat=${facility.latitude}, lng=${facility.longitude}`);
        
        if (facility.latitude && facility.longitude) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            Number(facility.latitude),
            Number(facility.longitude)
          );
          console.log(`✅ Distance calculated for ${facility.name}: ${distance}km`);
          return { ...facility, distance };
        } else {
          console.log(`❌ No coordinates for ${facility.name}`);
          return facility;
        }
      });
      
      console.log('Setting facilities with distances:', facilitiesWithDistance);
      setFacilities(facilitiesWithDistance);
    } else {
      console.log('Cannot calculate distances:', { 
        hasUserLocation: !!userLocation, 
        facilitiesCount: facilities.length 
      });
    }
  }, [userLocation, facilities.length]);

  const requestUserLocation = async () => {
    console.log('🎯 Starting location request...');
    setLocationLoading(true);
    setLocationError(null);
    
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      console.log('📍 Requesting geolocation permission...');
      const location = await getCurrentLocation();
      console.log('✅ Location obtained successfully:', location);
      setUserLocation(location);
    } catch (error: any) {
      console.error('❌ Error getting user location:', error);
      let errorMessage = 'Unable to get your location';
      
      if (error.code === 1) {
        errorMessage = 'Location access denied. Please enable location access in your browser settings.';
      } else if (error.code === 2) {
        errorMessage = 'Location information is unavailable.';
      } else if (error.code === 3) {
        errorMessage = 'Location request timeout.';
      }
      
      setLocationError(errorMessage);
    } finally {
      setLocationLoading(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching facilities for type:', type);
      
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('facility_type', type)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('❌ Error fetching facilities:', error);
        return;
      }

      console.log('✅ Fetched facilities:', data?.length);
      console.log('Facilities with coordinates:', data?.filter(f => f.latitude && f.longitude).length);
      
      // Log each facility's coordinates for debugging
      data?.forEach(facility => {
        console.log(`📍 ${facility.name}: lat=${facility.latitude}, lng=${facility.longitude}`);
      });
      
      setFacilities(data || []);
    } catch (error) {
      console.error('❌ Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sort facilities by distance (facilities with distance first, then alphabetically)
  const sortedFacilities = React.useMemo(() => {
    if (!facilities.length) {
      return facilities;
    }

    const sorted = [...facilities].sort((a, b) => {
      // Both have distances - sort by distance (nearest first)
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      // Only a has distance - a comes first
      if (a.distance !== undefined && b.distance === undefined) {
        return -1;
      }
      // Only b has distance - b comes first
      if (a.distance === undefined && b.distance !== undefined) {
        return 1;
      }
      // Neither has distance - sort alphabetically
      return a.name.localeCompare(b.name);
    });

    console.log('🎯 Final sorted facilities by distance:', sorted.map(f => ({ 
      name: f.name, 
      distance: f.distance ? `${f.distance}km` : 'No distance',
      hasCoordinates: !!(f.latitude && f.longitude),
      lat: f.latitude,
      lng: f.longitude
    })));
    
    return sorted;
  }, [facilities]);

  const handleMapClick = (mapsLink: string) => {
    if (mapsLink) {
      window.open(mapsLink, '_blank');
    }
  };

  const handleCallClick = (phoneNumber: string) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    }
  };

  const config = facilityConfig[type as keyof typeof facilityConfig];

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Facility Not Found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const facilitiesWithDistance = sortedFacilities.filter(f => f.distance !== undefined);
  const facilitiesWithoutDistance = sortedFacilities.filter(f => f.distance === undefined);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-gradient text-white px-4 py-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/')} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{config.icon}</span>
            <h1 className="text-lg font-semibold">{config.title}</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="mb-6">
          <p className="text-gray-600 text-sm">{config.description}</p>
          
          {/* Location Status */}
          <div className="mt-3 flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-blue-500" />
            {locationLoading ? (
              <span className="text-sm text-gray-500">Getting your location...</span>
            ) : userLocation ? (
              <span className="text-sm text-green-600">
                📍 Location found • Showing distances for {facilitiesWithDistance.length} of {sortedFacilities.length} facilities
              </span>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-orange-600">
                  {locationError || 'Location not available'}
                </span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={requestUserLocation}
                  className="text-xs px-2 py-1 h-6"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading facilities...</div>
          </div>
        ) : sortedFacilities.length > 0 ? (
          <div className="space-y-4">
            {/* Show facilities with distance first */}
            {facilitiesWithDistance.length > 0 && (
              <>
                <div className="text-sm font-medium text-green-600 mb-2">
                  📍 Nearby Facilities ({facilitiesWithDistance.length})
                </div>
                {facilitiesWithDistance.map((facility, index) => (
                  <Card key={facility.id} className="shadow-sm border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                        <span>{facility.name}</span>
                        <div className="flex items-center space-x-2">
                          {index === 0 && (
                            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                              🎯 Nearest
                            </Badge>
                          )}
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                            📏 {formatDistance(facility.distance!)}
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {facility.location_name && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm">{facility.location_name}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        {facility.contact_number && (
                          <Button 
                            onClick={() => handleCallClick(facility.contact_number)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                        )}
                        
                        {facility.google_maps_link && (
                          <Button 
                            onClick={() => handleMapClick(facility.google_maps_link)}
                            size="sm"
                            variant="outline"
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Navigate
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {/* Show facilities without distance */}
            {facilitiesWithoutDistance.length > 0 && (
              <>
                {facilitiesWithDistance.length > 0 && (
                  <div className="text-sm font-medium text-gray-500 mb-2 mt-6">
                    📍 Other Facilities ({facilitiesWithoutDistance.length})
                  </div>
                )}
                {facilitiesWithoutDistance.map((facility) => (
                  <Card key={facility.id} className="shadow-sm border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                        <span>{facility.name}</span>
                        <Badge variant="outline" className="text-gray-500">
                          📍 Location unavailable
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {facility.location_name && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm">{facility.location_name}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        {facility.contact_number && (
                          <Button 
                            onClick={() => handleCallClick(facility.contact_number)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                        )}
                        
                        {facility.google_maps_link && (
                          <Button 
                            onClick={() => handleMapClick(facility.google_maps_link)}
                            size="sm"
                            variant="outline"
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Navigate
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              <span className="text-4xl">{config.icon}</span>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No facilities available</h3>
            <p className="text-gray-600 text-sm mb-4">
              Currently there are no {config.title.toLowerCase()} facilities listed.
            </p>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityDetail;
