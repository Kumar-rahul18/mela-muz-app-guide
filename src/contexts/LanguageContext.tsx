
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
    'police': 'Police Station',
    'control_room': 'Control Room',
    'drinking_water': 'Drinking Water',
    'toilet': 'Toilet',
    'bathroom': 'Bathroom',
    'rest_room': 'Rest Room',
    'dharamshala': 'Dharamshala',
    'parking': 'Parking',
    'health_centre': 'Health Centre',
    'shivir': 'Shivir',
    'atm': 'ATM',
    'fire_brigade': 'Fire Brigade',
    'home': 'Home',
    'crowd_status': 'Crowd Status',
    'admin': 'Admin Panel',
    'change_language': 'Change Language',
    'select_language': 'Select Language',
    'english': 'English',
    'hindi': 'हिंदी',
    'admin_login': 'Admin Login',
    'email': 'Email',
    'password': 'Password',
    'signin': 'Sign In',
    'admin_dashboard': 'Admin Dashboard',
    'crowd_management': 'Crowd Management',
    'gallery_management': 'Gallery Management',
    'location': 'Location',
    'status': 'Status',
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'update_status': 'Update Status',
    'add_image': 'Add Image',
    'live_darshan': 'Live Darshan'
  },
  hi: {
    'app_title': 'शारवणी मेला MMC 25',
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
    'police': 'पुलिस स्टेशन',
    'control_room': 'नियंत्रण कक्ष',
    'drinking_water': 'पेयजल',
    'toilet': 'शौचालय',
    'bathroom': 'स्नानघर',
    'rest_room': 'विश्राम कक्ष',
    'dharamshala': 'धर्मशाला',
    'parking': 'पार्किंग',
    'health_centre': 'स्वास्थ्य केंद्र',
    'shivir': 'शिविर',
    'atm': 'एटीएम',
    'fire_brigade': 'दमकल',
    'home': 'मुख्य पृष्ठ',
    'crowd_status': 'भीड़ की स्थिति',
    'admin': 'प्रशासन पैनल',
    'change_language': 'भाषा बदलें',
    'select_language': 'भाषा चुनें',
    'english': 'English',
    'hindi': 'हिंदी',
    'admin_login': 'प्रशासक लॉगिन',
    'email': 'ईमेल',
    'password': 'पासवर्ड',
    'signin': 'साइन इन',
    'admin_dashboard': 'प्रशासक डैशबोर्ड',
    'crowd_management': 'भीड़ प्रबंधन',
    'gallery_management': 'गैलरी प्रबंधन',
    'location': 'स्थान',
    'status': 'स्थिति',
    'low': 'कम',
    'medium': 'मध्यम',
    'high': 'उच्च',
    'update_status': 'स्थिति अपडेट करें',
    'add_image': 'छवि जोड़ें',
    'live_darshan': 'लाइव दर्शन'
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
