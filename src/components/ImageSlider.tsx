import React, { useState, useEffect } from 'react';

interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  description: string;
}

const ImageSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images: GalleryImage[] = [
    {
      id: '1',
      image_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Morning Prayer',
      description: 'Beautiful morning aarti ceremony',
    },
    {
      id: '2',
      image_url: 'https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/gallary-mages//Garibnath.jpg?auto=format&fit=crop&w=800&q=80',
      title: 'Temple View',
      description: 'Magnificent temple architecture',
    },
    {
      id: '3',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Evening Aarti',
      description: 'Devotees participating in evening prayers',
    },
    {
      id: '4',
      image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Cultural Dance',
      description: 'Traditional dance performance',
    },
    {
      id: '5',
      image_url: 'https://images.unsplash.com/photo-1566495757213-570fdc4b71b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Festival Crowd',
      description: 'Devotees gathering for the mela',
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-56 overflow-hidden rounded-2xl shadow-xl border-4 border-orange-300">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-600/90 to-pink-600/90 text-white p-4 z-30">
        <h1 className="text-2xl font-bold">SHARAVANI MELA</h1>
        <div className="flex items-center space-x-2">
          <span className="text-lg">📷</span>
          <span className="text-lg font-semibold">PHOTO CONTEST</span>
        </div>
        <div className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-medium inline-block mt-1">
          Pic of the Day
        </div>
      </div>

      {/* Slide Images */}
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img src={image.image_url} alt={image.title} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 z-20">
           
            
          </div>
        </div>
      ))}

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full border-2 border-white transition ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
