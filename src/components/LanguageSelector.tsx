
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isOpen, onClose }) => {
  const { setLanguage, t } = useLanguage();

  const handleLanguageSelect = (lang: 'en' | 'hi') => {
    setLanguage(lang);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {t('lang.select')}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4 p-6">
          <Button
            onClick={() => handleLanguageSelect('en')}
            className="h-16 text-lg bg-blue-500 hover:bg-blue-600"
          >
            🇺🇸 {t('lang.english')}
          </Button>
          <Button
            onClick={() => handleLanguageSelect('hi')}
            className="h-16 text-lg bg-orange-500 hover:bg-orange-600"
          >
            🇮🇳 {t('lang.hindi')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelector;
