
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface Facility {
  id: string;
  facility_type: string;
  name: string;
  contact_number: string;
  location_name: string;
  google_maps_link: string;
  is_active: boolean;
}

const FacilityRoute = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const { t } = useLanguage();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, [type]);

  const fetchFacilities = async () => {
    try {
      let query = supabase
        .from('facilities')
        .select('*')
        .eq('is_active', true);

      if (type && type !== 'route') {
        query = query.eq('facility_type', type);
      }

      const { data, error } = await query.order('name');

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

  const getFacilityIcon = (facilityType: string) => {
    const icons: { [key: string]: string } = {
      'drinking-water': '🚰',
      'toilet': '🚻',
      'bathroom': '🛁',
      'rest-room': '🛏️',
      'dharamshala': '🏛️',
      'shivir': '🏕️',
      'health-centre': '🏥',
      'parking': '🅿️'
    };
    return icons[facilityType] || '🏢';
  };

  const getFacilityName = (facilityType: string) => {
    const names: { [key: string]: string } = {
      'drinking-water': t('drinking_water'),
      'toilet': t('toilet'),
      'bathroom': t('bathroom'),
      'rest-room': t('rest_room'),
      'dharamshala': t('dharamshala'),
      'shivir': t('shivir'),
      'health-centre': t('health_centre'),
      'parking': t('parking')
    };
    return names[facilityType] || facilityType;
  };

  const handleNavigation = (googleMapsLink: string) => {
    if (googleMapsLink) {
      window.open(googleMapsLink, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading facilities...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="app-gradient text-white px-4 py-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/')} 
            className="text-white font-bold text-xl bg-white/20 rounded-lg px-3 py-1 hover:bg-white/30 transition-colors"
          >
            ← 
          </button>
          <h1 className="text-lg font-semibold">
            {type && type !== 'route' ? getFacilityName(type) : t('facilities')}
          </h1>
        </div>
      </div>

      <div className="px-4 py-6">
        {facilities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
            <p className="text-gray-600">No facilities available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {facilities.map((facility) => (
              <div key={facility.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{getFacilityIcon(facility.facility_type)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{facility.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{facility.location_name}</p>
                    {facility.contact_number && (
                      <p className="text-sm text-blue-600 mb-3">📞 {facility.contact_number}</p>
                    )}
                    {facility.google_maps_link && (
                      <Button
                        onClick={() => handleNavigation(facility.google_maps_link)}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-full"
                      >
                        🧭 {t('navigate')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityRoute;
