
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
    // App title
    'app_title': 'Shravani Mela Guide',
    
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
    
    // Contact categories
    'district_admin': 'District Admin',
    'mmc_admin': 'MMC Admin',
    'general_contacts': 'General Contacts',
    
    // Actions
    'navigate': 'Navigate',
    'participate': 'Participate Now',
    'submit_entry': 'Submit your best shots',
    
    // Live Aarti
    'virtual_pooja': 'Virtual Pooja',
    'live_darshan': 'Live Darshan',
    'shiv_bhajan': 'Shiv Bhajan',
    'event_schedule': 'Event Schedule',
    'history': 'History',
    
    // Language selection
    'Select language/भाषा चयन करें': 'Select Language',
    'English': 'English',
    'हिन्दी': 'हिन्दी',
    
    // Admin
    'admin.low': 'Low',
    'admin.medium': 'Medium',
    'admin.high': 'High',
    
    // Weather
    'temperature': 'Temperature',
    'humidity': 'Humidity',
    'wind_speed': 'Wind Speed',
    'air_quality': 'Air Quality',
    'good': 'Good',
    'moderate': 'Moderate',
    'poor': 'Poor',
    'very_poor': 'Very Poor',
    'severe': 'Severe',

    // Quiz translations
    'mela_quiz': 'Mela Quiz',
    'quiz_registration': 'Mela Quiz Registration',
    'full_name': 'Full Name',
    'phone_number': 'Phone Number',
    'enter_name': 'Enter your full name',
    'enter_phone': 'Enter 10-digit phone number',
    'quiz_rules': 'Quiz Rules:',
    'quiz_rule_1': '• 10 questions about Baba Garibnath Dham & Shravani Mela',
    'quiz_rule_2': '• 10 minutes time limit',
    'quiz_rule_3': '• One attempt per phone number',
    'quiz_rule_4': '• Questions will auto-submit when time expires',
    'start_quiz': 'Start Quiz',
    'question_of': 'Question {current} of {total}',
    'previous': 'Previous',
    'next_question': 'Next Question',
    'submit_quiz': 'Submit Quiz',
    'skip_question': 'Skip Question',
    'quiz_completed': 'Quiz Completed!',
    'your_score': 'Your Score',
    'your_position': 'Your Position',
    'rank': 'Rank #',
    'view_leaderboard': 'View Leaderboard',
    'back_to_home': 'Back to Home',
    'leaderboard': 'Leaderboard'
  },
  hi: {
    // App title
    'app_title': 'श्रावणी मेला गाइड',
    
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
    
    // Contact categories
    'district_admin': 'जिला प्रशासन',
    'mmc_admin': 'एमएमसी प्रशासन',
    'general_contacts': 'सामान्य संपर्क',
    
    // Actions
    'navigate': 'नेविगेट करें',
    'participate': 'अभी भाग लें',
    'submit_entry': 'अपनी बेहतरीन तस्वीरें भेजें',
    
    // Live Aarti
    'virtual_pooja': 'वर्चुअल पूजा',
    'live_darshan': 'लाइव दर्शन',
    'shiv_bhajan': 'शिव भजन',
    'event_schedule': 'कार्यक्रम सूची',
    'history': 'इतिहास',
    
    // Language selection
    'Select language/भाषा चयन करें': 'भाषा चुनें',
    'English': 'अंग्रेजी',
    'हिन्दी': 'हिन्दी',
    
    // Admin
    'admin.low': 'कम',
    'admin.medium': 'मध्यम',
    'admin.high': 'अधिक',
    
    // Weather
    'temperature': 'तापमान',
    'humidity': 'आर्द्रता',
    'wind_speed': 'हवा की गति',
    'air_quality': 'वायु गुणवत्ता',
    'good': 'अच्छी',
    'moderate': 'मध्यम',
    'poor': 'खराब',
    'very_poor': 'बहुत खराब',
    'severe': 'गंभीर',

    // Quiz translations
    'mela_quiz': 'मेला प्रश्नोत्तरी',
    'quiz_registration': 'मेला प्रश्नोत्तरी पंजीकरण',
    'full_name': 'पूरा नाम',
    'phone_number': 'फोन नंबर',
    'enter_name': 'अपना पूरा नाम दर्ज करें',
    'enter_phone': '10 अंकों का फोन नंबर दर्ज करें',
    'quiz_rules': 'प्रश्नोत्तरी नियम:',
    'quiz_rule_1': '• बाबा गरीबनाथ धाम और श्रावणी मेला के बारे में 10 प्रश्न',
    'quiz_rule_2': '• 10 मिनट की समय सीमा',
    'quiz_rule_3': '• प्रति फोन नंबर एक प्रयास',
    'quiz_rule_4': '• समय समाप्त होने पर प्रश्न स्वचालित रूप से जमा हो जाएंगे',
    'start_quiz': 'प्रश्नोत्तरी शुरू करें',
    'question_of': 'प्रश्न {current} का {total}',
    'previous': 'पिछला',
    'next_question': 'अगला प्रश्न',
    'submit_quiz': 'प्रश्नोत्तरी जमा करें',
    'skip_question': 'प्रश्न छोड़ें',
    'quiz_completed': 'प्रश्नोत्तरी पूरी हुई!',
    'your_score': 'आपका स्कोर',
    'your_position': 'आपकी स्थिति',
    'rank': 'रैंक #',
    'view_leaderboard': 'लीडरबोर्ड देखें',
    'back_to_home': 'होम पर वापस',
    'leaderboard': 'लीडरबोर्ड'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const t = (key: string): string => {
    // Handle template strings with placeholders
    const template = translations[language][key as keyof typeof translations['en']] || key;
    return template;
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
