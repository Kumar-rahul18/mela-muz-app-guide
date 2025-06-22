
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface CrowdLocation {
  id: string;
  location: string;
  status: 'low' | 'medium' | 'high';
  status_color: 'green' | 'yellow' | 'red';
  description: string;
}

const CrowdStatus = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [locations, setLocations] = useState<CrowdLocation[]>([]);

  useEffect(() => {
    fetchCrowdStatus();
  }, []);

  const fetchCrowdStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('crowd_status')
        .select('*')
        .order('location');

      if (error) {
        console.error('Error fetching crowd status:', error);
        return;
      }

      // Type cast the data to match our interface
      const typedData: CrowdLocation[] = (data || []).map(item => ({
        id: item.id,
        location: item.location,
        status: item.status as 'low' | 'medium' | 'high',
        status_color: item.status_color as 'green' | 'yellow' | 'red',
        description: item.description || ''
      }));

      setLocations(typedData);
    } catch (error) {
      console.error('Error fetching crowd status:', error);
    }
  };

  const getOverallStatus = () => {
    if (locations.length === 0) return { level: 'MODERATE', emoji: '⚠️', color: 'yellow' };
    
    const highCount = locations.filter(l => l.status === 'high').length;
    const mediumCount = locations.filter(l => l.status === 'medium').length;
    
    if (highCount > locations.length / 2) {
      return { level: 'HIGH', emoji: '🔴', color: 'red' };
    } else if (mediumCount > locations.length / 2) {
      return { level: 'MODERATE', emoji: '⚠️', color: 'yellow' };
    } else {
      return { level: 'LOW', emoji: '🟢', color: 'green' };
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-gradient text-white px-4 py-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/')} 
            className="text-white font-bold text-xl bg-white/20 rounded-lg px-3 py-1 hover:bg-white/30 transition-colors"
          >
            ← 
          </button>
          <h1 className="text-lg font-semibold">{t('Crowd status')}</h1>
        </div>
      </div>

{/*       <div className="px-4 py-6">
        {/* Overall Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Current Crowd Level</h2>
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">{overallStatus.emoji}</span>
            </div>
            <p className={`text-2xl font-bold mb-2 ${
              overallStatus.color === 'red' ? 'text-red-600' :
              overallStatus.color === 'yellow' ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {overallStatus.level}
            </p>
            <p className="text-gray-600 text-sm">Last updated: 2 minutes ago</p>
          </div>
        </div> */}

        {/* Legend */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Crowd Levels</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mb-1"></div>
              <span className="text-xs text-gray-600">{t('admin.low')}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mb-1"></div>
              <span className="text-xs text-gray-600">{t('admin.medium')}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mb-1"></div>
              <span className="text-xs text-gray-600">{t('admin.high')}</span>
            </div>
          </div>
        </div>

        {/* Location Status */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Live Status by Location</h3>
          {locations.map((location) => (
            <div key={location.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    location.status_color === 'green' ? 'bg-green-500' :
                    location.status_color === 'yellow' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-800">{location.location}</p>
                    <p className="text-xs text-gray-500">{location.description}</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  location.status_color === 'green' ? 'bg-green-100 text-green-700' :
                  location.status_color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {location.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-2xl p-4 mt-6">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Tips for Better Experience</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Visit during off-peak hours (early morning or late evening)</li>
            <li>• Use alternative entrances during high crowd times</li>
            <li>• Keep hydrated and follow safety guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CrowdStatus;
