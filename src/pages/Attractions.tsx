
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Navigation, TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Attractions = () => {
  const navigate = useNavigate();

  const attractions = [
    {
      id: 'sikandarpur-lake-front',
      icon: '🏞️',
      title: 'सिकंदरपुर लेक फ्रंट',
      description: 'मुजफ्फरपुर में सिकंदरपुर लेक फ्रंट स्मार्ट सिटी प्रोजेक्ट के तहत विकसित एक सुंदर मनोरंजन स्थल है। यहाँ एक खूबसूरत वॉकिंग पाथ, जीवंत रोशनी, बोटिंग सुविधा, फव्वारे, साइकिलिंग ट्रैक और खुले बैठने के क्षेत्र हैं—जो इसे आराम, पारिवारिक सैर और शाम की सैर के लिए एक आदर्श स्थान बनाता है।',
      image: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/attraction//lakefront.jpeg',
      location: 'सिकंदरपुर, मुजफ्फरपुर',
      coordinates: { lat: 26.1197, lng: 85.3910 }
    },
    {
      id: 'litchi-gardens',
      icon: '🌿',
      title: 'लीची बगान',
      description: 'मुजफ्फरपुर अपने मीठे और रसीले लीची के लिए विश्व प्रसिद्ध है। यहाँ के लीची बगान न केवल स्थानीय अर्थव्यवस्था का आधार हैं बल्कि पर्यटकों के लिए भी एक मुख्य आकर्षण हैं। लीची का मौसम मई-जून में होता है जब पूरे क्षेत्र में मीठी खुशबू फैल जाती है।',
      image: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/attraction//litchi.webp',
      location: 'मुशहरी, झपाहा, और बोचाहा, मुजफ्फरपुर',
      coordinates: { lat: 26.1209, lng: 85.3647 }
    },
    {
      id: 'garibnath-temple',
      icon: '🛕',
      title: 'बाबा गरीब नाथ मंदिर',
      description: 'बाबा गरीब नाथ मंदिर मुजफ्फरपुर का सबसे प्रसिद्ध धार्मिक स्थल है। यह भगवान शिव को समर्पित है और श्रावण मास में यहाँ लाखों श्रद्धालु आते हैं। मंदिर की आध्यात्मिक शक्ति और शांत वातावरण इसे एक विशेष स्थान बनाता है।',
      image: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/attraction//Garibnath.jpg',
      location: 'सिटी सेंटर, मुजफ्फरपुर',
      coordinates: { lat: 26.1197, lng: 85.3910 }
    },
    {
      id: 'jubba-sahni-park',
      icon: '🌳',
      title: 'जुब्बा साहनी पार्क',
      description: 'जुब्बा साहनी पार्क मुजफ्फरपुर का एक हरा-भरा और शांत पार्क है जो परिवारों और बच्चों के लिए एक आदर्श स्थान है। यहाँ हरियाली, खेल के मैदान और बैठने की व्यवस्था है। यह स्थानीय लोगों के लिए मॉर्निंग वॉक और शाम की सैर के लिए एक लोकप्रिय स्थान है।',
      image: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/attraction//jubba.jpg',
      location: 'रेलवे स्टेशन के पास, मुजफ्फरपुर',
      coordinates: { lat: 26.1197, lng: 85.3910 }
    },
    {
      id: 'ramchandra-museum',
      icon: '🏛️',
      title: 'रामचंद्र संग्रहालय',
      description: 'रामचंद्र संग्रहालय मुजफ्फरपुर के इतिहास और संस्कृति को संजोए रखने वाला एक महत्वपूर्ण स्थान है। यहाँ स्थानीय कलाकृतियाँ, ऐतिहासिक वस्तुएँ और क्षेत्रीय धरोहर के नमूने देखे जा सकते हैं। यह शिक्षा और ज्ञान प्रेमियों के लिए एक उत्तम स्थान है।',
      image: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/attraction//museum.jpg',
      location: 'जुब्बा साहनी पार्क के पास, मुजफ्फरपुर',
      coordinates: { lat: 26.1197, lng: 85.3910 }
    },
    {
      id: 'khudiram-memorial',
      icon: '⚔️',
      title: 'खुदीराम बोस स्मारक',
      description: 'खुदीराम बोस स्मारक स्वतंत्रता संग्राम के वीर शहीद खुदीराम बोस की स्मृति में बनाया गया है। यह स्थान राष्ट्रीय गौरव और बलिदान की भावना को जगाता है। यहाँ आकर लोग उनके साहस और देशभक्ति को याद करते हैं।',
      image: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/attraction//khudiram%20bose.jpg',
      location: 'मुजफ्फरपुर शहर, बिहार',
      coordinates: { lat: 26.1197, lng: 85.3910 }
    },
    {
      id: 'motijheel',
      icon: '💎',
      title: 'मोतीझील',
      description: 'मोतीझील, मुज़फ़्फ़रपुर का एक प्रमुख आवासीय और व्यावसायिक क्षेत्र होने के साथ-साथ ऐतिहासिक महत्व वाला एक प्रसिद्ध स्थल भी है।
"मोतीझील" नाम का शाब्दिक अर्थ है "मोती की झील" (मोती = Pearl, झील = Lake), और इसका नाम एक ऐतिहासिक झील के नाम पर पड़ा है जो कभी यहाँ स्थित थी।',
      image: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/attraction//motijheel.avif',
      location: 'मुजफ्फरपुर, बिहार',
      coordinates: { lat: 26.1197, lng: 85.3910 }
    }
  ];

  const handleGetDirections = (attraction: typeof attractions[0]) => {
    const { lat, lng } = attraction.coordinates;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 text-white px-4 py-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            <TreePine className="w-8 h-8" />
            <h1 className="text-xl font-bold">आकर्षण स्थल</h1>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            मुजफ्फरपुर में आपका स्वागत है
          </h2>
          <p className="text-gray-600">
            खूबसूरत आकर्षण स्थलों और विरासत स्थलों की खोज करें
          </p>
        </div>

        <div className="space-y-4">
          {attractions.map((attraction) => (
            <div
              key={attraction.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={attraction.image}
                  alt={attraction.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl">{attraction.icon}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {attraction.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {attraction.description}
                </p>
                
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{attraction.location}</span>
                </div>
                
                <Button
                  onClick={() => handleGetDirections(attraction)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>दिशा निर्देश पाएं</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Attractions;
