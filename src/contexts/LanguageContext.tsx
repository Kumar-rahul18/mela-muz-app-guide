
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'app.title': 'Sharavani Mela MMC 25',
    
    // Navigation
    'nav.home': 'Home',
    'nav.gallery': 'Gallery',
    'nav.events': 'Events',
    'nav.crowd_status': 'Crowd Status',
    'nav.admin': 'Admin Access',
    'nav.photo_contest': 'Photo Contest',
    'nav.facilities': 'Facilities',
    'nav.change_language': 'Change Language',
    
    // Home sections
    'home.photo_contest': 'PHOTO CONTEST',
    'home.pic_of_day': 'Pic of the Day',
    'home.free_entry': 'Free Entry',
    'home.submit_entry': 'Submit Your Entry',
    'home.daily_winner': 'Daily Winner',
    'home.participate': 'Participate',
    'home.live_aarti': 'Live Aarti & Crowd Status',
    'home.events': 'Sharavani Mela Events',
    'home.facilities': 'Facilities & Contacts',
    
    // Live section
    'live.virtual_pooja': 'Virtual Pooja',
    'live.live_darshan': 'Live Darshan',
    'live.crowd_status': 'Crowd Status',
    
    // Facilities
    'facility.route': 'Mela Route',
    'facility.gallery': 'Gallery',
    'facility.contacts': 'Centralized Contacts',
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
    
    // Language selection
    'lang.select': 'Select Language',
    'lang.english': 'English',
    'lang.hindi': 'हिंदी',
    'lang.continue': 'Continue',
    
    // Admin
    'admin.login': 'Admin Login',
    'admin.email': 'Email',
    'admin.password': 'Password',
    'admin.signin': 'Sign In',
    'admin.dashboard': 'Admin Dashboard',
    'admin.crowd_management': 'Crowd Status Management',
    'admin.gallery_management': 'Gallery Management',
    'admin.update_status': 'Update Status',
    'admin.add_image': 'Add Image',
    'admin.location': 'Location',
    'admin.status': 'Status',
    'admin.low': 'Low',
    'admin.medium': 'Medium',
    'admin.high': 'High',
    'admin.save': 'Save',
  },
  hi: {
    // Header
    'app.title': 'शारावणी मेला एमएमसी 25',
    
    // Navigation
    'nav.home': 'होम',
    'nav.gallery': 'गैलरी',
    'nav.events': 'कार्यक्रम',
    'nav.crowd_status': 'भीड़ स्थिति',
    'nav.admin': 'प्रशासक पहुंच',
    'nav.photo_contest': 'फोटो प्रतियोगिता',
    'nav.facilities': 'सुविधाएं',
    'nav.change_language': 'भाषा बदलें',
    
    // Home sections
    'home.photo_contest': 'फोटो प्रतियोगिता',
    'home.pic_of_day': 'आज की तस्वीर',
    'home.free_entry': 'निःशुल्क प्रवेश',
    'home.submit_entry': 'अपनी प्रविष्टि जमा करें',
    'home.daily_winner': 'दैनिक विजेता',
    'home.participate': 'भाग लें',
    'home.live_aarti': 'लाइव आरती और भीड़ स्थिति',
    'home.events': 'शारावणी मेला कार्यक्रम',
    'home.facilities': 'सुविधाएं और संपर्क',
    
    // Live section
    'live.virtual_pooja': 'वर्चुअल पूजा',
    'live.live_darshan': 'लाइव दर्शन',
    'live.crowd_status': 'भीड़ स्थिति',
    
    // Facilities
    'facility.route': 'मेला मार्ग',
    'facility.gallery': 'गैलरी',
    'facility.contacts': 'केंद्रीकृत संपर्क',
    'facility.ambulance': 'एम्बुलेंस',
    'facility.police': 'पुलिस स्टेशन',
    'facility.control_room': 'नियंत्रण कक्ष',
    'facility.drinking_water': 'पेयजल',
    'facility.toilet': 'शौचालय',
    'facility.bathroom': 'स्नानगृह',
    'facility.rest_room': 'विश्राम कक्ष',
    'facility.dharamshala': 'धर्मशाला',
    'facility.parking': 'पार्किंग',
    'facility.health_centre': 'स्वास्थ्य केंद्र',
    'facility.shivir': 'शिविर',
    'facility.atm': 'एटीएम',
    'facility.fire_brigade': 'अग्निशमन दल',
    
    // Language selection
    'lang.select': 'भाषा चुनें',
    'lang.english': 'English',
    'lang.hindi': 'हिंदी',
    'lang.continue': 'जारी रखें',
    
    // Admin
    'admin.login': 'प्रशासक लॉगिन',
    'admin.email': 'ईमेल',
    'admin.password': 'पासवर्ड',
    'admin.signin': 'साइन इन',
    'admin.dashboard': 'प्रशासक डैशबोर्ड',
    'admin.crowd_management': 'भीड़ स्थिति प्रबंधन',
    'admin.gallery_management': 'गैलरी प्रबंधन',
    'admin.update_status': 'स्थिति अपडेट करें',
    'admin.add_image': 'छवि जोड़ें',
    'admin.location': 'स्थान',
    'admin.status': 'स्थिति',
    'admin.low': 'कम',
    'admin.medium': 'मध्यम',
    'admin.high': 'अधिक',
    'admin.save': 'सेव करें',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language') as 'en' | 'hi';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: 'en' | 'hi') => {
    setLanguage(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
