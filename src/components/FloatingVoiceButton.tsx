
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FloatingVoiceButton: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const serviceKeywords: Record<string, string[]> = {
     'drinking-water': [
      'water', 'पानी','वाटर', 'वाट', 'drinking water', 'पीने का पानी', 'प्यास', 'thirst', 'पीने', 'जल', 'पेय जल', 'पेजल',
      'वाटर', 'ड्रिंकिंग वाटर', 'ड्रिंक वाटर', 'बोतल पानी', 'पानी कहां है'
    ],
    'toilet': [
      'toilet', 'टॉयलेट', 'washroom','वाशरूम','wash room', 'शौचालय', 'संडास', 'प्रसाधन', 'लेट्रिन', 'पखाना', 'पैखाना',
      'हगने', 'हगना', 'मूत्र', 'पेशाब', 'पेशाब घर', 'जाना है', 'toilat', 'latrine'
    ],
    'bathroom': [
      'bathroom', 'बाथरूम', 'नहाने', 'स्नान', 'bath', 'shower', 'नहाने की जगह', 'स्नान घर',
      'नहाना', 'नहा लो', 'बाथ', 'बाथरुम'
    ],
    'shivir': [
      'shivir', 'शिविर', 'camp', 'camping', 'कैंप', 'आराम', 'ठहरने', 'रुकने', 'विश्राम',
      'आश्रय', 'अस्थायी निवास', 'तंबू', 'रात रुकने', 'restroom', 'rest room', 'vishram','रेस्टरूम'
    ],
    'health-centre': [
      'health', 'hospital','हॉस्पिटल', 'अस्पताल', 'हेल्थ', 'medical', 'doctor', 'first aid', 'दर्द', 'बुखार',
      'कटना', 'कट', 'छिलना', 'छिल', 'डॉक्टर', 'इलाज', 'दवा', 'medicine', 'चोट', 'हेल्थ सेंटर', 'मेडिकल','ambulance'
    ],
    'bhandara': [
      'bhandara', 'भंडारा', 'लंगर', 'निःशुल्क भोजन', 'जन सेवा भोजन', 'प्रसाद वितरण', 'free meal',
      'फ्री खाना', 'meal', 'खाना', 'भोजन', 'प्रसाद', 'खाना मिल रहा है', 'भंडारा कहां है'
    ],
    'parking': [
      'parking', 'पार्किंग', 'गाड़ी', 'car', 'vehicle', 'वाहन', 'कार', 'बस', 'यात्री वाहन',
      'मोटरसाइकिल', 'बाइक', 'व्हीकल', 'गाड़ी खड़ी करना', 'park', 'parking area'
    ],
    'paid-hotels': [
      'hotel', 'होटल', 'paid hotel', 'पेड होटल', 'पैसे वाला होटल', 'booking', 'paid stay', 'होटल बुकिंग'
    ],
    'atm': [
      'atm', 'एटीएम', 'cash', 'पैसे', 'money', 'bank', 'बैंक', 'पैसे निकालना', 'atm machine', 'कैश'
    ],
    'dharamshala': [
      'dharamshala', 'धर्मशाला', 'shelter', 'निवास', 'stay', 'ठहरने की जगह', 'रुकने की जगह'
    ],
    'centralised-contact': [
      'contact', 'संपर्क', 'help', 'मदद', 'phone', 'फोन', 'call','contact number', 'फोन नंबर', 'सहायता','helpdesk',
      'centralised contact', 'centralized contact', 'सेंट्रलाइज्ड कॉन्टैक्ट', 'केंद्रीकृत संपर्क', 'emergency contact',
      'इमरजेंसी कॉन्टैक्ट', 'आपातकालीन संपर्क', 'contacts', 'कॉन्टैक्ट्स', 'संपर्क सूची'
    ],
    'emergency-contacts': [
      'emergency', 'इमरजेंसी', 'आपातकाल', 'urgent', 'ambulance', 'एम्बुलेंस', 'control room', 'कंट्रोल रूम',
      'help desk', 'हेल्प डेस्क', 'emergency contact', 'इमरजेंसी कॉन्टैक्ट', 'आपातकालीन संपर्क', '108', '102',
      'emergency number', 'इमरजेंसी नंबर', 'आपातकालीन नंबर'
    ],
    'virtual-pooja': [
      'गरीबनाथ', 'गरीबनाथ धाम', 'garibnath', 'garibnath dham', 'वर्चुअल पूजा',
      'online pooja', 'ऑनलाइन पूजा', 'pooja', 'पूजा', 'prayer', 'प्रार्थना', 'पूजन', 'भगवान'
    ],
    'live-darshan': [
      'live darshan', 'लाइव दर्शन', 'darshan', 'दर्शन', 'live', 'लाइव', 'online darshan', 'streaming', 'stream'
    ],
    'crowd-status': [
      'crowd status', 'crowd', 'भीड़', 'भीड़ की स्थिति', 'rush', 'रश', 'भीड़भाड़', 'अधिक भीड़', 'जमावड़ा'
    ],
    'gallery': [
      'gallery', 'गैलरी', 'photos', 'फोटो', 'pictures', 'तस्वीरें', 'फोटो गैलरी', 'इमेज'
    ],
    'quiz': [
      'quiz', 'क्विज', 'mela quiz', 'मेला क्विज', 'questions', 'प्रश्न', 'प्रश्नोत्तरी', 'क्विज प्रतियोगिता'
    ],
    'lost-found': [
      'lost found', 'lost and found', 'खोया पाया', 'lost', 'खोया', 'खो', 'found', 'पाया',
      'भूल', 'भुला', 'सामान खो गया', 'lost item', 'lost person', 'something lost'
    ],
    'photo-contest': [
      'photo contest', 'फोटो कॉन्टेस्ट', 'contest', 'कॉन्टेस्ट', 'competition', 'प्रतियोगिता', 'फोटो प्रतियोगिता'
    ],
    'events': [
      'events', 'इवेंट्स', 'event', 'इवेंट', 'program', 'प्रोग्राम', 'कार्यक्रम', 'इवेंट लिस्ट'
    ],
    'history': [
      'history', 'इतिहास', 'mela history', 'मेला इतिहास', 'background', 'इतिहास क्या है', 'इतिहासिक जानकारी'
    ]
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'hi-IN';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          }
        }
        if (finalTranscript) {
          handleVoiceSearch(finalTranscript);
        }
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleVoiceSearch = (transcript: string) => {
    const lowerTranscript = transcript.toLowerCase().trim();
    let bestMatch = null;
    let bestScore = 0;

    for (const [serviceType, keywords] of Object.entries(serviceKeywords)) {
      for (const keyword of keywords) {
        const lowerKeyword = keyword.toLowerCase().trim();
        let score = 0;

        if (lowerTranscript === lowerKeyword) {
          score = 100;
        } else if (lowerTranscript.includes(lowerKeyword)) {
          score = 80 + (lowerKeyword.length / lowerTranscript.length) * 20;
        } else if (lowerKeyword.includes(' ')) {
          const transcriptWords = lowerTranscript.split(/\s+/);
          const keywordWords = lowerKeyword.split(/\s+/);
          const matchedWords = keywordWords.filter(word =>
            transcriptWords.some(tw =>
              tw === word || (tw.length > 2 && word.includes(tw)) || (word.length > 2 && tw.includes(word))
            )
          );
          score = matchedWords.length === keywordWords.length
            ? 70
            : 40 * (matchedWords.length / keywordWords.length);
        } else if (!lowerTranscript.includes(' ') && !lowerKeyword.includes(' ') &&
          lowerTranscript.length > 3 && lowerKeyword.length > 3) {
          const similarity = calculateSimilarity(lowerTranscript, lowerKeyword);
          if (similarity > 0.75) {
            score = 50 * similarity;
          }
        }

        if (score > bestScore && score > 40) {
          bestScore = score;
          bestMatch = { serviceType, keyword, score };
        }
      }
    }

    if (bestMatch) {
      navigateToService(bestMatch.serviceType, bestMatch.keyword);
    } else {
      toast({
        title: "Service Not Found",
        description: "Please try saying a clear service name like 'पानी', 'toilet', 'parking', 'गरीबनाथ धाम'",
        duration: 5000,
        variant: "destructive",
      });
    }
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const editDistance = calculateEditDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - (editDistance / maxLength);
  };

  const calculateEditDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }

    return matrix[str2.length][str1.length];
  };

  const navigateToService = (serviceType: string, keyword: string) => {
    const facilityTypes = ['paid-hotels', 'atm', 'drinking-water', 'toilet', 'bathroom', 'dharamshala', 'shivir', 'health-centre', 'parking', 'centralised-contact', 'bhandara'];

    if (serviceType === 'centralised-contact' || serviceType === 'emergency-contacts') {
      // Special handling for contact section - navigate to Index with contacts showing
      navigate('/', { state: { showContacts: true } });
      toast({
        title: "Contacts Found!",
        description: "Showing centralized contact information",
        duration: 2000,
      });
    } else if (facilityTypes.includes(serviceType)) {
      navigate(`/facility/${serviceType}?showMap=true`);
      toast({
        title: "Facility Found!",
        description: `Taking you to ${serviceType.replace('-', ' ')} facilities`,
        duration: 2000,
      });
    } else {
      const routeMap: { [key: string]: string } = {
        'virtual-pooja': '/virtual-pooja',
        'live-darshan': '/live-darshan',
        'crowd-status': '/crowd-status',
        'bathroom': '/bathroom',
        'gallery': '/gallery',
        'quiz': '/mela-quiz',
        'lost-found': '/lost-found',
        'photo-contest': '/photo-contest',
        'events': '/events',
        'history': '/history'
      };

      const route = routeMap[serviceType];
      if (route) {
        navigate(route);
        toast({
          title: "Service Found!",
          description: `Taking you to ${serviceType.replace('-', ' ')}`,
          duration: 2000,
        });
      }
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
      toast({
        title: "Listening...",
        description: "कृपया कोई भी सेवा का नाम हिंदी या English में बोलें",
        duration: 2000,
      });
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <Button
        onClick={isListening ? stopListening : startListening}
        className={`${
          isListening 
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25'
        } text-white w-20 h-20 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 p-0 flex flex-col items-center justify-center`}
        size="lg"
      >
        <div className="flex flex-col items-center space-y-1">
          {isListening ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
          <span className="text-xs font-medium leading-tight">
            {isListening ? 'Stop' : 'पूछें'}
          </span>
        </div>
      </Button>
    </div>
  );
};

export default FloatingVoiceButton;
