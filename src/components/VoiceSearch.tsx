
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceSearchProps {
  onFacilityFound?: (facilityType: string) => void;
  compact?: boolean;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onFacilityFound, compact = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Enhanced keywords mapping with more precise matching
  const serviceKeywords = {
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
      'कटना', 'कट', 'छिलना', 'छिल', 'डॉक्टर', 'इलाज', 'दवा', 'medicine', 'चोट', 'हेल्थ सेंटर', 'मेडिकल', 'ambulance'
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
      'live darshan', 'लाइव दर्शन', 'darshan', 'दर्शन', 'live', 'लाइव', 'online darshan', 'streaming', 'stream', 
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
        console.log('🎤 Voice recognition started');
        setIsListening(true);
      };
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }
        
        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);
        
        if (finalTranscript) {
          console.log('🎯 Final transcript:', finalTranscript);
          handleVoiceSearch(finalTranscript);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('❌ Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      };
      
      recognitionInstance.onend = () => {
        console.log('🔇 Voice recognition ended');
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Not Supported",
        description: "Voice search is not supported in this browser.",
        variant: "destructive",
      });
    }
  }, []);

  const handleVoiceSearch = (transcript: string) => {
    const cleanTranscript = transcript.toLowerCase().trim();
    console.log('🔍 Processing transcript:', cleanTranscript);
    
    // Find matches with improved algorithm
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [serviceType, keywords] of Object.entries(serviceKeywords)) {
      console.log(`🔍 Checking service: ${serviceType}`);
      
      for (const keyword of keywords) {
        const cleanKeyword = keyword.toLowerCase().trim();
        let score = 0;
        
        // Exact match (highest priority)
        if (cleanTranscript === cleanKeyword) {
          score = 100;
          console.log(`✅ Exact match found: "${cleanKeyword}" = ${score}`);
        }
        // Contains full keyword
        else if (cleanTranscript.includes(cleanKeyword)) {
          score = 90;
          console.log(`✅ Contains match found: "${cleanKeyword}" = ${score}`);
        }
        // Keyword contains transcript (partial match)
        else if (cleanKeyword.includes(cleanTranscript) && cleanTranscript.length > 2) {
          score = 80;
          console.log(`✅ Partial match found: "${cleanKeyword}" contains "${cleanTranscript}" = ${score}`);
        }
        // Word-by-word matching for multi-word phrases
        else {
          const transcriptWords = cleanTranscript.split(/\s+/);
          const keywordWords = cleanKeyword.split(/\s+/);
          
          let matchedWords = 0;
          for (const tWord of transcriptWords) {
            for (const kWord of keywordWords) {
              if (tWord === kWord || 
                  (tWord.length > 2 && kWord.includes(tWord)) ||
                  (kWord.length > 2 && tWord.includes(kWord))) {
                matchedWords++;
                break;
              }
            }
          }
          
          if (matchedWords > 0) {
            score = 60 * (matchedWords / Math.max(transcriptWords.length, keywordWords.length));
            console.log(`✅ Word match found: ${matchedWords}/${Math.max(transcriptWords.length, keywordWords.length)} words = ${score}`);
          }
        }
        
        if (score > bestScore && score > 30) { // Lower threshold for better matching
          bestScore = score;
          bestMatch = { serviceType, keyword, score };
          console.log(`🎯 New best match: ${serviceType} (${keyword}) = ${score}`);
        }
      }
    }
    
    if (bestMatch) {
      console.log('✅ Final best match:', bestMatch);
      navigateToService(bestMatch.serviceType, bestMatch.keyword);
    } else {
      console.log('❌ No match found for:', cleanTranscript);
      toast({
        title: "Service Not Found",
        description: "Please try saying a clear service name like 'पानी', 'toilet', 'contact', 'parking'",
        duration: 4000,
        variant: "destructive",
      });
    }
  };

  const navigateToService = (serviceType: string, keyword: string) => {
    console.log(`🚀 Navigating to service: ${serviceType}`);
    
    // Handle different navigation patterns
    const facilityTypes = ['paid-hotels', 'atm', 'drinking-water', 'toilet', 'bathroom', 'dharamshala', 'shivir', 'health-centre', 'parking', 'bhandara'];
    
    if (serviceType === 'centralised-contact' || serviceType === 'emergency-contacts') {
      // Special handling for contact section - navigate to Index with contacts showing
      navigate('/', { state: { showContacts: true } });
      toast({
        title: "Contacts Found!",
        description: "Showing centralized contact information",
        duration: 2000,
      });
    } else if (facilityTypes.includes(serviceType)) {
      // Navigate to facility with map view enabled
      navigate(`/facility/${serviceType}?showMap=true`);
      toast({
        title: "Facility Found!",
        description: `Taking you to ${serviceType.replace('-', ' ')} facilities`,
        duration: 2000,
      });
    } else {
      // Navigate to specific pages
      const routeMap: { [key: string]: string } = {
        'virtual-pooja': '/virtual-pooja',
        'live-darshan': '/live-darshan',
        'crowd-status': '/crowd-status',
        'bathroom':'/bathroom',
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
    
    if (onFacilityFound) {
      onFacilityFound(serviceType);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript('');
      recognition.start();
      toast({
        title: "Listening...",
        description: "Say any service name in Hindi or English",
        duration: 2000,
      });
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  if (compact) {
    return (
      <Button
        onClick={isListening ? stopListening : startListening}
        className={`${
          isListening 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white px-3 py-2 rounded-lg shadow-md text-sm`}
        size="sm"
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 mr-1" />
            <div className="flex flex-col items-start">
              <span className="text-xs leading-tight">Voice</span>
            </div>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 mr-1" />
            <div className="flex flex-col items-start">
              <span className="text-xs leading-tight">Voice</span>
              <span className="text-xs leading-tight opacity-90">Search all services</span>
            </div>
          </>
        )}
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <Button
        onClick={isListening ? stopListening : startListening}
        className={`${
          isListening 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white px-6 py-3 rounded-full shadow-lg`}
        size="lg"
      >
        {isListening ? (
          <>
            <MicOff className="w-5 h-5 mr-2" />
            Stop Listening
          </>
        ) : (
          <>
            <Mic className="w-5 h-5 mr-2" />
            Voice Search
          </>
        )}
      </Button>
      
      {transcript && (
        <div className="bg-gray-100 p-3 rounded-lg max-w-sm">
          <div className="flex items-center space-x-2 mb-1">
            <Volume2 className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">You said:</span>
          </div>
          <p className="text-sm text-gray-800">{transcript}</p>
        </div>
      )}
      
      <p className="text-xs text-gray-500 text-center max-w-xs">
        Say service names like "पानी", "toilet", "contact", "parking", "गरीबनाथ धाम"
      </p>
    </div>
  );
};

export default VoiceSearch;
