
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import FacilityIcon from '../components/FacilityIcon';
import LiveSection from '../components/LiveSection';

const Index = () => {
  const navigate = useNavigate();

  const facilities = [
    { icon: '🗺️', label: 'Mela Route', type: 'route' },
    { icon: '🖼️', label: 'Gallery', type: 'gallery' },
    { icon: '📞', label: 'Centralized Contacts', type: 'contacts' },
    { icon: '🚑', label: 'Ambulance', type: 'ambulance' },
    { icon: '👮', label: 'Police Station', type: 'police-station' },
    { icon: '🎧', label: 'Control Room', type: 'control-room' },
    { icon: '🚰', label: 'Drinking Water', type: 'drinking-water' },
    { icon: '🚻', label: 'Toilet', type: 'toilet' },
    { icon: '🛁', label: 'Bathroom', type: 'bathroom' },
    { icon: '🛏️', label: 'Rest Room', type: 'rest-room' },
    { icon: '🏠', label: 'Dharamshala', type: 'dharamshala' },
    { icon: '🅿️', label: 'Parking', type: 'parking' },
    { icon: '🏥', label: 'Health Centre', type: 'health-centre' },
    { icon: '🏕️', label: 'Shivir', type: 'shivir' },
    { icon: '🏧', label: 'ATM', type: 'atm' },
    { icon: '🚒', label: 'Fire Brigade', type: 'fire-brigade' }
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
                <span className="text-lg font-semibold">PHOTO CONTEST</span>
              </div>
              <div className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-medium inline-block">
                PIC OF THE DAY
              </div>
            </div>
          </div>
        </div>

        {/* Pic of the Day Section */}
        <div className="mb-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Pic of the Day</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 bg-gray-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">📸</span>
              </div>
              <div className="text-gray-500 text-sm mb-1">Free Entry</div>
              <div className="font-semibold text-gray-800 mb-2">PHOTO CONTEST</div>
              <div className="text-xs text-gray-500 mb-3">Submit Your Entry</div>
              <div className="text-xs text-gray-500 mb-4">Daily Winner</div>
              <button 
                onClick={() => navigate('/photo-contest')}
                className="bg-pink-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-pink-600 transition-colors"
              >
                Participate
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
            <h2 className="text-lg font-semibold text-gray-800">Shravani Mela Events</h2>
            <span className="text-gray-400">➤</span>
          </div>
        </div>

        {/* Facilities Section */}
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Facilities & Contacts</h2>
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
    </div>
  );
};

export default Index;
