import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Navigation, TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Attractions = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const attractions = [
    {
      id: 'litchi-gardens',
      icon: '🌳',
      title: t('litchi_gardens'),
      description: t('litchi_gardens_desc'),
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: 'Mushahari, Jhapaha, and Bochaha, Muzaffarpur',
      coordinates: { lat: 26.1209, lng: 85.3647 }
    },
    {
      id: 'garibnath-temple',
      icon: '🛕',
      title: t('garibnath_temple'),
      description: t('garibnath_temple_desc'),
      image: 'https://images.unsplash.com/photo-1544913161-649431ccf735?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: 'City Center, Muzaffarpur',
      coordinates: { lat: 26.1197, lng: 85.3910 }
    },
    {
      id: 'jubba-sahni-park',
      icon: '🌳',
      title: t('jubba_sahni_park'),
      description: t('jubba_sahni_park_desc'),
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: 'Near Railway Station, Muzaffarpur',
      coordinates: { lat: 26.1197, lng: 85.3910 }
    },
    {
      id: 'ramchandra-museum',
      icon: '🏛️',
      title: t('ramchandra_museum'),
      description: t('ramchandra_museum_desc'),
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: 'Near Jubba Sahni Park, Muzaffarpur',
      coordinates: { lat: 26.1197, lng: 85.3910 }
    },
    {
      id: 'khudiram-memorial',
      icon: '⚔️',
      title: t('khudiram_memorial'),
      description: t('khudiram_memorial_desc'),
      image: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: 'Muzaffarpur City, Bihar',
      coordinates: { lat: 26.1197, lng: 85.3910 }
    },
    {
      id: 'motijheel',
      icon: '🏞️',
      title: t('motijheel'),
      description: t('motijheel_desc'),
      image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: 'Muzaffarpur, Bihar',
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
            <h1 className="text-xl font-bold">{t('attractions')}</h1>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to Muzaffarpur
          </h2>
          <p className="text-gray-600">
            Discover the beautiful attractions and heritage sites
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
                  <span>{t('get_directions')}</span>
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
