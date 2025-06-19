
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LiveSection = () => {
  const navigate = useNavigate();

  const items = [
    {
      icon: '🎭',
      label: 'Virtual Pooja',
      path: '/virtual-pooja'
    },
    {
      icon: '📹',
      label: 'Live Darshan',
      path: '/live-darshan'
    },
    {
      icon: '👥',
      label: 'Crowd Status',
      path: '/crowd-status'
    }
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Live Aarti & Crowd Status</h2>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div 
            key={index}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center space-y-2 cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <div className="card-gradient w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">{item.icon}</span>
            </div>
            <span className="text-xs text-gray-600 text-center font-medium leading-tight">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveSection;
