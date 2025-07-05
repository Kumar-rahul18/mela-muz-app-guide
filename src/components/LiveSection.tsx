
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const LiveSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const items = [
    {
      icon: '🛕',
      label: t('virtual_pooja'),
      path: '/virtual-pooja',
    },
    {
      icon: '📹',
      label: t('live_darshan'),
      path: '/live-darshan',
    },
    {
      icon: '👥',
      label: t('crowd_status'),
      path: '/crowd-status',
    },
    {
      icon: '🎵',
      label: t('shiv_bhajan'),
      action: () =>
        window.open(
          'https://youtube.com/playlist?list=PLSVDTyd9LvbWVR9rgho_95yPI0HWutsh9&si=pWiZskCe8-7rUw-I',
          '_blank'
        ),
    },
  ];

  const handleItemClick = (item: any) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
        {t('live_aarti')}
      </h2>

      <div className="grid grid-cols-4 gap-3 sm:gap-6 justify-center text-center">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => handleItemClick(item)}
            className="flex flex-col items-center space-y-1 sm:space-y-2 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <div className="icon-3d w-12 h-12 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-br from-orange-300 via-orange-500 to-red-600 flex items-center justify-center text-xl sm:text-2xl shadow-2xl border-2 border-orange-200">
              <div className={`icon-3d-container ${index % 2 === 0 ? 'animate-dice-3d-odd' : 'animate-dice-3d-even'} relative z-10`}>
                <span className="relative z-20 drop-shadow-2xl text-white font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{item.icon}</span>
              </div>
            </div>
            <span className="text-[10px] sm:text-sm text-gray-800 font-medium leading-tight">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveSection;
