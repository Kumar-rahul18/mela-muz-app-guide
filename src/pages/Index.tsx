
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import FacilityIcon from '../components/FacilityIcon';
import LiveSection from '../components/LiveSection';
import ImageSlider from '../components/ImageSlider';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  useEffect(() => {
    // Show language selector on first visit
    const hasSelectedLanguage = localStorage.getItem('app-language');
    if (!hasSelectedLanguage) {
      setShowLanguageSelector(true);
    }
  }, []);

  const facilities = [
    { icon: '🗺️', label: t('facility.route'), type: 'route' },
    { icon: '🖼️', label: t('facility.gallery'), type: 'gallery' },
    { icon: '📞', label: t('facility.contacts'), type: 'contacts' },
    { icon: '🚑', label: t('facility.ambulance'), type: 'ambulance' },
    { icon: '👮', label: t('facility.police'), type: 'police-station' },
    { icon: '🎧', label: t('facility.control_room'), type: 'control-room' },
    { icon: '🚰', label: t('facility.drinking_water'), type: 'drinking-water' },
    { icon: '🚻', label: t('facility.toilet'), type: 'toilet' },
    { icon: '🛁', label: t('facility.bathroom'), type: 'bathroom' },
    { icon: '🛏️', label: t('facility.rest_room'), type: 'rest-room' },
    { icon: '🏠', label: t('facility.dharamshala'), type: 'dharamshala' },
    { icon: '🅿️', label: t('facility.parking'), type: 'parking' },
    { icon: '🏥', label: t('facility.health_centre'), type: 'health-centre' },
    { icon: '🏕️', label: t('facility.shivir'), type: 'shivir' },
    { icon: '🏧', label: t('facility.atm'), type: 'atm' },
    { icon: '🚒', label: t('facility.fire_brigade'), type: 'fire-brigade' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="px-4 pb-6">
        {/* Photo Contest Banner */}
        <div className="mt-4 mb-6 animate-slide-up">
          <div className="app-gradient rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <h1 className="text-2xl font-bold mb-2">SHRAVANI MELA</h1>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">📷</span>
                <span className="text-lg font-semibold">{t('home.photo_contest')}</span>
              </div>
              <div className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-medium inline-block">
                {t('home.pic_of_day')}
              </div>
            </div>
          </div>
        </div>

        {/* Image Slider replacing Pic of the Day Section */}
        <div className="mb-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('home.pic_of_day')}</h2>
          <ImageSlider />
        </div>

        {/* Pic of the Day Section - now smaller */}
        <div className="mb-6 animate-fade-in">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-2xl flex items-center justify-center">
                <span className="text-xl">📸</span>
              </div>
              <div className="text-gray-500 text-sm mb-1">{t('home.free_entry')}</div>
              <div className="font-semibold text-gray-800 mb-2">{t('home.photo_contest')}</div>
              <div className="text-xs text-gray-500 mb-3">{t('home.submit_entry')}</div>
              <div className="text-xs text-gray-500 mb-4">{t('home.daily_winner')}</div>
              <button 
                onClick={() => navigate('/photo-contest')}
                className="bg-pink-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-pink-600 transition-colors"
              >
                {t('home.participate')}
              </button>
            </div>
          </div>
        </div>

        {/* Live Section */}
        <div className="mb-6">
          <LiveSection />
        </div>

        {/* Events Section */}
        <div className="mb-6 animate-fade-in">
          <div 
            onClick={() => navigate('/events')}
            className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold text-gray-800">{t('home.events')}</h2>
            <span className="text-gray-400">➤</span>
          </div>
        </div>

        {/* Facilities Section */}
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('home.facilities')}</h2>
          <div className="grid grid-cols-4 gap-4">
            {facilities.map((facility, index) => (
              <FacilityIcon
                key={index}
                icon={facility.icon}
                label={facility.label}
                type={facility.type}
              />
            ))}
          </div>
        </div>
      </div>

      <LanguageSelector 
        isOpen={showLanguageSelector} 
        onClose={() => setShowLanguageSelector(false)} 
      />
    </div>
  );
};

export default Index;
