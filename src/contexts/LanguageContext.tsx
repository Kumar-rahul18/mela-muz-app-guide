import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  showLanguageSelector: boolean;
  setShowLanguageSelector: (show: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    'app_title': 'Sharavani Mela MMC 25',
    'photo_contest': 'Photo Contest',
    'pic_of_day': 'Picture of the Day',
    'free_entry': 'Free Entry',
    'submit_entry': 'Submit your best festival photos',
    'daily_winner': 'Daily winner announcement',
    'participate': 'Participate',
    'events': 'Events',
    'facilities': 'Facilities',
    'route': 'Route Map',
    'gallery': 'Gallery',
    'contacts': 'Contacts',
    'ambulance': 'Ambulance',
    'weather': 'Weather',
    'control_room': 'Control Room',
    'help_desk': 'Help Desk',
    'drinking_water': 'Drinking Water',
    'toilet': 'Toilet',
    'bathroom': 'Bathroom',
    'rest_room': 'Rest Room',
    'dharamshala': 'Dharamshala',
    'parking': 'Parking',
    'health_centre': 'Health Centre',
    'shivir': 'Shivir',
    'atm': 'ATM',
    'home': 'Home',
    'history': 'History',
    'crowd_status': 'Crowd Status',
    'admin': 'Admin Panel',
    'change_language': 'Change Language',
    'select_language': 'Select Language',
    'english': 'English',
    'hindi': 'हिंदी',
    'tap_to_call': 'Tap to call',
    'live_darshan': 'Live Darshan',
    'virtual_pooja': 'Virtual Pooja',
    'live_aarti': 'Live Aarti',
    'navigate': 'Navigate',
    'language': 'en',
    'mela_route': 'Mela Route',
    'centralised_contact': 'Centralised Contact'
  },
  hi: {
    'app_title': 'श्रावणी मेला MMC 25',
    'photo_contest': 'फोटो प्रतियोगिता',
    'pic_of_day': 'आज की तस्वीर',
    'free_entry': 'निःशुल्क प्रवेश',
    'submit_entry': 'अपनी बेहतरीन त्योहार तस्वीरें जमा करें',
    'daily_winner': 'दैनिक विजेता की घोषणा',
    'participate': 'भाग लें',
    'events': 'कार्यक्रम',
    'facilities': 'सुविधाएं',
    'route': 'मार्ग मानचित्र',
    'gallery': 'गैलरी',
    'contacts': 'संपर्क',
    'ambulance': 'एम्बुलेंस',
    'weather': 'मौसम',
    'control_room': 'नियंत्रण कक्ष',
    'help_desk': 'सहायता डेस्क',
    'drinking_water': 'पेयजल',
    'toilet': 'शौचालय',
    'bathroom': 'स्नानघर',
    'rest_room': 'विश्राम कक्ष',
    'dharamshala': 'धर्मशाला',
    'parking': 'पार्किंग',
    'health_centre': 'स्वास्थ्य केंद्र',
    'shivir': 'शिविर',
    'atm': 'एटीएम',
    'home': 'मुख्य पृष्ठ',
    'history': 'इतिहास',
    'crowd_status': 'भीड़ की स्थिति',
    'admin': 'प्रशासन पैनल',
    'change_language': 'भाषा बदलें',
    'select_language': 'भाषा चुनें',
    'english': 'English',
    'hindi': 'हिंदी',
    'tap_to_call': 'कॉल करने के लिए टैप करें',
    'live_darshan': 'लाइव दर्शन',
    'virtual_pooja': 'वर्चुअल पूजा',
    'live_aarti': 'लाइव आरती',
    'navigate': 'दिशा-निर्देश',
    'language': 'hi',
    'mela_route': 'मेला मार्ग',
    'centralised_contact': 'केंद्रीकृत संपर्क'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  useEffect(() => {
    // Check if language has been selected before
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const languageSelected = localStorage.getItem('languageSelected');
    
    if (savedLanguage && languageSelected === 'true') {
      setLanguage(savedLanguage as Language);
      setShowLanguageSelector(false);
    } else {
      // Show language selector on first visit or app reopening
      setShowLanguageSelector(true);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
    localStorage.setItem('languageSelected', 'true');
    setShowLanguageSelector(false);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleLanguageChange, 
      t, 
      showLanguageSelector, 
      setShowLanguageSelector 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
