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

  // Enhanced keywords mapping for all services (English and Hindi)
  const serviceKeywords = {
    // Facilities
    'paid-hotels': ['hotel', 'होटल', 'paid hotel', 'पेड होटल'],
    'atm': ['atm', 'एटीएम', 'cash', 'पैसे', 'money', 'bank', 'बैंक'],
    'drinking-water': ['water', 'पानी', 'drinking water', 'पीने का पानी', 'प्यास', 'thirst','पीने','जल','पेय जल','drink', 'पेजल'],
    'toilet': ['toilet', 'टॉयलेट', 'wash room','washroom', 'बाथरूम', 'शौचालय','संडास','प्रसाधन','लेट्रिन','पखाना','पैखाना', 'हगने','हगना', 'मूत्र', 'पेशाब' ],
    'bathroom': ['bathroom', 'बाथरूम', 'नहाने', 'bath', 'shower','नहाने की जगह', 'स्नान घर'],
    'dharamshala': ['dharamshala', 'धर्मशाला', 'धर्मशाला', 'shelter', 'आश्रय','ठहरने', 'रुकने','निवास'],
    'shivir': ['shivir', 'शिविर', 'camp', 'camping', 'कैंप','अस्थायी निवास', 'temporary niwas', 'niwas sthal','निवास स्थल' ],
    'health-centre': ['health', 'हेल्थ', 'medical', 'doctor', 'डॉक्टर', 'इलाज', 'दवा', 'medicine', 'ambulance', 'एम्बुलेंस'],
    'parking': ['parking', 'पार्किंग', 'गाड़ी', 'car', 'vehicle', 'वाहन', 'bolero', 'scorpio', 'bus','कार', 'बोलेरो', 'स्कॉर्पियो', 'बस', 'यात्री वाहन','मोटरसाइकिल', 'बाइक', ' टेंपो', 'ऑटो' , 'ट्रैक्टर '],
    'centralised-contact': ['contact', 'संपर्क', 'help', 'मदद', 'phone', 'फोन', 'call', 'helpdesk', 'help desk', 'हेल्प डेस्क'],
    'bhandara': ['bhandara', 'भंडारा', 'लंगर', 'निःशुल्क भोजन' , 'जन सेवा भोजन', 'प्रसाद वितरण' ,'Free Meal' , 'फ्री भोजन', 'फ्री खाना', 'meal', 'खाना','भोजन', 'प्रसाद'],
    
    // Pages and Services
    'virtual-pooja': ['virtual pooja', 'वर्चुअल पूजा', 'online pooja', 'ऑनलाइन पूजा', 'pooja', 'पूजा', 'prayer', 'प्रार्थना'],
    'live-darshan': ['live darshan', 'लाइव दर्शन', 'darshan', 'दर्शन', 'live', 'लाइव'],
    'crowd-status': ['crowd status', 'crowd', 'भीड़', 'भीड़ की स्थिति', 'rush', 'रश'],
    'gallery': ['gallery', 'गैलरी', 'photos', 'फोटो', 'pictures', 'तस्वीरें'],
    'quiz': ['quiz', 'क्विज', 'mela quiz', 'मेला क्विज', 'questions', 'प्रश्न'],
    'lost-found': ['lost found', 'lost and found', 'खोया पाया', 'lost', 'खोया', 'found', 'पाया'],
    'photo-contest': ['photo contest', 'फोटो कॉन्टेस्ट', 'contest', 'कॉन्टेस्ट', 'competition', 'प्रतियोगिता'],
    'events': ['events', 'इवेंट्स', 'event', 'इवेंट', 'program', 'प्रोग्राम', 'कार्यक्रम'],
    'camera-filters': ['camera filters', 'कैमरा फिल्टर', 'filter', 'फिल्टर', 'camera', 'कैमरा'],
    'history': ['history', 'इतिहास', 'mela history', 'मेला इतिहास']
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'hi-IN'; // Hindi language
      
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
    const lowerTranscript = transcript.toLowerCase();
    console.log('🔍 Searching for services in:', lowerTranscript);
    
    // Find matching service
    for (const [serviceType, keywords] of Object.entries(serviceKeywords)) {
      for (const keyword of keywords) {
        if (lowerTranscript.includes(keyword.toLowerCase())) {
          console.log('✅ Found service match:', serviceType, 'for keyword:', keyword);
          
          // Handle different navigation patterns
          if (serviceType.startsWith('paid-hotels') || serviceType.startsWith('atm') || 
              serviceType.startsWith('drinking-water') || serviceType.startsWith('toilet') ||
              serviceType.startsWith('bathroom') || serviceType.startsWith('dharamshala') ||
              serviceType.startsWith('shivir') || serviceType.startsWith('health-centre') ||
              serviceType.startsWith('parking') || serviceType.startsWith('centralised-contact') ||
              serviceType.startsWith('bhandara')) {
            // Navigate to facility with map view enabled
            navigate(`/facility/${serviceType}?showMap=true`);
            toast({
              title: "Facility Found!",
              description: `Taking you to ${serviceType.replace('-', ' ')} facilities`,
              duration:1000,
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
              'camera-filters': '/camera-filters',
              'history': '/history'
            };
            
            const route = routeMap[serviceType];
            if (route) {
              navigate(route);
              toast({
                title: "Service Found!",
                description: `Taking you to ${serviceType.replace('-', ' ')}`,
              });
            }
          }
          
          if (onFacilityFound) {
            onFacilityFound(serviceType);
          }
          return;
        }
      }
    }
    
    // No service found
    toast({
      title: "Service Not Found",
      description: "Please try saying a service name like 'darshan', 'पूजा', 'gallery', or 'quiz'",
      duration:3500
      variant: "destructive",
    });
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript('');
      recognition.start();
      toast({
        title: "Listening...",
        description: "Say any service name in Hindi or English",
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
        Say service names like "toilet", "shivir", "parking", "quiz", etc.
      </p>
    </div>
  );
};

export default VoiceSearch;
