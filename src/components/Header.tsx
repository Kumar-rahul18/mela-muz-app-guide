
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
      <header className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 text-white px-4 py-3 shadow-lg relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors mr-3 order-first"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="w-8 h-8">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <h1 className="text-lg font-semibold">{t('app_title')}</h1>
          </div>
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
