
import React, { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { supabase } from '@/integrations/supabase/client';
import { calculateDistance, formatDistance, getCurrentLocation } from '@/utils/locationUtils';
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

const GOOGLE_MAPS_API_KEY = 'AIzaSyD_mb8buvy9T3u4xpzF1caN1U4VFPQqNEY';

const FacilityMap: React.FC<FacilityMapProps> = ({ facilityType, className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const linesRef = useRef<google.maps.Polyline[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
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

  useEffect(() => {
    if (userLocation && facilities.length > 0) {
      initializeMap();
    }
  }, [userLocation, facilities]);

  const fetchFacilities = async () => {
    try {
      console.log('🔍 Fetching facilities for map, type:', facilityType);
      
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
    console.log('🎯 Requesting user location for map...');
    setLocationLoading(true);
    setError(null);
    
    try {
      const location = await getCurrentLocation();
      console.log('✅ User location obtained for map:', location);
      setUserLocation(location);
    } catch (error: any) {
      console.error('❌ Error getting user location for map:', error);
      setError('Unable to get your location. Please enable location access.');
    } finally {
      setLocationLoading(false);
    }
  };

  const calculateDistancesAndSort = () => {
    if (!userLocation) return;

    console.log('🧮 Calculating distances for map display...');
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
    console.log('✅ Facilities sorted by distance for map:', sorted.length);
    setFacilities(sorted);
  };

  const initializeMap = async () => {
    if (!mapRef.current || !userLocation || facilities.length === 0) return;

    setMapLoading(true);
    try {
      console.log('🗺️ Initializing Google Maps...');
      
      const loader = new Loader({
        apiKey: GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['geometry']
      });

      await loader.load();

      // Clear existing markers and lines
      clearMapElements();

      // Initialize map centered on user location
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: userLocation.latitude, lng: userLocation.longitude },
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      googleMapRef.current = map;

      // Create info window
      infoWindowRef.current = new google.maps.InfoWindow();

      // Add user location marker
      const userMarker = new google.maps.Marker({
        position: { lat: userLocation.latitude, lng: userLocation.longitude },
        map: map,
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#4285F4" stroke="#FFFFFF" stroke-width="3"/>
              <circle cx="16" cy="16" r="4" fill="#FFFFFF"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        }
      });

      markersRef.current.push(userMarker);

      // Add facility markers and lines
      facilities.forEach((facility, index) => {
        const facilityMarker = new google.maps.Marker({
          position: { lat: facility.latitude, lng: facility.longitude },
          map: map,
          title: facility.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="10" fill="${index === 0 ? '#10B981' : '#EF4444'}" stroke="#FFFFFF" stroke-width="2"/>
                <text x="14" y="18" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="bold">${index + 1}</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(28, 28),
            anchor: new google.maps.Point(14, 14)
          }
        });

        // Add click listener for facility markers
        facilityMarker.addListener('click', () => {
          const content = `
            <div style="max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937;">${facility.name}</h3>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                <strong>📍 Location:</strong> ${facility.location_name || 'Not specified'}
              </p>
              <p style="margin: 4px 0; color: #10b981; font-size: 14px; font-weight: 600;">
                <strong>📏 Distance:</strong> ${formatDistance(facility.distance!)}
              </p>
              ${facility.contact_number ? `
                <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                  <strong>📞 Contact:</strong> ${facility.contact_number}
                </p>
              ` : ''}
              <div style="margin-top: 12px;">
                ${facility.contact_number ? `
                  <button onclick="window.open('tel:${facility.contact_number}', '_self')" 
                          style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; margin-right: 8px; cursor: pointer;">
                    📞 Call
                  </button>
                ` : ''}
                ${facility.google_maps_link ? `
                  <button onclick="window.open('${facility.google_maps_link}', '_blank')" 
                          style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
                    🧭 Navigate
                  </button>
                ` : ''}
              </div>
            </div>
          `;
          
          infoWindowRef.current?.setContent(content);
          infoWindowRef.current?.open(map, facilityMarker);
        });

        markersRef.current.push(facilityMarker);

        // Draw line from user to facility
        const line = new google.maps.Polyline({
          path: [
            { lat: userLocation.latitude, lng: userLocation.longitude },
            { lat: facility.latitude, lng: facility.longitude }
          ],
          geodesic: true,
          strokeColor: index === 0 ? '#10B981' : '#EF4444',
          strokeOpacity: 0.6,
          strokeWeight: index === 0 ? 3 : 2,
        });

        line.setMap(map);
        linesRef.current.push(line);
      });

      // Adjust map bounds to show all markers
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: userLocation.latitude, lng: userLocation.longitude });
      facilities.forEach(facility => {
        bounds.extend({ lat: facility.latitude, lng: facility.longitude });
      });
      map.fitBounds(bounds);

      console.log('✅ Google Maps initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing map:', error);
      setError('Failed to load map');
    } finally {
      setMapLoading(false);
    }
  };

  const clearMapElements = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    linesRef.current.forEach(line => line.setMap(null));
    markersRef.current = [];
    linesRef.current = [];
    infoWindowRef.current?.close();
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
                  ? 'Location access required to show distances and map'
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

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span>Facility Locations Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div 
              ref={mapRef} 
              className="w-full h-96 rounded-lg bg-gray-100"
              style={{ minHeight: '400px' }}
            />
            {mapLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
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
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(facility.google_maps_link, '_blank')}
                      >
                        🧭
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
