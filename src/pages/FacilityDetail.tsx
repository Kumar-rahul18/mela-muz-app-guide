
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface Facility {
  id: string;
  facility_type: string;
  name: string;
  contact_number: string;
  location_name: string;
  google_maps_link: string;
  is_active: boolean;
}

const FacilityDetail = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

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
    }
  }, [type]);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('facility_type', type)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching facilities:', error);
        return;
      }

      setFacilities(data || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

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
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading facilities...</div>
          </div>
        ) : facilities.length > 0 ? (
          <div className="space-y-4">
            {facilities.map((facility) => (
              <Card key={facility.id} className="shadow-sm border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {facility.name}
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
