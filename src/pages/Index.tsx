
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import FacilityIcon from '../components/FacilityIcon';
import LiveSection from '../components/LiveSection';
import ImageSlider from '../components/ImageSlider';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const navigate = useNavigate();
  const { t, showLanguageSelector, setShowLanguageSelector } = useLanguage();

  const facilities = [
    { icon: '🗺️', label: t('Route'), type: 'route' },
    { icon: '🖼️', label: t('Gallery'), type: 'gallery' },
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <Header />
      
      <div className="px-4 pb-6">
        {/* Main Sliding Pictures Section */}
        <div className="mt-4 mb-6 animate-slide-up">
          <ImageSlider />
        </div>

        {/* Photo Contest Section */}
        <div className="mb-6 animate-fade-in">
          <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📸</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-orange-800 mb-1">{t('home.photo_contest')}</h2>
                  <p className="text-orange-600 text-sm">{t('home.submit_entry')}</p>
                  <p className="text-orange-500 text-xs">{t('home.daily_winner')}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/photo-contest')}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
            className="flex items-center justify-between bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 shadow-lg border-2 border-purple-200 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-xl">🎭</span>
              </div>
              <h2 className="text-lg font-semibold text-purple-800">{t('home.events')}</h2>
            </div>
            <span className="text-purple-600 text-2xl">➤</span>
          </div>
        </div>

        {/* Facilities Section */}
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">🏛️</span>
            {t('home.facilities')}
          </h2>
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
