
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

  // Facility keywords mapping (English and Hindi)
  const facilityKeywords = {
    'paid-hotels': ['hotel', 'होटल', 'paid hotel', 'पेड होटल'],
    'atm': ['atm', 'एटीएम', 'cash', 'पैसे', 'money', 'bank', 'बैंक'],
    'drinking-water': ['water', 'पानी', 'drinking water', 'पीने का पानी', 'प्यास', 'thirst','पीने'],
    'toilet': ['toilet', 'टॉयलेट', 'wash room','washroom', 'बाथरूम', 'शौचालय','संडास','प्रसाधन','लेट्रिन','पखाना','पैखाना', 'हगने','हगना', 'मूत्र', 'पेशाब' ],
    'bathroom': ['bathroom', 'बाथरूम', 'नहाने', 'bath', 'shower','नहाने की जगह', 'स्नान घर'],
    'dharamshala': ['dharamshala', 'धर्मशाला', 'धर्मशाला', 'shelter', 'आश्रय','ठहरने', 'रुकने','निवास'],
    'shivir': ['shivir', 'शिविर', 'camp', 'camping', 'कैंप','अस्थायी निवास', 'temporary niwas', 'niwas sthal','निवास स्थल' ],
    'health-centre': ['health', 'हेल्थ', 'medical', 'doctor', 'डॉक्टर', 'इलाज', 'दवा', 'medicine'],
    'parking': ['parking', 'पार्किंग', 'गाड़ी', 'car', 'vehicle', 'वाहन', 'bolero', 'scorpio', 'bus','कार', 'बोलेरो', 'स्कॉर्पियो', 'बस', 'यात्री वाहन','मोटरसाइकिल', 'बाइक', ' टेंपो', 'ऑटो' , 'ट्रैक्टर '],
    'centralised-contact': ['contact', 'संपर्क', 'help', 'मदद', 'phone', 'फोन', 'call'],
    'bhandara': ['bhandara', 'भंडारा', 'लंगर', 'निःशुल्क भोजन' , 'जन सेवा भोजन', 'प्रसाद वितरण' ,'Free Meal' , 'फ्री भोजन', 'फ्री खाना']
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
          
          navigate(`/facility/${facilityType}?showMap=true`);
          return;
        }
      }
    }
    
    toast({
      title: "No Facility Found",
      description: "Please try saying a facility name like 'toilet', 'water', or 'parking'",
      variant: "destructive",
    });
  };

  const startListening = () => {
    if (recognition && !isListening) {
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

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <Button
        onClick={isListening ? stopListening : startListening}
        className={`${
          isListening 
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse shadow-lg shadow-red-500/25' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25'
        } text-white px-6 py-4 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95`}
        size="lg"
      >
        <div className="flex items-center space-x-3">
          {isListening ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold leading-tight">
              {isListening ? 'Listening...' : 'Voice Search'}
            </span>
            <span className="text-xs opacity-90 leading-tight">
              {isListening ? 'Tap to stop' : 'Find nearby facility'}
            </span>
          </div>
        </div>
      </Button>
    </div>
  );
};

export default FloatingVoiceButton;
