
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

  // Enhanced keywords mapping with your comprehensive list
  const serviceKeywords = {
    // Facilities
    'paid-hotels': ['hotel', 'होटल', 'paid hotel', 'पेड होटल'],
    'atm': ['atm', 'एटीएम', 'cash', 'पैसे', 'money', 'bank', 'बैंक'],
    'drinking-water': ['water', 'पानी', 'drinking water', 'पीने का पानी', 'प्यास', 'thirst','पीने','जल','पेय जल','drink', 'पेजल'],
    'toilet': ['toilet', 'टॉयलेट', 'wash room','washroom', 'शौचालय','संडास','प्रसाधन','लेट्रिन','पखाना','पैखाना', 'हगने','हगना', 'मूत्र', 'पेशाब' ],
    'bathroom': ['bathroom', 'बाथरूम', 'नहाने', 'bath', 'shower','नहाने की जगह', 'स्नान घर'],
    'dharamshala': ['dharamshala', 'धर्मशाला', 'धर्मशाला', 'shelter', 'आश्रय','ठहरने', 'रुकने','निवास'],
    'shivir': ['shivir', 'शिविर', 'camp', 'camping', 'कैंप','अस्थायी निवास', 'temporary niwas', 'niwas sthal','निवास स्थल','रुकने','आराम','जगह' ],
    'health-centre': ['health', 'हेल्थ', 'medical', 'doctor', 'डॉक्टर', 'इलाज', 'दवा', 'medicine', 'ambulance', 'एम्बुलेंस'],
    'parking': ['parking', 'पार्किंग', 'गाड़ी', 'car', 'vehicle', 'वाहन', 'bolero', 'scorpio', 'bus','कार', 'बोलेरो', 'स्कॉर्पियो', 'बस', 'यात्री वाहन','मोटरसाइकिल', 'बाइक', ' टेंपो', 'ऑटो' , 'ट्रैक्टर '],
    'centralised-contact': ['contact', 'संपर्क', 'help', 'मदद', 'phone', 'फोन', 'call', 'helpdesk', 'help desk', 'हेल्प डेस्क'],
    'bhandara': ['bhandara', 'भंडारा', 'लंगर', 'निःशुल्क भोजन' , 'जन सेवा भोजन', 'प्रसाद वितरण' ,'Free Meal' , 'फ्री भोजन', 'फ्री खाना', 'meal', 'खाना','भोजन', 'प्रसाद'],
    
    // Pages and Services
    'virtual-pooja': ['गरीबनाथ', 'वर्चुअल पूजा', 'online pooja', 'ऑनलाइन पूजा', 'pooja', 'पूजा', 'prayer', 'प्रार्थना'],
    'live-darshan': ['live darshan', 'लाइव दर्शन', 'darshan', 'दर्शन', 'live', 'लाइव'],
    'crowd-status': ['crowd status', 'crowd', 'भीड़', 'भीड़ की स्थिति', 'rush', 'रश'],
    'gallery': ['gallery', 'गैलरी', 'photos', 'फोटो', 'pictures', 'तस्वीरें'],
    'quiz': ['quiz', 'क्विज', 'mela quiz', 'मेला क्विज', 'questions', 'प्रश्न'],
    'lost-found': ['lost found', 'lost and found', 'खोया पाया', 'lost', 'खोया', 'found', 'पाया'],
    'photo-contest': ['photo contest', 'फोटो कॉन्टेस्ट', 'contest', 'कॉन्टेस्ट', 'competition', 'प्रतियोगिता'],
    'events': ['events', 'इवेंट्स', 'event', 'इवेंट', 'program', 'प्रोग्राम', 'कार्यक्रम'],
    'history': ['history', 'इतिहास', 'mela history', 'मेला इतिहास']
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
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          }
        }
        
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
    }
  }, []);

  const handleVoiceSearch = (transcript: string) => {
    const lowerTranscript = transcript.toLowerCase().trim();
    console.log('🔍 Searching for services in transcript:', lowerTranscript);
    
    // Improved matching logic - check for exact matches first, then substring matches
    for (const [serviceType, keywords] of Object.entries(serviceKeywords)) {
      for (const keyword of keywords) {
        const lowerKeyword = keyword.toLowerCase().trim();
        
        // Check for exact match first (more precise)
        if (lowerTranscript === lowerKeyword) {
          console.log('✅ Found EXACT service match:', serviceType, 'for keyword:', keyword);
          navigateToService(serviceType, keyword);
          return;
        }
        
        // Then check for substring match
        if (lowerTranscript.includes(lowerKeyword)) {
          console.log('✅ Found SUBSTRING service match:', serviceType, 'for keyword:', keyword);
          navigateToService(serviceType, keyword);
          return;
        }
        
        // Also check if keyword contains the transcript (for partial matches)
        if (lowerKeyword.includes(lowerTranscript) && lowerTranscript.length > 2) {
          console.log('✅ Found PARTIAL service match:', serviceType, 'for keyword:', keyword);
          navigateToService(serviceType, keyword);
          return;
        }
      }
    }
    
    // No service found
    console.log('❌ No service found for transcript:', lowerTranscript);
    toast({
      title: "Service Not Found",
      description: "Please try saying a service name like 'water', 'पानी', 'toilet', 'शौचालय', 'parking', or 'पार्किंग'",
      duration: 5000,
      variant: "destructive",
    });
  };

  const navigateToService = (serviceType: string, keyword: string) => {
    // Handle different navigation patterns
    const facilityTypes = ['paid-hotels', 'atm', 'drinking-water', 'toilet', 'bathroom', 'dharamshala', 'shivir', 'health-centre', 'parking', 'centralised-contact', 'bhandara'];
    
    if (facilityTypes.includes(serviceType)) {
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
