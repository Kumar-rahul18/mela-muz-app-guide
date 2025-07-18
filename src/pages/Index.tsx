import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import LiveSection from '@/components/LiveSection';
import WeatherWidget from '@/components/WeatherWidget';
import LanguageSelector from '@/components/LanguageSelector';
import ContactCategoryFilter from '@/components/ContactCategoryFilter';
import FacilityIcon from '@/components/FacilityIcon';
import FloatingVoiceButton from '@/components/FloatingVoiceButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, showLanguageSelector, setShowLanguageSelector, language } = useLanguage();
  const [contestPhotos, setContestPhotos] = useState<any[]>([]);
  const [showContacts, setShowContacts] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    fetchApprovedContestPhotos();
    
    // Check if we need to show contacts from voice navigation
    if (location.state?.showContacts) {
      setShowContacts(true);
      // Clear the state to prevent it from persisting
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchApprovedContestPhotos();
  }, []);

  // Auto-slide effect for pictures
  useEffect(() => {
    if (contestPhotos.length > 0) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev + 1) % contestPhotos.length);
      }, 3000); // Change picture every 3 seconds

      return () => clearInterval(interval);
    }
  }, [contestPhotos.length]);

  const fetchApprovedContestPhotos = async () => {
    try {
      console.log('Fetching approved contest photos for Index page...');
      
      const { data, error } = await supabase
        .from('photo_contest_submissions')
        .select('id, image_url, name, created_at')
        .eq('is_approved', true)  // Only fetch approved photos
        .order('created_at', { ascending: false })
        .limit(5); // Limit to 5 photos for the carousel

      if (error) {
        console.error('Error fetching approved contest photos for Index:', error);
        // Set 5 fallback images if there's an error
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
          },
          {
            id: 3,
            image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Evening Aarti",
          },
          {
            id: 4,
            image_url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Cultural Dance",
          },
          {
            id: 5,
            image_url: "https://images.unsplash.com/photo-1566495757213-570fdc4b71b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Festival Crowd",
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
        // Set 5 fallback images if no approved data
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
          },
          {
            id: 3,
            image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Evening Aarti",
          },
          {
            id: 4,
            image_url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Cultural Dance",
          },
          {
            id: 5,
            image_url: "https://images.unsplash.com/photo-1566495757213-570fdc4b71b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Festival Crowd",
          }
        ]);
      }
    } catch (error) {
      console.error('Unexpected error fetching approved contest photos for Index:', error);
      // Set 5 fallback images on unexpected error
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
        },
        {
          id: 3,
          image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          title: "Evening Aarti",
        },
        {
          id: 4,
          image_url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          title: "Cultural Dance",
        },
        {
          id: 5,
          image_url: "https://images.unsplash.com/photo-1566495757213-570fdc4b71b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          title: "Festival Crowd",
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
    { icon: '🧠', label: t('mela_quiz'), action: () => navigate('/mela-quiz') },
    { icon: '🏨', label: t('paid_hotels'), path: '/facility/paid-hotels' },
    { icon: '🏧', label: t('atm'), path: '/facility/atm' },
    { icon: '🚰', label: t('drinking_water'), path: '/facility/drinking-water' },
    { icon: '🚻', label: t('toilet'), path: '/facility/toilet' },
    { icon: '🛁', label: t('bathroom'), path: '/facility/bathroom' },
    { icon: '🛏️', label: t('rest_room'), path: '/facility/rest-room' },
    { icon: '🏛️', label: t('dharamshala'), path: '/facility/dharamshala' },
    { icon: '🏕️', label: t('shivir'), path: '/facility/shivir' },
    { icon: '🏥', label: t('health_centre'), path: '/facility/health-centre' },
    { icon: '🅿️', label: t('parking'), path: '/facility/parking' },
    { icon: '📦', label: t('lost_found'), action: () => navigate('/lost-found') },
    { icon: '🍽️', label: t('bhandaras'), path: '/facility/bhandara' },
  ];

  const quickAccessItems = [
    { icon: '🚨', label: t('ambulance'), action: () => window.open('tel:108', '_self') },
    { icon: '🌤️', label: t('weather'), component: <WeatherWidget /> },
    { icon: '📞', label: t('control_room'), action: () => window.open('tel:155304', '_self') },
    { icon: '🛠️', label: t('help_desk'), action: () => window.open('tel:155304', '_self') }
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
      
      <div className="px-4 py-6 space-y-6 pb-32">

        {/* Photo Contest Banner */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">📸</span>
                <h2 className="text-lg font-bold">{t('photo_contest')}</h2>
              </div>
              <p className="text-sm text-white/90 mb-3">{t('submit_entry')}</p>
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => navigate('/photo-contest')}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors w-fit"
                >
                  {t('participate')}
                </button>
                <button 
                  onClick={() => navigate('/gallery')}
                  className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors w-fit"
                >
                  जमा किया हुआ फोटो देखें
                </button>
              </div>
            </div>
            <div className="text-6xl opacity-20">🏆</div>
          </div>
        </div>

        {/* Pic of the Day - Single Sliding Image */}
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('pic_of_day')}</h2>
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            {contestPhotos.length > 0 && (
              <>
                <div className="relative h-48 w-full">
                  <img 
                    src={contestPhotos[currentPhotoIndex]?.image_url} 
                    alt={contestPhotos[currentPhotoIndex]?.title}
                    className="w-full h-full object-cover transition-opacity duration-500"
                    onError={(e) => {
                      console.error('Image failed to load:', contestPhotos[currentPhotoIndex]?.image_url);
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-medium">{contestPhotos[currentPhotoIndex]?.title}</p>
                  </div>
                </div>
                
                {/* Dots Indicator */}
                <div className="absolute bottom-2 right-4 flex space-x-1">
                  {contestPhotos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Live Section */}
        <LiveSection />

        {/* Facilities Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 px-4">
            🏛️ {language === 'hi' ? 'सुविधाएं' : 'Facilities'}
          </h2>
          <div className="px-4">
            <div className="grid grid-cols-4 gap-4">
              {facilityItems.map((item, index) => (
                <FacilityIcon
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  type={item.path ? item.path.split('/').pop() : undefined}
                  onClick={item.action}
                  index={index}
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
      
      {/* Floating Voice Search Button */}
      <FloatingVoiceButton />
    </div>
  );
};

export default Index;
