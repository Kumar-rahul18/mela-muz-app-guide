
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
    live_aarti: 'Live Aarti',
    history: 'History',
    contacts: 'Emergency Contacts',
    admin: 'Admin Panel',
    change_language: 'Change Language',
    'Select language/भाषा चयन करें': 'Select Language',
    'English': 'English',
    'हिन्दी': 'हिन्दी',
    // Crowd Status
    current_crowd_level: 'Current Crowd Level',
    crowd_levels: 'Crowd Levels',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    live_status_by_location: 'Live Status by Location',
    tips_for_better_experience: 'Tips for Better Experience',
    // Quiz
    quiz_registration: 'Quiz Registration',
    full_name: 'Full Name',
    phone_number: 'Phone Number',
    enter_name: 'Enter your name',
    enter_phone: 'Enter your phone number',
    quiz_rules: 'Quiz Rules:',
    quiz_rule_1: '• 10 questions about Shravani Mela',
    quiz_rule_2: '• 10 minutes time limit',
    quiz_rule_3: '• Only one attempt per phone number',
    quiz_rule_4: '• Results will be saved automatically',
    start_quiz: 'Start Quiz',
    question_of: 'Question {current} of {total}',
    previous: 'Previous',
    skip_question: 'Skip Question',
    next_question: 'Next Question',
    submit_quiz: 'Submit Quiz',
    quiz_completed: 'Quiz Completed!',
    your_score: 'Your Score',
    rank: 'Rank #',
    your_position: 'Your Position',
    view_leaderboard: 'View Leaderboard',
    back_to_home: 'Back to Home',
    leaderboard: 'Leaderboard',
    // Facility Route
    show_nearby: 'Show Nearby',
    show_all: 'Show All',
    go_to_facility: 'Go to Facility',
    // Lost Found
    lost_items: 'Lost Items',
    found_items: 'Found Items',
    submit_item: 'Submit Item',
    view_items: 'View Items',
    no_lost_items: 'No lost items found.',
    no_found_items: 'No found items found.',
    be_first_to_submit: 'Be the first to submit a {type} item!',
    // Photo Contest
    submit_your_entry: 'Submit Your Entry',
    share_best_moments: 'Share your best Shravani Mela moments and win cash prizes',
    photo_description: 'Photo Description (Tell us about the ambience)',
    upload_contest_photo: 'Upload Your Contest Photo',
    submit_entry_button: 'Submit Entry',
    submitting: 'Submitting...'
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
    mela_quiz: 'मेला प्रश्नोत्तरी',
    crowd_status: 'भीड़ की स्थिति',
    virtual_pooja: 'वर्चुअल पूजा',
    live_darshan: 'लाइव दर्शन',
    live_aarti: 'लाइव आरती',
    history: 'इतिहास',
    contacts: 'आपातकालीन संपर्क',
    admin: 'एडमिन पैनल',
    change_language: 'भाषा बदलें',
    'Select language/भाषा चयन करें': 'भाषा चयन करें',
    'English': 'अंग्रेजी',
    'हिन्दी': 'हिन्दी',
    // Crowd Status
    current_crowd_level: 'वर्तमान भीड़ स्तर',
    crowd_levels: 'भीड़ के स्तर',
    low: 'कम',
    medium: 'मध्यम',
    high: 'अधिक',
    live_status_by_location: 'स्थान के अनुसार लाइव स्थिति',
    tips_for_better_experience: 'बेहतर अनुभव के लिए सुझाव',
    // Quiz
    quiz_registration: 'प्रश्नोत्तरी पंजीकरण',
    full_name: 'पूरा नाम',
    phone_number: 'फोन नंबर',
    enter_name: 'अपना नाम दर्ज करें',
    enter_phone: 'अपना फोन नंबर दर्ज करें',
    quiz_rules: 'प्रश्नोत्तरी के नियम:',
    quiz_rule_1: '• श्रावणी मेला के बारे में 10 प्रश्न',
    quiz_rule_2: '• 10 मिनट की समय सीमा',
    quiz_rule_3: '• प्रति फोन नंबर केवल एक प्रयास',
    quiz_rule_4: '• परिणाम स्वचालित रूप से सहेजे जाएंगे',
    start_quiz: 'प्रश्नोत्तरी शुरू करें',
    question_of: 'प्रश्न {current} का {total}',
    previous: 'पिछला',
    skip_question: 'प्रश्न छोड़ें',
    next_question: 'अगला प्रश्न',
    submit_quiz: 'प्रश्नोत्तरी जमा करें',
    quiz_completed: 'प्रश्नोत्तरी पूर्ण!',
    your_score: 'आपका स्कोर',
    rank: 'रैंक #',
    your_position: 'आपकी स्थिति',
    view_leaderboard: 'लीडरबोर्ड देखें',
    back_to_home: 'होम पर वापस',
    leaderboard: 'लीडरबोर्ड',
    // Facility Route
    show_nearby: 'पास की दिखाएं',
    show_all: 'सभी दिखाएं',
    go_to_facility: 'सुविधा पर जाएं',
    // Lost Found
    lost_items: 'खोई वस्तुएं',
    found_items: 'मिली वस्तुएं',
    submit_item: 'वस्तु जमा करें',
    view_items: 'वस्तुएं देखें',
    no_lost_items: 'कोई खोई वस्तु नहीं मिली।',
    no_found_items: 'कोई मिली वस्तु नहीं मिली।',
    be_first_to_submit: 'पहले {type} वस्तु जमा करने वाले बनें!',
    // Photo Contest
    submit_your_entry: 'अपनी प्रविष्टि जमा करें',
    share_best_moments: 'अपने बेहतरीन श्रावणी मेला पल साझा करें और नकद पुरस्कार जीतें',
    photo_description: 'फोटो विवरण (माहौल के बारे में बताएं)',
    upload_contest_photo: 'अपनी प्रतियोगिता फोटो अपलोड करें',
    submit_entry_button: 'प्रविष्टि जमा करें',
    submitting: 'जमा कर रहे हैं...'
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
