
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  t: (key: string) => string;
  showLanguageSelector: boolean;
  setShowLanguageSelector: (show: boolean) => void;
}

const translations = {
  en: {
    // Main sections
    'facilities': 'Facilities',
    'contacts': 'Emergency Contacts',
    'live_aarti': 'Live Aarti & Events',
    'photo_contest': 'Photo Contest',
    'pic_of_day': 'Pic of the Day',
    'weather': 'Weather',
    'crowd_status': 'Crowd Status',
    
    // Facilities
    'mela_route': 'Mela Route',
    'centralised_contact': 'Contact Center',
    'gallery': 'Gallery',
    'atm': 'ATM',
    'drinking_water': 'Drinking Water',
    'toilet': 'Toilet',
    'bathroom': 'Bathroom',
    'rest_room': 'Rest Room',
    'dharamshala': 'Dharamshala',
    'shivir': 'Shivir',
    'health_centre': 'Health Centre',
    'parking': 'Parking',
    
    // Emergency contacts
    'ambulance': 'Ambulance',
    'control_room': 'Control Room',
    'help_desk': 'Help Desk',
    'tap_to_call': 'Tap to call',
    
    // Actions
    'navigate': 'Navigate',
    'participate': 'Participate Now',
    'submit_entry': 'Submit your best shots',
    
    // Live Aarti
    'live_darshan': 'Live Darshan',
    'event_schedule': 'Event Schedule',
    'crowd_status': 'Crowd Status',
    'history': 'History',
    
    // Language selection
    'Select language/भाषा चयन करें': 'Select Language',
    'English': 'English',
    'हिन्दी': 'हिन्दी',
    
    // Admin
    'admin.low': 'Low',
    'admin.medium': 'Medium',
    'admin.high': 'High'
  },
  hi: {
    // Main sections
    'facilities': 'सुविधाएं',
    'contacts': 'आपातकालीन संपर्क',
    'live_aarti': 'लाइव आरती और कार्यक्रम',
    'photo_contest': 'फोटो प्रतियोगिता',
    'pic_of_day': 'आज की तस्वीर',
    'weather': 'मौसम',
    'crowd_status': 'भीड़ की स्थिति',
    
    // Facilities
    'mela_route': 'मेला मार्ग',
    'centralised_contact': 'संपर्क केंद्र',
    'gallery': 'गैलरी',
    'atm': 'एटीएम',
    'drinking_water': 'पीने का पानी',
    'toilet': 'शौचालय',
    'bathroom': 'स्नानघर',
    'rest_room': 'विश्राम कक्ष',
    'dharamshala': 'धर्मशाला',
    'shivir': 'शिविर',
    'health_centre': 'स्वास्थ्य केंद्र',
    'parking': 'पार्किंग',
    
    // Emergency contacts
    'ambulance': 'एम्बुलेंस',
    'control_room': 'नियंत्रण कक्ष',
    'help_desk': 'सहायता डेस्क',
    'tap_to_call': 'कॉल करने के लिए टैप करें',
    
    // Actions
    'navigate': 'नेविगेट करें',
    'participate': 'अभी भाग लें',
    'submit_entry': 'अपनी बेहतरीन तस्वीरें भेजें',
    
    // Live Aarti
    'live_darshan': 'लाइव दर्शन',
    'event_schedule': 'कार्यक्रम सूची',
    'crowd_status': 'भीड़ की स्थिति',
    'history': 'इतिहास',
    
    // Language selection
    'Select language/भाषा चयन करें': 'भाषा चुनें',
    'English': 'अंग्रेजी',
    'हिन्दी': 'हिन्दी',
    
    // Admin
    'admin.low': 'कम',
    'admin.medium': 'मध्यम',
    'admin.high': 'अधिक'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
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
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
