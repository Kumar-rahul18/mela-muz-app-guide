import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import LiveSection from '@/components/LiveSection';
import WeatherWidget from '@/components/WeatherWidget';
import LanguageSelector from '@/components/LanguageSelector';
import ContactCategoryFilter from '@/components/ContactCategoryFilter';
import FacilityIcon from '@/components/FacilityIcon';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const { t, showLanguageSelector, setShowLanguageSelector } = useLanguage();
  const [contestPhotos, setContestPhotos] = useState<any[]>([]);
  const [showContacts, setShowContacts] = useState(false);

  useEffect(() => {
    fetchApprovedContestPhotos();
  }, []);

  const fetchApprovedContestPhotos = async () => {
    try {
      console.log('Fetching approved contest photos for Index page...');
      
      const { data, error } = await supabase
        .from('photo_contest_submissions')
        .select('id, image_url, name, created_at')
        .eq('is_approved', true)  // Only fetch approved photos
        .order('created_at', { ascending: false })
        .limit(2);

      if (error) {
        console.error('Error fetching approved contest photos for Index:', error);
        // Set fallback images if there's an error
        setContestPhotos([
          {
            id: 1,
            image_url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Morning Prayer",
          },
          {
            id: 2,
            image_url: "https://images.unsplash.com/photo-1544913161-649431ccf735?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Temple View",
          }
        ]);
        return;
      }

      console.log('Fetched approved contest photos for Index:', data);
      
      if (data && data.length > 0) {
        setContestPhotos(data.map(photo => ({
          id: photo.id,
          image_url: photo.image_url,
          title: `Photo by ${photo.name}`,
        })));
      } else {
        console.log('No approved contest photos found, using fallback images');
        // Set fallback images if no approved data
        setContestPhotos([
          {
            id: 1,
            image_url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Morning Prayer",
          },
          {
            id: 2,
            image_url: "https://images.unsplash.com/photo-1544913161-649431ccf735?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Temple View",
          }
        ]);
      }
    } catch (error) {
      console.error('Unexpected error fetching approved contest photos for Index:', error);
      // Set fallback images on unexpected error
      setContestPhotos([
        {
          id: 1,
          image_url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          title: "Morning Prayer",
        },
        {
          id: 2,
          image_url: "https://images.unsplash.com/photo-1544913161-649431ccf735?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          title: "Temple View",
        }
      ]);
    }
  };

  const facilityItems = [
    { icon: '🗺️', label: t('mela_route'), path: '/facility/mela-route' },
    { icon: '📞', label: t('centralised_contact'), action: () => setShowContacts(true) },
    {
      icon: '🖼️',
      label: t('gallery'),
      path: '/gallery',
      action: () => navigate('/gallery'),
    },
    { icon: '🧠', label: 'Mela Quiz', path: '/mela-quiz' },
    { icon: '🏧', label: t('atm'), path: '/facility/atm' },
    { icon: '🚰', label: t('drinking_water'), path: '/facility/drinking-water' },
    { icon: '🚻', label: t('toilet'), path: '/facility/toilet' },
    { icon: '🛁', label: t('bathroom'), path: '/facility/bathroom' },
    { icon: '🛏️', label: t('rest_room'), path: '/facility/rest-room' },
    { icon: '🏛️', label: t('dharamshala'), path: '/facility/dharamshala' },
    { icon: '🏕️', label: t('shivir'), path: '/facility/shivir' },
    { icon: '🏥', label: t('health_centre'), path: '/facility/health-centre' },
    { icon: '🅿️', label: t('parking'), path: '/facility/parking' },
    { icon: '📦', label: 'Lost & Found', path: '/lost-found' },
    { icon: '🍽️', label: 'Bhandara', path: '/facility/bhandara' },
  ];

  const quickAccessItems = [
    { icon: '🚨', label: t('ambulance'), action: () => window.open('tel:108', '_self') },
    { icon: '🌤️', label: t('weather'), component: <WeatherWidget /> },
    { icon: '📞', label: t('control_room'), action: () => window.open('tel:102', '_self') },
    { icon: '🛠️', label: t('help_desk'), action: () => window.open('tel:1800-123-4567', '_self') }
  ];

  if (showContacts) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="app-gradient text-white px-4 py-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <button onClick={() => setShowContacts(false)} className="text-white">←</button>
            <h1 className="text-lg font-semibold">{t('centralised_contact')}</h1>
          </div>
        </div>
        <div className="px-4 py-6">
          <ContactCategoryFilter />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <LanguageSelector isOpen={showLanguageSelector} onClose={() => setShowLanguageSelector(false)} />
      
      <div className="px-4 py-6 space-y-6">

        {/* Photo Contest Banner */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">📸</span>
                <h2 className="text-lg font-bold">{t('photo_contest')}</h2>
              </div>
              <p className="text-sm text-white/90 mb-3">{t('submit_entry')}</p>
              <button 
                onClick={() => navigate('/photo-contest')}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('participate')}
              </button>
            </div>
            <div className="text-6xl opacity-20">🏆</div>
          </div>
        </div>

        {/* Photo Gallery from Contest - Only Approved Photos */}
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('pic_of_day')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {contestPhotos.slice(0, 2).map((photo) => (
              <div key={photo.id} className="relative rounded-2xl overflow-hidden shadow-sm">
                <img 
                  src={photo.image_url} 
                  alt={photo.title}
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', photo.image_url);
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-medium">{photo.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Section */}
        <LiveSection />

        {/* Facilities Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 px-4">🏛️ Facilities</h2>
          <div className="px-4">
            <div className="grid grid-cols-4 gap-4">
              {facilityItems.map((item, index) => (
                <FacilityIcon
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  type={item.path ? item.path.split('/').pop() : undefined}
                  onClick={item.action}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('contacts')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickAccessItems.map((item, index) => (
              <div 
                key={index}
                onClick={item.action}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {item.component ? (
                  item.component
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500">{t('tap_to_call')}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Index;
