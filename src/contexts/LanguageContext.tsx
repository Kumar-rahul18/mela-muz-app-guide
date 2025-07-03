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
    app_title: 'Shravani Mela Muzaffarpur',
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
    shiv_bhajan: 'Shiv Bhajan',
    history: 'History',
    contacts: 'Emergency Contacts',
    admin: 'Admin Panel',
    change_language: 'Change Language',
    'Select language/भाषा चयन करें': 'Select Language',
    'English': 'English',
    'हिन्दी': 'हिन्दी',
    // Vehicle Admin Panel
    vehicle_admin_panel: 'Vehicle Admin Panel',
    manage_vehicle_registrations: 'Manage vehicle registrations',
    register_vehicle: 'Register Vehicle',
    search_vehicle: 'Search Vehicle',
    register_new_vehicle: 'Register New Vehicle',
    register_new_vehicle_desc: 'Fill out the form below to register a new vehicle',
    search_vehicle_desc: 'Search for registered vehicles by ID or phone number',
    // Facility Descriptions
    atm_desc: 'ATM and banking facilities for your convenience',
    paid_hotels_desc: 'Comfortable accommodation options near the mela grounds',
    parking_desc: 'Secure parking facilities for vehicles',
    bhandara_desc: 'Free food service and community kitchen',
    drinking_water_desc: 'Clean drinking water stations',
    toilet_desc: 'Public toilet facilities',
    bathroom_desc: 'Bathroom and washing facilities',
    rest_room_desc: 'Rest areas and relaxation spaces',
    dharamshala_desc: 'Traditional accommodation facilities',
    shivir_desc: 'Camp and temporary stay arrangements',
    health_centre_desc: 'Medical facilities and health services',
    mela_route_desc: 'Route information and directions to the mela',
    // Location Errors
    location_timeout_error: 'Turn on your location/internet and try again',
    location_denied_error: 'Location access denied. Please check app permissions in device settings.',
    location_unavailable_error: 'Turn on your location/internet and try again',
    getting_location: 'Getting your location...',
    location_required: 'Location access required to show distances',
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
    submitting: 'Submitting...',
    // Attractions
    attractions: 'Attractions',
    get_directions: 'Get Directions',
    litchi_gardens: 'Litchi Gardens',
    litchi_gardens_desc: 'Muzaffarpur is famously known as the "Litchi Kingdom." Vast orchards—especially in Mushahari, Jhapaha, and Bochaha—produce over 300,000 tonnes of litchi annually. Visiting in May–June during harvest season is a feast for the senses.',
    garibnath_temple: 'Baba Garibnath Temple (Garib Sthan)',
    garibnath_temple_desc: 'Garibnath Temple is known as the "Deoghar of Bihar" due to its deep spiritual significance and divine Shiva lingam. Thousands of devotees visit during Shravan and Mahashivratri to offer holy water and seek blessings from Lord Shiva.',
    jubba_sahni_park: 'Jubba Sahni Park',
    jubba_sahni_park_desc: 'This tranquil public park, named after a freedom fighter, offers shaded walkways and open spaces for families and leisurely evenings. Perfect for spending good time with friends',
    ramchandra_museum: 'Ramchandra Shahi Museum',
    ramchandra_museum_desc: 'Located near the park, this museum features regional artifacts: sculptures (like Ashtadik Pal, Manasa Nag), coins, manuscripts, utensils—giving a glimpse into local history.',
    khudiram_memorial: 'Khudiram Bose Memorial',
    khudiram_memorial_desc: 'A tribute to the 18-year-old Bengali revolutionary executed in 1908; the memorial stands near the site of his trial and death, significant to India\'s freedom struggle.',
    motijheel: 'Motijheel',
    motijheel_desc: 'From getting it/'s name from the local netizens to becoming a perfect cinematic location and towers all around makes it look perfect during dusk.',
    feedback: 'Feedback',
  },
  hi: {
    app_title: 'श्रावणी मेला मुजफ्फरपुर',
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
    shiv_bhajan: 'शिव भजन',
    history: 'इतिहास',
    contacts: 'आपातकालीन संपर्क',
    admin: 'एडमिन पैनल',
    change_language: 'भाषा बदलें',
    'Select language/भाषा चयन करें': 'भाषा चयन करें',
    'English': 'अंग्रेजी',
    'हिन्दी': 'हिन्दी',
    // Vehicle Admin Panel
    vehicle_admin_panel: 'वाहन एडमिन पैनल',
    manage_vehicle_registrations: 'वाहन पंजीकरण प्रबंधन',
    register_vehicle: 'वाहन पंजीकरण',
    search_vehicle: 'वाहन खोजें',
    register_new_vehicle: 'नया वाहन पंजीकृत करें',
    register_new_vehicle_desc: 'नया वाहन पंजीकृत करने के लिए नीचे दिया गया फॉर्म भरें',
    search_vehicle_desc: 'आईडी या फोन नंबर द्वारा पंजीकृत वाहनों की खोज करें',
    // Facility Descriptions
    atm_desc: 'आपकी सुविधा के लिए एटीएम और बैंकिंग सुविधाएं',
    paid_hotels_desc: 'मेला मैदान के पास आरामदायक आवास विकल्प',
    parking_desc: 'वाहनों के लिए सुरक्षित पार्किंग सुविधाएं',
    bhandara_desc: 'मुफ्त भोजन सेवा और सामुदायिक रसोई',
    drinking_water_desc: 'स्वच्छ पेयजल स्टेशन',
    toilet_desc: 'सार्वजनिक शौचालय सुविधाएं',
    bathroom_desc: 'स्नानघर और धुलाई सुविधाएं',
    rest_room_desc: 'आराम क्षेत्र और विश्राम स्थान',
    dharamshala_desc: 'पारंपरिक आवास सुविधाएं',
    shivir_desc: 'शिविर और अस्थायी निवास व्यवस्था',
    health_centre_desc: 'चिकित्सा सुविधाएं और स्वास्थ्य सेवाएं',
    mela_route_desc: 'मेला के लिए मार्ग जानकारी और दिशा निर्देश',
    // Location Errors
    location_timeout_error: 'अपना लोकेशन/इंटरनेट चालू करें और पुनः प्रयास करें',
    location_denied_error: 'लोकेशन एक्सेस से इनकार किया गया। कृपया डिवाइस सेटिंग्स में ऐप अनुमतियां जांचें।',
    location_unavailable_error: 'अपना लोकेशन/इंटरनेट चालू करें और पुनः प्रयास करें',
    getting_location: 'आपका स्थान प्राप्त कर रहे हैं...',
    location_required: 'दूरी दिखाने के लिए स्थान पहुंच आवश्यक है',
    // Crowd Status
    current_crowd_level: 'वर्तमान भीड़ स्तर',
    crowd_levels: 'भीड़ के स्तर',
    low: 'कम',
    medium: 'मध्यम',
    high: 'अधिक',
    live_status_by_location: 'स्थान के अनुसार लाइव स्थिति',
    tips_for_better_experience: 'बेहतर अनुभव के लिए सुझाव',
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
    show_nearby: 'पास की दिखाएं',
    show_all: 'सभी दिखाएं',
    go_to_facility: 'सुविधा पर जाएं',
    lost_items: 'खोई वस्तुएं',
    found_items: 'मिली वस्तुएं',
    submit_item: 'वस्तु जमा करें',
    view_items: 'वस्तुएं देखें',
    no_lost_items: 'कोई खोई वस्तु नहीं मिली।',
    no_found_items: 'कोई मिली वस्तु नहीं मिली।',
    be_first_to_submit: 'पहले {type} वस्तु जमा करने वाले बनें!',
    submit_your_entry: 'अपनी प्रविष्टि जमा करें',
    share_best_moments: 'अपने बेहतरीन श्रावणी मेला पल साझा करें और नकद पुरस्कार जीतें',
    photo_description: 'फोटो विवरण (माहौल के बारे में बताएं)',
    upload_contest_photo: 'अपनी प्रतियोगिता फोटो अपलोड करें',
    submit_entry_button: 'प्रविष्टि जमा करें',
    submitting: 'जमा कर रहे हैं...',
    attractions: 'आकर्षण',
    get_directions: 'दिशा निर्देश',
    litchi_gardens: 'लीची बगान',
    litchi_gardens_desc: 'मुजफ्फरपुर को "लीची राज्य" के नाम से जाना जाता है। विशाल बगान—विशेष रूप से मुशहरी, झपाहा और बोचाहा में—सालाना 300,000 टन से अधिक लीची का उत्पादन करते हैं। मई-जून में फसल के मौसम में जाना इंद्रियों के लिए एक दावत है।',
    garibnath_temple: 'बाबा गरीबनाथ मंदिर (गरीब स्थान)',
    garibnath_temple_desc: 'शहर के केंद्र में एक पवित्र भगवान शिव मंदिर, जिसे बिहार के "देवघर" के रूप में भी जाना जाता है। एक खून बहने वाले पीपल के पेड़ में खोजे गए शिवलिंग के चारों ओर बना, यह श्रावण (जुलाई-अगस्त) के दौरान विशेष रूप से जीवंत रहता है।',
    jubba_sahni_park: 'जुब्बा साहनी पार्क',
    jubba_sahni_park_desc: 'एक स्वतंत्रता सेनानी के नाम पर रखा गया यह शांत सार्वजनिक पार्क, छायादार पैदल रास्ते, खुले स्थान प्रदान करता है—परिवारों और आरामदायक शामों के लिए बिल्कुल सही।',
    ramchandra_museum: 'रामचंद्र शाही संग्रहालय',
    ramchandra_museum_desc: 'पार्क के पास स्थित, इस संग्रहालय में क्षेत्रीय कलाकृतियां हैं: मूर्तियां (जैसे अष्टदिक पाल, मनसा नाग), सिक्के, पांडुलिपियां, बर्तन—स्थानीय इतिहास की एक झलक देते हुए।',
    khudiram_memorial: 'खुदीराम बोस मेमोरियल',
    khudiram_memorial_desc: '1908 में फांसी दिए गए 18 वर्षीय बंगाली क्रांतिकारी को श्रद्धांजलि; स्मारक उनके मुकदमे और मृत्यु के स्थान के पास खड़ा है, जो भारत के स्वतंत्रता संग्राम के लिए महत्वपूर्ण है।',
    motijheel: 'मोतीझील',
    motijheel_desc: 'स्थानीय लोगों से अपना नाम पाने से लेकर एक परफेक्ट सिनेमैटिक स्थान बनने तक, और चारों ओर फैले टावर इसे संध्या समय में एकदम सुंदर बना देते हैं।',
    feedback: 'प्रतिक्रिया',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'en';
  });

  const [showLanguageSelector, setShowLanguageSelector] = useState(() => {
    return !localStorage.getItem('app-language');
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
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
