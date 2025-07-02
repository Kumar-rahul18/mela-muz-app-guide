
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

  // Facility keywords mapping (English and Hindi)
  const facilityKeywords = {
    'paid-hotels': ['hotel', 'होटल', 'paid hotel', 'पेड होटल'],
    'atm': ['atm', 'एटीएम', 'cash', 'पैसे', 'money', 'bank', 'बैंक'],
    'drinking-water': ['water', 'पानी', 'drinking water', 'पीने का पानी', 'प्यास', 'thirst','पीने','जल','पेय जल'],
    'toilet': ['toilet', 'टॉयलेट', 'wash room','washroom', 'बाथरूम', 'शौचालय','संडास','प्रसाधन','लेट्रिन','पखाना','पैखाना', 'हगने','हगना', 'मूत्र', 'पेशाब' ],
    'bathroom': ['bathroom', 'नहाने', 'bath', 'shower','नहाने की जगह', 'स्नान घर'],
    'dharamshala': ['dharamshala', 'धर्मशाला', 'shelter', 'आश्रय','ठहरने', 'रुकने','निवास'],
    'shivir': ['shivir', 'शिविर', 'camp', 'camping', 'कैंप','अस्थायी निवास', 'temporary niwas', 'niwas sthal','निवास स्थल' ],
    'health-centre': ['health', 'हेल्थ', 'medical', 'doctor', 'डॉक्टर', 'इलाज', 'दवा', 'medicine'],
    'parking': ['parking', 'पार्किंग', 'गाड़ी', 'car', 'vehicle', 'वाहन', 'bolero', 'scorpio', 'bus','कार', 'बोलेरो', 'स्कॉर्पियो', 'बस', 'यात्री वाहन','मोटरसाइकिल', 'बाइक', ' टेंपो', 'ऑटो' , 'ट्रैक्टर'],
    'centralised-contact': ['contact', 'संपर्क', 'help', 'मदद', 'phone', 'फोन', 'call'],
    'bhandara': ['bhandara', 'भंडारा', 'लंगर', 'निःशुल्क भोजन' , 'जन सेवा भोजन', 'प्रसाद वितरण' ,'free meal' , 'फ्री भोजन', 'फ्री खाना','भोजन']
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
    console.log('🔍 Searching for facilities in:', lowerTranscript);
    
    // Find matching facility
    for (const [facilityType, keywords] of Object.entries(facilityKeywords)) {
      for (const keyword of keywords) {
        if (lowerTranscript.includes(keyword.toLowerCase())) {
          console.log('✅ Found facility match:', facilityType, 'for keyword:', keyword);
          
          toast({
            title: "Facility Found!",
            description: `Taking you to ${facilityType.replace('-', ' ')} facilities`,
          });
          
          // Navigate to facility with map view enabled
          navigate(`/facility/${facilityType}?showMap=true`);
          
          if (onFacilityFound) {
            onFacilityFound(facilityType);
          }
          return;
        }
      }
    }
    
    // No facility found
    toast({
      title: "No Facility Found",
      description: "Please try saying a facility name like 'toilet', 'water', or 'parking'",
      variant: "destructive",
    });
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript('');
      recognition.start();
      toast({
        title: "Listening...",
        description: "Say a facility name in Hindi or English",
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
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
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
              <span className="text-xs leading-tight opacity-90">Search nearby facility</span>
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
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
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
        Say facility names like "toilet", "पानी", "parking", "होटल", etc.
      </p>
    </div>
  );
};

export default VoiceSearch;
