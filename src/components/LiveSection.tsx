
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const LiveSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const items = [
    {
      icon: '🎭',
      label: t('virtual_pooja'),
      path: '/virtual-pooja'
    },
    {
      icon: '📹',
      label: t('live_darshan'),
      path: '/live-darshan'
    },
    {
      icon: '👥',
      label: t('crowd_status'),
      path: '/crowd-status'
    },
    {
      icon: '🎵',
      label: t('shiv_bhajan'),
      action: () => window.open('https://www.youtube.com/results?search_query=shiv+bhajan', '_blank')
    }
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
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('live_aarti')}</h2>
      <div className="grid grid-cols-1 gap-3">
        {items.map((item, index) => (
          <div 
            key={index}
            onClick={() => handleItemClick(item)}
            className="flex items-center space-x-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
          >
            <div className="card-gradient w-12 h-12 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-xl">{item.icon}</span>
            </div>
            <span className="text-sm text-gray-700 font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveSection;
