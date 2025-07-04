
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
    // Facilities
     'drinking-water': ['water', 'पानी', 'drinking water', 'पीने का पानी', 'प्यास', 'thirst', 'पीने', 'जल', 'पेय जल','पेजल'],
    'toilet': ['toilet', 'टॉयलेट', 'washroom', 'शौचालय', 'संडास', 'प्रसाधन', 'लेट्रिन', 'पखाना', 'पैखाना', 'हगने', 'हगना', 'मूत्र', 'पेशाब'],
    'bathroom': ['bathroom', 'बाथरूम', 'नहाने','स्नान', 'bath', 'shower', 'नहाने की जगह', 'स्नान घर'],
    'shivir': ['shivir', 'शिविर', 'camp', 'camping', 'कैंप','आराम','ठहरने', 'रुकने', 'आश्रय', 'अस्थायी निवास'],
    'health-centre': ['health', 'hospital','अस्पताल','हेल्थ', 'medical', 'doctor', 'first aid', 'दर्द', 'बुखार', 'कटना', 'कट','छिलना','छिल', 'डॉक्टर', 'इलाज', 'दवा', 'medicine', 'ambulance', 'एम्बुलेंस'],
    'bhandara': ['bhandara', 'भंडारा', 'लंगर', 'निःशुल्क भोजन', 'जन सेवा भोजन', 'प्रसाद वितरण', 'free meal', 'फ्री खाना', 'meal', 'खाना', 'भोजन', 'प्रसाद'],
    'parking': ['parking', 'पार्किंग', 'गाड़ी', 'car', 'vehicle', 'वाहन', 'कार', 'बस', 'यात्री वाहन', 'मोटरसाइकिल', 'बाइक'],
    'paid-hotels': ['hotel', 'होटल', 'paid hotel', 'पेड होटल'],
    'atm': ['atm', 'एटीएम', 'cash', 'पैसे', 'money', 'bank', 'बैंक'],
     'dharamshala': ['dharamshala', 'धर्मशाला', 'shelter',  'निवास'],
     'centralised-contact': ['contact', 'संपर्क', 'help', 'मदद', 'phone', 'फोन', 'call', 'helpdesk', 'help desk', 'हेल्प डेस्क'],
    
    // Pages and Services
    'virtual-pooja': ['गरीबनाथ', 'गरीबनाथ धाम', 'garibnath', 'garibnath dham', 'वर्चुअल पूजा', 'online pooja', 'ऑनलाइन पूजा', 'pooja', 'पूजा', 'prayer', 'प्रार्थना'],
    'live-darshan': ['live darshan', 'लाइव दर्शन', 'darshan', 'दर्शन', 'live', 'लाइव'],
    'crowd-status': ['crowd status', 'crowd', 'भीड़', 'भीड़ की स्थिति', 'rush', 'रश'],
    'gallery': ['gallery', 'गैलरी', 'photos', 'फोटो', 'pictures', 'तस्वीरें'],
    'quiz': ['quiz', 'क्विज', 'mela quiz', 'मेला क्विज', 'questions', 'प्रश्न'],
    'lost-found': ['lost found', 'lost and found', 'खोया पाया', 'lost', 'खोया','खो', 'found', 'पाया','भूल','भुला'],
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
    const lowerTranscript = transcript.toLowerCase().trim();
    console.log('🔍 Searching for services in transcript:', lowerTranscript);
    
    // Find best match with improved precision
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [serviceType, keywords] of Object.entries(serviceKeywords)) {
      for (const keyword of keywords) {
        const lowerKeyword = keyword.toLowerCase().trim();
        let score = 0;
        
        // Strategy 1: Exact match (highest priority)
        if (lowerTranscript === lowerKeyword) {
          score = 100;
        }
        // Strategy 2: Transcript contains the complete keyword
        else if (lowerTranscript.includes(lowerKeyword)) {
          // Give higher score for longer matches
          score = 80 + (lowerKeyword.length / lowerTranscript.length) * 20;
        }
        // Strategy 3: Word-by-word match for multi-word keywords
        else if (lowerKeyword.includes(' ')) {
          const transcriptWords = lowerTranscript.split(/\s+/);
          const keywordWords = lowerKeyword.split(/\s+/);
          
          const matchedWords = keywordWords.filter(keywordWord => 
            transcriptWords.some(transcriptWord => 
              transcriptWord === keywordWord || 
              (transcriptWord.length > 2 && keywordWord.includes(transcriptWord)) ||
              (keywordWord.length > 2 && transcriptWord.includes(keywordWord))
            )
          );
          
          if (matchedWords.length === keywordWords.length) {
            score = 70;
          } else if (matchedWords.length > 0) {
            score = 40 * (matchedWords.length / keywordWords.length);
          }
        }
        // Strategy 4: Single word fuzzy match (only for words > 3 chars)
        else if (!lowerTranscript.includes(' ') && !lowerKeyword.includes(' ') && 
                 lowerTranscript.length > 3 && lowerKeyword.length > 3) {
          const similarity = calculateSimilarity(lowerTranscript, lowerKeyword);
          if (similarity > 0.75) { // Higher threshold for fuzzy matching
            score = 50 * similarity;
          }
        }
        
        // Update best match if this score is higher
        if (score > bestScore && score > 40) { // Minimum threshold
          bestScore = score;
          bestMatch = { serviceType, keyword, score };
        }
      }
    }
    
    if (bestMatch) {
      console.log('✅ Best match found:', bestMatch);
      navigateToService(bestMatch.serviceType, bestMatch.keyword);
    } else {
      console.log('❌ No clear service match found for transcript:', lowerTranscript);
      toast({
        title: "Service Not Found",
        description: "Please try saying a clear service name like 'पानी', 'toilet', 'शौचालय', 'parking', 'गरीबनाथ धाम'",
        duration: 4000,
        variant: "destructive",
      });
    }
  };

  // Improved similarity calculation
  const calculateSimilarity = (str1: string, str2: string): number => {
    const editDistance = calculateEditDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - (editDistance / maxLength);
  };

  // Simple edit distance calculation for fuzzy matching
  const calculateEditDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + substitutionCost // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
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
        Say service names like "पानी", "toilet", "शौचालय", "parking", "गरीबनाथ धाम", "पार्किंग"
      </p>
    </div>
  );
};

export default VoiceSearch;
