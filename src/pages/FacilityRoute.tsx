import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import FacilityMap from '@/components/FacilityMap';

interface Facility {
  id: string;
  facility_type: string;
  name: string;
  contact_number: string;
  location_name: string;
  google_maps_link: string;
  is_active: boolean;
}

interface Contact {
  id: string;
  contact_type: string;
  name: string;
  phone: string;
  email: string;
  designation: string;
  is_active: boolean;
}

const FacilityRoute = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(searchParams.get('showMap') === 'true');

  useEffect(() => {
    fetchData();
  }, [type]);

  const fetchData = async () => {
    try {
      if (type === 'centralised-contact') {
        // Fetch contacts for centralised contact
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .eq('is_active', true)
          .order('contact_type');

        if (error) {
          console.error('Error fetching contacts:', error);
          return;
        }

        setContacts(data || []);
      } else if (type && type !== 'route' && type !== 'gallery' && type !== 'mela-route' && type !== 'atm') {
        // Fetch facilities for specific types
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
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFacilityIcon = (facilityType: string) => {
    const icons: { [key: string]: string } = {
      'paid-hotels': '🏨',
      'drinking-water': '🚰',
      'toilet': '🚻',
      'bathroom': '🛁',
      'rest-room': '🛏️',
      'dharamshala': '🏛️',
      'shivir': '🏕️',
      'health-centre': '🏥',
      'parking': '🅿️',
      'centralised-contact': '📞',
      'mela-route': '🗺️',
      'gallery': '🖼️',
      'atm': '🏧',
      'bhandara': '🍽️'
    };
    return icons[facilityType] || '🏢';
  };

  const getFacilityName = (facilityType: string) => {
    const nameKeys: { [key: string]: string } = {
      'paid-hotels': 'paid_hotels',
      'drinking-water': 'drinking_water',
      'toilet': 'toilet',
      'bathroom': 'bathroom',
      'rest-room': 'rest_room',
      'dharamshala': 'dharamshala',
      'shivir': 'shivir',
      'health-centre': 'health_centre',
      'parking': 'parking',
      'centralised-contact': 'centralised_contact',
      'mela-route': 'mela_route',
      'gallery': 'gallery',
      'atm': 'atm',
      'bhandara': 'bhandaras'
    };
    return t(nameKeys[facilityType] || facilityType);
  };

  const getFacilityDescription = (facilityType: string) => {
    const descKeys: { [key: string]: string } = {
      'paid-hotels': 'paid_hotels_desc',
      'drinking-water': 'drinking_water_desc',
      'toilet': 'toilet_desc',
      'bathroom': 'bathroom_desc',
      'rest-room': 'rest_room_desc',
      'dharamshala': 'dharamshala_desc',
      'shivir': 'shivir_desc',
      'health-centre': 'health_centre_desc',
      'parking': 'parking_desc',
      'mela-route': 'mela_route_desc',
      'atm': 'atm_desc',
      'bhandara': 'bhandara_desc'
    };
    return t(descKeys[facilityType] || '');
  };

  const handleNavigation = (googleMapsLink: string) => {
    if (googleMapsLink) {
      window.open(googleMapsLink, '_blank');
    }
  };

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const renderSpecialPages = () => {
    if (type === 'mela-route') {
      return (
        <div className="space-y-6">
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🗺️</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('mela_route')}</h3>
            <p className="text-gray-600 mb-4">{getFacilityDescription('mela-route')}</p>
          </div>
          
          {/* Embedded Google My Maps */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">🗺️ Interactive Mela Route Map</h4>
              <p className="text-sm text-gray-600">Navigate through the complete mela route with detailed locations</p>
            </div>
            
            <div className="relative w-full h-96 rounded-xl overflow-hidden border border-gray-200">
              <iframe
                src="https://www.google.com/maps/d/embed?mid=12Ska74VIJpg4q92-zOkNb9guMft1UZE&ehbc=2E312F"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mela Route Map"
                className="rounded-xl"
              />
            </div>
            
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() => window.open('https://www.google.com/maps/d/edit?mid=12Ska74VIJpg4q92-zOkNb9guMft1UZE&usp=sharing', '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
              >
                🔗 Open Full Map
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (type === 'gallery') {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🖼️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">{t('gallery')}</h3>
          <p className="text-gray-600">Photo gallery from contest submissions</p>
        </div>
      );
    }

    if (type === 'atm') {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🏧</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">{t('atm')}</h3>
          <p className="text-gray-600">{getFacilityDescription('atm')}</p>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="app-gradient text-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/')} 
              className="text-white font-bold text-xl bg-white/20 rounded-lg px-3 py-1 hover:bg-white/30 transition-colors"
            >
              ← 
            </button>
            <h1 className="text-lg font-semibold">
              {type ? getFacilityName(type) : t('facilities')}
            </h1>
          </div>
          {type && type !== 'centralised-contact' && type !== 'gallery' && (
            <Button
              onClick={() => setShowMap(!showMap)}
              size="sm"
              className="bg-blue-800 hover:bg-blue-900 text-white-900 border-blue-500"
            >
              <MapPin className="w-4 h-4 mr-2 text-white-900" />
              {showMap ? t('show_all') : t('show_nearby')}
            </Button>
          )}
        </div>
        {/* Add description below header */}
        {type && getFacilityDescription(type) && (
          <div className="mt-2 px-2">
            <p className="text-white/90 text-sm">{getFacilityDescription(type)}</p>
          </div>
        )}
      </div>

      <div className="px-4 py-6">
        {/* Map Component */}
        {showMap && type && type !== 'centralised-contact' && type !== 'gallery' && (
          <div className="mb-6">
            <FacilityMap facilityType={type} />
          </div>
        )}

        {type === 'centralised-contact' ? (
          contacts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📞</span>
              </div>
              <p className="text-gray-600">No contacts available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">📞</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{contact.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{contact.designation}</p>
                      <p className="text-sm text-gray-500 mb-1">{contact.contact_type}</p>
                      {contact.email && (
                        <p className="text-sm text-blue-600 mb-3">✉️ {contact.email}</p>
                      )}
                      <Button
                        onClick={() => handleCall(contact.phone)}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-full"
                      >
                        📞 Call {contact.phone}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : type === 'mela-route' || type === 'gallery' || type === 'atm' ? (
          renderSpecialPages()
        ) : facilities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">{getFacilityIcon(type || '')}</span>
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
                        🧭 Navigate
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
