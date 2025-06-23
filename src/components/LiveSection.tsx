
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useLanguage } from '@/contexts/LanguageContext';

// const LiveSection = () => {
//   const navigate = useNavigate();
//   const { t } = useLanguage();

//   const items = [
//     {
//       icon: '🎭',
//       label: t('virtual_pooja'),
//       path: '/virtual-pooja'
//     },
//     {
//       icon: '📹',
//       label: t('live_darshan'),
//       path: '/live-darshan'
//     },
//     {
//       icon: '👥',
//       label: t('crowd_status'),
//       path: '/crowd-status'
//     },
//     {
//       icon: '🎵',
//       label: t('shiv_bhajan'),
//       action: () => window.open('https://www.youtube.com/watch?v=XTp5jaRU3Ws', '_blank')
//     }
//   ];

//   const handleItemClick = (item: any) => {
//     if (item.action) {
//       item.action();
//     } else if (item.path) {
//       navigate(item.path);
//     }
//   };

//   return (
//     <div className="animate-fade-in">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('live_aarti')}</h2>
//       <div className="flex gap-3 overflow-x-auto pb-2">
//         {items.map((item, index) => (
//           <div 
//             key={index}
//             onClick={() => handleItemClick(item)}
//             className="flex flex-col items-center space-y-2 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md min-w-[80px] flex-shrink-0"
//           >
//             <div className="card-gradient w-12 h-12 rounded-xl flex items-center justify-center shadow-md">
//               <span className="text-xl">{item.icon}</span>
//             </div>
//             <span className="text-xs text-gray-700 font-medium text-center leading-tight">
//               {item.label}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LiveSection;

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
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-orange-500 flex items-center justify-center text-xl sm:text-2xl shadow-md">
              <span>{item.icon}</span>
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
