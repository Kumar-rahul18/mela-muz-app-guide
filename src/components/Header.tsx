
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import NavigationDrawer from './NavigationDrawer';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <header className="app-gradient text-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <h1 className="text-lg font-semibold">{t('app.title')}</h1>
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>
      
      <NavigationDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        onLanguageChange={() => setIsLanguageSelectorOpen(true)}
      />
      
      <LanguageSelector 
        isOpen={isLanguageSelectorOpen} 
        onClose={() => setIsLanguageSelectorOpen(false)} 
      />
    </>
  );
};

export default Header;
