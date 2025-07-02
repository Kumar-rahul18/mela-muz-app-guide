
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LostFoundForm from '@/components/LostFoundForm';
import LostFoundDisplay from '@/components/LostFoundDisplay';

const LostFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState<'form' | 'display'>('display');

  const handleFormSuccess = () => {
    setActiveView('display');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-gradient text-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/')} className="text-white">
              ← 
            </button>
            <h1 className="text-lg font-semibold">{t('lost_found')}</h1>
          </div>
          <Button
            onClick={() => setActiveView(activeView === 'form' ? 'display' : 'form')}
            size="sm"
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-4 py-2 shadow-md border-2 border-white"
          >
            {activeView === 'form' ? t('view_items') : t('submit_item')}
          </Button>
        </div>
      </div>

      <div className="p-4">
        {activeView === 'form' ? (
          <LostFoundForm onSuccess={handleFormSuccess} />
        ) : (
          <LostFoundDisplay />
        )}
      </div>
    </div>
  );
};

export default LostFound;
