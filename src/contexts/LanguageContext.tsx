
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
    app_title: 'Shravani Mela 2024',
    home: 'Home',
    facilities: 'Facilities',
    gallery: 'Gallery',
    events: 'Events',
    contact: 'Contact',
    mela_route: 'Mela Route',
    paid_hotels: 'Hotels',
    atm: 'ATM',
    drinking_water: 'Water',
    toilet: 'Toilet',
    bathroom: 'Bathroom',
    rest_room: 'Rest Room',
    dharamshala: 'Dharamshala',
    shivir: 'Shivir',
    health_centre: 'Health',
    parking: 'Parking',
    lost_found: 'Lost & Found',
    bhandaras: 'Bhandaras',
    centralised_contact: 'Contact',
    ambulance: 'Ambulance',
    weather: 'Weather',
    control_room: 'Control Room',
    help_desk: 'Help Desk',
    tap_to_call: 'Tap to call',
    photo_contest: 'Photo Contest',
    submit_entry: 'Submit your best Mela photos and win prizes!',
    participate: 'Participate Now',
    pic_of_day: 'Pictures of the Day',
    mela_quiz: 'Mela Quiz',
    crowd_status: 'Crowd Status',
    virtual_pooja: 'Virtual Pooja',
    live_darshan: 'Live Darshan',
    history: 'History',
    contacts: 'Emergency Contacts',
    admin: 'Admin Panel',
    change_language: 'Change Language',
    'Select language/भाषा चयन करें': 'Select Language',
    'English': 'English',
    'हिन्दी': 'हिन्दी'
  },
  hi: {
    app_title: 'श्रावणी मेला 2024',
    home: 'होम',
    facilities: 'सुविधाएं',
    gallery: 'गैलरी',
    events: 'कार्यक्रम',
    contact: 'संपर्क',
    mela_route: 'मेला मार्ग',
    paid_hotels: 'होटल',
    atm: 'एटीएम',
    drinking_water: 'पानी',
    toilet: 'शौचालय',
    bathroom: 'स्नानघर',
    rest_room: 'विश्राम कक्ष',
    dharamshala: 'धर्मशाला',
    shivir: 'शिविर',
    health_centre: 'स्वास्थ्य',
    parking: 'पार्किंग',
    lost_found: 'खोया पाया',
    bhandaras: 'भंडारे',
    centralised_contact: 'संपर्क',
    ambulance: 'एम्बुलेंस',
    weather: 'मौसम',
    control_room: 'नियंत्रण कक्ष',
    help_desk: 'सहायता डेस्क',
    tap_to_call: 'कॉल करने के लिए टैप करें',
    photo_contest: 'फोटो प्रतियोगिता',
    submit_entry: 'अपनी बेहतरीन मेला तस्वीरें जमा करें और पुरस्कार जीतें!',
    participate: 'अभी भाग लें',
    pic_of_day: 'आज की तस्वीरें',
    mela_quiz: 'मेला क्विज',
    crowd_status: 'भीड़ की स्थिति',
    virtual_pooja: 'वर्चुअल पूजा',
    live_darshan: 'लाइव दर्शन',
    history: 'इतिहास',
    contacts: 'आपातकालीन संपर्क',
    admin: 'एडमिन पैनल',
    change_language: 'भाषा बदलें',
    'Select language/भाषा चयन करें': 'भाषा चयन करें',
    'English': 'अंग्रेजी',
    'हिन्दी': 'हिन्दी'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if language has been set before, if not show selector
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'en';
  });

  const [showLanguageSelector, setShowLanguageSelector] = useState(() => {
    // Only show language selector if no language has been selected before
    return !localStorage.getItem('app-language');
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
    // Once language is set, don't show selector automatically anymore
    setShowLanguageSelector(false);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
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
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
