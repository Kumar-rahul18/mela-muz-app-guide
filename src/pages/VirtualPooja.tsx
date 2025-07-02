import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface PoojaStep {
  id: string;
  hindi: string;
  english: string;
  icon: string;
  completed: boolean;
}

interface Jyotirlinga {
  id: number;
  name: string;
  location: string;
  imageUrl: string;
}

const VirtualPooja = () => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement>(null);
  const mantraAudioRef = useRef<HTMLAudioElement>(null);
  const aartiAudioRef = useRef<HTMLAudioElement>(null);
  const bellAudioRef = useRef<HTMLAudioElement>(null);
  
  const [selectedJyotirlinga, setSelectedJyotirlinga] = useState<Jyotirlinga | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActionActive, setIsActionActive] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [showMantra, setShowMantra] = useState(false);
  const [showAarti, setShowAarti] = useState(false);
  const [showPrasad, setShowPrasad] = useState(false);
  const [showJalAnimation, setShowJalAnimation] = useState(false);
  const [poojaComplete, setPoojaComplete] = useState(false);
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(true);
  const [showAura, setShowAura] = useState(false);

  const jyotirlingas: Jyotirlinga[] = [
    { id: 1, name: 'Vaidyanath', location: 'Deoghar, Jharkhand', imageUrl: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/virtual-puja/9.png' },
   
    { id: 2, name: 'Mallikarjuna', location: 'Srisailam, Andhra Pradesh', imageUrl: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/virtual-puja//2.png' },
    { id: 3, name: 'Mahakaleshwar', location: 'Ujjain, Madhya Pradesh', imageUrl: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/virtual-puja//3.png' },
    { id: 4, name: 'Omkareshwar', location: 'Khandwa, Madhya Pradesh', imageUrl: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/virtual-puja//4.png' },
    { id: 5, name: 'Kedarnath', location: 'Kedarnath, Uttarakhand', imageUrl: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/virtual-puja//5.png' },
    { id: 6, name: 'Bhimashankar', location: 'Pune, Maharashtra', imageUrl: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/virtual-puja//6.png' },
    { id: 7, name: 'Kashi Vishwanath', location: 'Varanasi, Uttar Pradesh', imageUrl: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/virtual-puja//7.png' },
    { id: 8, name: 'Trimbakeshwar', location: 'Nashik, Maharashtra', imageUrl: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/virtual-puja/8.png' },
     { id: 9, name: 'Somnath', location: 'Veraval, Gujarat', imageUrl: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/virtual-puja//1.png' },
    { id: 10, name: 'Nageshwar', location: 'Dwarka, Gujarat', imageUrl: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/virtual-puja/10.png' },
    { id: 11, name: 'Rameshwaram', location: 'Rameswaram, Tamil Nadu', imageUrl: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/virtual-puja/11.png' },
   { id: 12, name: 'Grishneshwar', location: 'Aurangabad, Maharashtra', imageUrl: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/virtual-puja/12.png' }
  ];

  const [steps, setSteps] = useState<PoojaStep[]>([
    { id: 'jal', hindi: 'जल चढ़ाएं', english: 'Jal Chadhayen', icon: '🔱', completed: false },
    { id: 'mantra', hindi: 'मंत्र पढ़ें', english: 'Mantra Padhen', icon: '📖', completed: false },
    { id: 'aarti', hindi: 'आरती करें', english: 'Aarti Karen', icon: '🪔', completed: false },
    { id: 'prasad', hindi: 'प्रसाद चढ़ाएं', english: 'Prasad Chadhayen', icon: '🥮🥮🥮🥮', completed: false }
  ]);

  useEffect(() => {
    // Start background music with reduced volume
    if (backgroundMusicRef.current && backgroundMusicEnabled) {
      backgroundMusicRef.current.volume = 0.40;
      backgroundMusicRef.current.play().catch(console.error);
    }
    
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
      }
    };
  }, [backgroundMusicEnabled]);

  const playSound = (type: 'bell' | 'mantra' | 'aarti') => {
    if (type === 'mantra' && mantraAudioRef.current) {
      mantraAudioRef.current.volume = 1.0;
      mantraAudioRef.current.play().catch(console.error);
    } else if (type === 'aarti' && aartiAudioRef.current) {
      aartiAudioRef.current.volume = 1.0;
      aartiAudioRef.current.play().catch(console.error);
    } else if (type === 'prasad' && bellAudioRef.current) {
      bellAudioRef.current.volume = 1.0;
      bellAudioRef.current.play().catch(console.error);
    }
    console.log(`Playing ${type} sound`);
  };

  const handleJalChadhana = () => {
    setIsActionActive(true);
    setShowJalAnimation(true);
    
    setTimeout(() => {
      setShowJalAnimation(false);
      setActionMessage('जल चढ़ाया गया 🙏');
      completeStep('jal');
      setTimeout(() => {
        setActionMessage('');
        setIsActionActive(false);
      }, 3000);
    }, 10000);
  };

  const handleMantraPadhen = () => {
    setIsActionActive(true);
    setShowMantra(true);
    playSound('mantra');
    
    setTimeout(() => {
      setShowMantra(false);
      if (mantraAudioRef.current) {
        mantraAudioRef.current.pause();
        mantraAudioRef.current.currentTime = 0;
      }
      setActionMessage('मंत्र पूर्ण हुआ 🙏');
      completeStep('mantra');
      setTimeout(() => {
        setActionMessage('');
        setIsActionActive(false);
      }, 3000);
    }, 29000);
  };

  const handleAartiKaren = () => {
    setIsActionActive(true);
    setShowAarti(true);
    playSound('aarti');
    
    setTimeout(() => {
      setShowAarti(false);
      if (aartiAudioRef.current) {
        aartiAudioRef.current.pause();
        aartiAudioRef.current.currentTime = 0;
      }
      setActionMessage('आरती संपन्न हुई 🔥');
      completeStep('aarti');
      setTimeout(() => {
        setActionMessage('');
        setIsActionActive(false);
      }, 3000);
    }, 15000);
  };

  const handlePrasadChadhana = () => {
    setIsActionActive(true);
    setShowPrasad(true);
    
    setTimeout(() => {
      setActionMessage('प्रसाद चढ़ाया गया 🙏');
      completeStep('prasad');
      setTimeout(() => {
        setActionMessage('');
        setIsActionActive(false);
        checkPoojaCompletion();
      }, 3000);
    }, 15000);
  };

  const completeStep = (stepId: string) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
    setCurrentStep(prev => prev + 1);
  };

  const checkPoojaCompletion = () => {
    const allCompleted = steps.every(step => step.completed || step.id === 'prasad');
    if (allCompleted) {
      setTimeout(() => {
        setPoojaComplete(true);
        setShowAura(true);
        playSound('bell');
        setTimeout(() => {
          if (bellAudioRef.current) {
            bellAudioRef.current.pause();
            bellAudioRef.current.currentTime = 0;
          }
        }, 3000);
      }, 1000);
    }
  };

  const getStepHandler = (stepId: string) => {
    switch (stepId) {
      case 'jal': return handleJalChadhana;
      case 'mantra': return handleMantraPadhen;
      case 'aarti': return handleAartiKaren;
      case 'prasad': return handlePrasadChadhana;
      default: return () => {};
    }
  };

  const resetPooja = () => {
    setSteps(prevSteps => prevSteps.map(step => ({ ...step, completed: false })));
    setCurrentStep(0);
    setPoojaComplete(false);
    setShowAura(false);
    setActionMessage('');
    setIsActionActive(false);
    setShowMantra(false);
    setShowAarti(false);
    setShowPrasad(false);
    setShowJalAnimation(false);
  };

  const getCurrentStepToShow = () => {
    if (poojaComplete) return null;
    return steps[currentStep];
  };

  const handleJyotirlingaSelect = (jyotirlinga: Jyotirlinga) => {
    setSelectedJyotirlinga(jyotirlinga);
    resetPooja();
  };

  const goBackToSelection = () => {
    setSelectedJyotirlinga(null);
    resetPooja();
  };

  // If no Jyotirlinga is selected, show selection screen
  if (!selectedJyotirlinga) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-yellow-50 to-orange-100 relative overflow-hidden">
        {/* Background Audio */}
        <audio ref={backgroundMusicRef} loop>
          <source src="https://mela-muz-app-guide.vercel.app/deep-om-chants-with-reverb-229614.mp3" type="audio/mpeg" />
        </audio>

        {/* Background Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="app-gradient text-white px-4 py-3 shadow-lg relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate('/')} className="text-white">
                ← 
              </button>
              <h1 className="text-lg font-semibold">🕉 शिव के स्वरूपों की पूजा</h1>
            </div>
            <button
              onClick={() => setBackgroundMusicEnabled(!backgroundMusicEnabled)}
              className="text-white p-2 rounded-full hover:bg-white/20"
            >
              {backgroundMusicEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>

        <div className="px-4 py-6 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-orange-800 mb-2 font-serif">
              🕉 12 ज्योतिर्लिंग
            </h1>
            <p className="text-orange-600 text-sm mb-6">
              अपना पसंदीदा ज्योतिर्लिंग चुनें और पूजा करें
            </p>
          </div>

          {/* Jyotirlinga Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {jyotirlingas.map((jyotirlinga) => (
              <div
                key={jyotirlinga.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gradient-to-b from-gray-200 to-gray-300">
                  <img
                    src={jyotirlinga.imageUrl}
                    alt={jyotirlinga.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5WVPC90ZXh0Pgo8L3N2Zz4K';
                    }}
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-bold text-orange-800 mb-1">
                    {jyotirlinga.name}
                  </h3>
                  <p className="text-sm text-orange-600 mb-3">
                    {jyotirlinga.location}
                  </p>
                  
                  <button
                    onClick={() => handleJyotirlingaSelect(jyotirlinga)}
                    className="group relative bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2 mx-auto"
                  >
                    <Heart className="w-4 h-4 animate-pulse" />
                    <span>पूजा करें</span>
                    <Heart className="w-4 h-4 animate-pulse" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-orange-200 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-orange-800 mb-2 text-center">पूजा विधि:</h3>
            <ol className="text-sm text-orange-700 space-y-1">
              <li>1. अपना पसंदीदा ज्योतिर्लिंग चुनें</li>
              <li>2. जल चढ़ाएं → मंत्र जाप करें → आरती करें → प्रसाद चढ़ाएं</li>
              <li>3. प्रत्येक चरण में उचित समय लगेगा</li>
              <li>4. पूर्ण श्रद्धा के साथ पूजा करें</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Main puja interface (existing code with selected Jyotirlinga)
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-yellow-50 to-orange-100 relative overflow-hidden">
      {/* Background Audio with reduced volume */}
      <audio ref={backgroundMusicRef} loop>
        <source src="https://mela-muz-app-guide.vercel.app/deep-om-chants-with-reverb-229614.mp3" type="audio/mpeg" />
      </audio>

      {/* Mantra Audio */}
      <audio ref={mantraAudioRef} loop>
        <source src="https://mela-muz-app-guide.vercel.app/Mahamrityunjaya%20Mantra%20108%20Times-1%20(mp3cut.net).mp3" type="audio/mpeg" />
      </audio>

      {/* Aarti Audio */}
      <audio ref={aartiAudioRef} loop>
        <source src="https://mela-muz-app-guide.vercel.app/51197796_indian-hindu-temple-bells-of-aarti_by_reenamjain_preview.mp3" type="audio/mpeg" />
      </audio>

      {/* Bell Audio */}
      <audio ref={bellAudioRef}>
        <source src="https://mela-muz-app-guide.vercel.app/5-63535.mp3" type="audio/mpeg" />
      </audio>

      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="app-gradient text-white px-4 py-3 shadow-lg relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={goBackToSelection} className="text-white">
              ← 
            </button>
            <h1 className="text-lg font-semibold">🕉 {selectedJyotirlinga.name} पूजा</h1>
          </div>
          <button
            onClick={() => setBackgroundMusicEnabled(!backgroundMusicEnabled)}
            className="text-white p-2 rounded-full hover:bg-white/20"
          >
            {backgroundMusicEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      <div className="px-4 py-6 relative z-10">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <span className="text-sm text-orange-800 font-medium">
              चरण {currentStep} / 4
            </span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Jyotirlinga Section */}
        <div className="text-center mb-8 relative">
          <h1 className="text-2xl font-bold text-orange-800 mb-2 font-serif">
            🕉 {selectedJyotirlinga.name}
          </h1>
          <p className="text-orange-600 text-sm mb-6">{selectedJyotirlinga.location}</p>
          
          {/* Jyotirlinga Container with Aura */}
          <div className={`relative inline-block ${showAura ? 'animate-pulse' : ''}`}>
            {showAura && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full blur-xl opacity-60 scale-110 animate-spin-slow" />
            )}
            
            {/* Jyotirlinga Image */}
            <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden shadow-2xl">
              <img 
                src={selectedJyotirlinga.imageUrl}
                alt={selectedJyotirlinga.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.classList.add('bg-gradient-to-b', 'from-gray-600', 'to-gray-800', 'flex', 'items-center', 'justify-center');
                    parent.innerHTML = '<div class="text-6xl text-white">🕉</div>';
                  }
                }}
              />
              
              {/* Enhanced Jal Animation with Water Droplets and Flowers */}
              {showJalAnimation && (
                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
                  <div className="flex flex-col items-center">
                    <div className="text-4xl animate-bounce mb-2">🫗</div>
                    <div className="relative">
                      {/* Multiple water streams with droplets */}
                      {[...Array(8)].map((_, i) => (
                        <div key={`water-${i}`} className="absolute">
                          <div
                            className="w-1 bg-blue-400 opacity-80 animate-pulse rounded-full"
                            style={{
                              height: '70px',
                              left: `${i * 6 - 24}px`,
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: '1.2s'
                            }}
                          />
                          {/* Water droplets */}
                          <div
                            className="absolute w-2 h-2 bg-blue-300 rounded-full animate-bounce opacity-70"
                            style={{
                              left: `${i * 6 - 24}px`,
                              top: `${60 + (i % 3) * 10}px`,
                              animationDelay: `${i * 0.15}s`,
                              animationDuration: '1s'
                            }}
                          >💧</div>
                        </div>
                      ))}
                      
                      {/* Floating flowers */}
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={`flower-${i}`}
                          className="absolute text-xl animate-pulse"
                          style={{
                            left: `${i * 10 - 20}px`,
                            top: `${40 + (i % 2) * 20}px`,
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: '2s'
                          }}
                        >
                          {['🌸', '🌼', '🌺', '🌻', '🌷'][i]}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Enhanced Aarti Animation with Circular Moving Diya */}
              {showAarti && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    {/* Circular path for diya */}
                    <div className="absolute inset-0 rounded-full border-2 border-yellow-400 opacity-30"></div>
                    
                    {/* Moving diya */}
                    <div 
                      className="absolute w-8 h-8 flex items-center justify-center"
                      style={{ 
                        top: '0px', 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        transformOrigin: '50% 64px',
                        animation: 'aarti-circular 3s ease-in-out infinite'
                      }}
                    >
                      <div className="text-3xl animate-pulse">🪔</div>
                    </div>
                    
                    {/* Light rays emanating from center */}
                    <div className="absolute inset-0 animate-pulse">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={`ray-${i}`}
                          className="absolute w-1 h-8 bg-yellow-400 opacity-60"
                          style={{
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-20px)`,
                            transformOrigin: 'center',
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Central glow */}
                    <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-20 animate-pulse scale-75"></div>
                  </div>
                </div>
              )}
              
              {/* Prasad */}
              {showPrasad && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="text-3xl animate-bounce">🥮🥮🥮🥮</div>
                </div>
              )}
            </div>
          </div>

          {/* Mantra Display */}
          {showMantra && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-4 border border-orange-200">
              <div className="text-orange-800 font-serif text-lg leading-relaxed">
                <div className="text-3xl mb-4 animate-pulse">🕉 नमः शिवाय</div>
                <div className="text-lg text-orange-600 mb-4">
                  ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।<br/>
                  उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्॥
                </div>
                <div className="text-sm text-orange-500 italic">
                  🎵 मंत्र जाप चल रहा है...
                </div>
              </div>
            </div>
          )}

          {/* Action Message */}
          {actionMessage && (
            <div className="bg-green-100 border border-green-300 rounded-2xl p-4 mb-4 animate-fade-in">
              <p className="text-green-800 font-semibold text-lg">{actionMessage}</p>
            </div>
          )}

          {/* Completion Message */}
          {poojaComplete && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-orange-300 rounded-2xl p-6 mb-6 animate-fade-in">
              <div className="text-3xl mb-2">🙏</div>
              <h2 className="text-xl font-bold text-orange-800 mb-2">🕉 {selectedJyotirlinga.name} पूजा संपूर्ण हुई 🕉</h2>
              <p className="text-orange-700 mb-2">आपकी {selectedJyotirlinga.name} की पूजा सफलतापूर्वक संपन्न हुई।</p>
              <p className="text-orange-600 text-sm mb-4">🔔 भगवान शिव आपको आशीर्वाद दें।</p>
              <div className="flex space-x-3 justify-center">
                <Button 
                  onClick={resetPooja}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  पुनः पूजा करें
                </Button>
                <Button 
                  onClick={goBackToSelection}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  अन्य ज्योतिर्लिंग चुनें
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Single Action Button - Sequential Display */}
        {!poojaComplete && getCurrentStepToShow() && (
          <div className="flex justify-center max-w-md mx-auto">
            {(() => {
              const step = getCurrentStepToShow()!;
              return (
                <Button
                  onClick={getStepHandler(step.id)}
                  disabled={isActionActive}
                  className={`h-24 w-64 text-left flex flex-col items-center justify-center p-6 rounded-2xl font-semibold transition-all duration-300 ${
                    isActionActive 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white shadow-lg hover:shadow-xl active:scale-95'
                  }`}
                >
                  <div className="text-3xl mb-2">{step.icon}</div>
                  <div className="text-lg text-center leading-tight">
                    {step.hindi}
                  </div>
                  {isActionActive && (
                    <div className="text-xs mt-2 animate-pulse">प्रतीक्षा करें...</div>
                  )}
                </Button>
              );
            })()}
          </div>
        )}

        {/* Instructions */}
        {currentStep === 0 && !isActionActive && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">पूजा विधि:</h3>
            <ol className="text-sm text-orange-700 space-y-1">
              <li>1. सबसे पहले शिवलिंग पर जल चढ़ाएं</li>
              <li>2. फिर मंत्र का जाप करें</li>
              <li>3. आरती करें</li>
              <li>4. अंत में प्रसाद चढ़ाएं</li>
            </ol>
            <p className="text-xs text-orange-600 mt-2">
              प्रत्येक चरण में 15 सेकंड का समय लगेगा।
            </p>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style>
        {`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes aarti-circular {
          0% { transform: translateX(-50%) rotate(0deg) translateX(64px) rotate(0deg); }
          25% { transform: translateX(-50%) rotate(90deg) translateX(64px) rotate(-90deg); }
          50% { transform: translateX(-50%) rotate(180deg) translateX(64px) rotate(-180deg); }
          75% { transform: translateX(-50%) rotate(270deg) translateX(64px) rotate(-270deg); }
          100% { transform: translateX(-50%) rotate(360deg) translateX(64px) rotate(-360deg); }
        }
        `}
      </style>
    </div>
  );
};

export default VirtualPooja;
