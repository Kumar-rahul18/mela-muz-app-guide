
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
    'app.title': 'Sharavani Mela MMC 25',
    'home.photo_contest': 'Photo Contest',
    'home.pic_of_day': 'Picture of the Day',
    'home.free_entry': 'Free Entry',
    'home.submit_entry': 'Submit your best festival photos',
    'home.daily_winner': 'Daily winner announcement',
    'home.participate': 'Participate',
    'home.events': 'Events',
    'home.facilities': 'Facilities',
    'facility.route': 'Route Map',
    'facility.gallery': 'Gallery',
    'facility.contacts': 'Contacts',
    'facility.ambulance': 'Ambulance',
    'facility.police': 'Police Station',
    'facility.control_room': 'Control Room',
    'facility.drinking_water': 'Drinking Water',
    'facility.toilet': 'Toilet',
    'facility.bathroom': 'Bathroom',
    'facility.rest_room': 'Rest Room',
    'facility.dharamshala': 'Dharamshala',
    'facility.parking': 'Parking',
    'facility.health_centre': 'Health Centre',
    'facility.shivir': 'Shivir',
    'facility.atm': 'ATM',
    'facility.fire_brigade': 'Fire Brigade',
    'nav.home': 'Home',
    'nav.gallery': 'Gallery',
    'nav.events': 'Events',
    'nav.crowd_status': 'Crowd Status',
    'nav.photo_contest': 'Photo Contest',
    'nav.facilities': 'Facilities',
    'nav.admin': 'Admin Panel',
    'nav.change_language': 'Change Language',
    'language.select': 'Select Language',
    'language.english': 'English',
    'language.hindi': 'हिंदी',
    'admin.login': 'Admin Login',
    'admin.email': 'Email',
    'admin.password': 'Password',
    'admin.signin': 'Sign In',
    'admin.dashboard': 'Admin Dashboard',
    'admin.crowd_management': 'Crowd Management',
    'admin.gallery_management': 'Gallery Management',
    'admin.location': 'Location',
    'admin.status': 'Status',
    'admin.low': 'Low',
    'admin.medium': 'Medium',
    'admin.high': 'High',
    'admin.update_status': 'Update Status',
    'admin.add_image': 'Add Image'
  },
  hi: {
    'app.title': 'शारवणी मेला MMC 25',
    'home.photo_contest': 'फोटो प्रतियोगिता',
    'home.pic_of_day': 'आज की तस्वीर',
    'home.free_entry': 'निःशुल्क प्रवेश',
    'home.submit_entry': 'अपनी बेहतरीन त्योहार तस्वीरें जमा करें',
    'home.daily_winner': 'दैनिक विजेता की घोषणा',
    'home.participate': 'भाग लें',
    'home.events': 'कार्यक्रम',
    'home.facilities': 'सुविधाएं',
    'facility.route': 'मार्ग मानचित्र',
    'facility.gallery': 'गैलरी',
    'facility.contacts': 'संपर्क',
    'facility.ambulance': 'एम्बुलेंस',
    'facility.police': 'पुलिस स्टेशन',
    'facility.control_room': 'नियंत्रण कक्ष',
    'facility.drinking_water': 'पेयजल',
    'facility.toilet': 'शौचालय',
    'facility.bathroom': 'स्नानघर',
    'facility.rest_room': 'विश्राम कक्ष',
    'facility.dharamshala': 'धर्मशाला',
    'facility.parking': 'पार्किंग',
    'facility.health_centre': 'स्वास्थ्य केंद्र',
    'facility.shivir': 'शिविर',
    'facility.atm': 'एटीएम',
    'facility.fire_brigade': 'दमकल',
    'nav.home': 'मुख्य पृष्ठ',
    'nav.gallery': 'गैलरी',
    'nav.events': 'कार्यक्रम',
    'nav.crowd_status': 'भीड़ की स्थिति',
    'nav.photo_contest': 'फोटो प्रतियोगिता',
    'nav.facilities': 'सुविधाएं',
    'nav.admin': 'प्रशासन पैनल',
    'nav.change_language': 'भाषा बदलें',
    'language.select': 'भाषा चुनें',
    'language.english': 'English',
    'language.hindi': 'हिंदी',
    'admin.login': 'प्रशासक लॉगिन',
    'admin.email': 'ईमेल',
    'admin.password': 'पासवर्ड',
    'admin.signin': 'साइन इन',
    'admin.dashboard': 'प्रशासक डैशबोर्ड',
    'admin.crowd_management': 'भीड़ प्रबंधन',
    'admin.gallery_management': 'गैलरी प्रबंधन',
    'admin.location': 'स्थान',
    'admin.status': 'स्थिति',
    'admin.low': 'कम',
    'admin.medium': 'मध्यम',
    'admin.high': 'उच्च',
    'admin.update_status': 'स्थिति अपडेट करें',
    'admin.add_image': 'छवि जोड़ें'
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
