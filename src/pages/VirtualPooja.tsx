
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PoojaStep {
  id: string;
  hindi: string;
  english: string;
  icon: string;
  completed: boolean;
}

const VirtualPooja = () => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement>(null);
  const mantraAudioRef = useRef<HTMLAudioElement>(null);
  const aartiAudioRef = useRef<HTMLAudioElement>(null);
  const bellAudioRef = useRef<HTMLAudioElement>(null);
  
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

  const [steps, setSteps] = useState<PoojaStep[]>([
    { id: 'jal', hindi: 'जल चढ़ाएं', english: 'Jal Chadhayen', icon: '🚿', completed: false },
    { id: 'mantra', hindi: 'मंत्र पढ़ें', english: 'Mantra Padhen', icon: '📖', completed: false },
    { id: 'aarti', hindi: 'आरती करें', english: 'Aarti Karen', icon: '🪔', completed: false },
    { id: 'prasad', hindi: 'प्रसाद चढ़ाएं', english: 'Prasad Chadhayen', icon: '🍮', completed: false }
  ]);

  useEffect(() => {
    // Start background music with reduced volume
    if (backgroundMusicRef.current && backgroundMusicEnabled) {
      backgroundMusicRef.current.volume = 0.25; // Reduced from 0.3 to 0.25
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
      mantraAudioRef.current.volume = 1.0; // Full volume for foreground sounds
      mantraAudioRef.current.play().catch(console.error);
    } else if (type === 'aarti' && aartiAudioRef.current) {
      aartiAudioRef.current.volume = 1.0; // Full volume for foreground sounds
      aartiAudioRef.current.play().catch(console.error);
    } else if (type === 'bell' && bellAudioRef.current) {
      bellAudioRef.current.volume = 1.0; // Full volume for foreground sounds
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
    }, 15000);
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
    }, 27000);
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
        // Stop bell sound after 3 seconds
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

  // Get current step to display
  const getCurrentStepToShow = () => {
    if (poojaComplete) return null;
    return steps[currentStep];
  };

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
            <button onClick={() => navigate('/')} className="text-white">
              ← 
            </button>
            <h1 className="text-lg font-semibold">🕉 वर्चुअल शिवलिंग पूजा</h1>
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
              चरण {currentStep + 1} / 4
            </span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Shivling Section */}
        <div className="text-center mb-8 relative">
          <h1 className="text-2xl font-bold text-orange-800 mb-6 font-serif">
            🕉 वर्चुअल शिवलिंग पूजा
          </h1>
          
          {/* Shivling Container with Aura */}
          <div className={`relative inline-block ${showAura ? 'animate-pulse' : ''}`}>
            {showAura && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full blur-xl opacity-60 scale-110 animate-spin-slow" />
            )}
            
            {/* Jyotirlinga Image */}
            <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden shadow-2xl">
              <img 
                src="https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/virtual-puja//jyotirlinga.jpeg" 
                alt="Jyotirlinga" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient background with Om symbol if image fails to load
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
                      className="absolute w-8 h-8 flex items-center justify-center animate-spin-slow"
                      style={{ 
                        top: '0px', 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        transformOrigin: '50% 64px'
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
                  <div className="text-3xl animate-bounce">🍮</div>
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
              <h2 className="text-xl font-bold text-orange-800 mb-2">🕉 पूजा संपूर्ण हुई 🕉</h2>
              <p className="text-orange-700 mb-2">आपकी पूजा सफलतापूर्वक संपन्न हुई।</p>
              <p className="text-orange-600 text-sm mb-4">🔔 भगवान शिव आपको आशीर्वाद दें।</p>
              <Button 
                onClick={resetPooja}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
              >
                पुनः पूजा करें
              </Button>
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
        `}
      </style>
    </div>
  );
};

export default VirtualPooja;
