
import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { supabase } from '@/integrations/supabase/client';

interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  description: string;
}

const ImageSlider: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Placeholder images for picture of the day
  const placeholderImages = [
    {
      id: '1',
      image_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Morning Prayer',
      description: 'Beautiful morning aarti ceremony'
    },
    {
      id: '2',
      image_url: 'https://images.unsplash.com/photo-1544913161-649431ccf735?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Temple View',
      description: 'Magnificent temple architecture'
    },
    {
      id: '3',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Evening Aarti',
      description: 'Devotees participating in evening prayers'
    },
    {
      id: '4',
      image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Cultural Dance',
      description: 'Traditional dance performance'
    },
    {
      id: '5',
      image_url: 'https://images.unsplash.com/photo-1566495757213-570fdc4b71b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Festival Crowd',
      description: 'Devotees gathering for the mela'
    }
  ];

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const imagesToShow = images.length > 0 ? images : placeholderImages;
    if (imagesToShow.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesToShow.length);
    }, 2000); // 2 seconds interval

    return () => clearInterval(interval);
  }, [images.length]);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
        .limit(5);

      if (error) {
        console.error('Error fetching images:', error);
        return;
      }

      if (data && data.length > 0) {
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const imagesToShow = images.length > 0 ? images : placeholderImages;

  if (imagesToShow.length === 0) {
    return (
      <div className="w-full h-56 bg-gradient-to-r from-orange-200 to-pink-200 rounded-2xl flex items-center justify-center border-4 border-orange-300 shadow-lg">
        <div className="text-center">
          <div className="text-4xl mb-2">🎭</div>
          <span className="text-orange-800 font-semibold">Sharavani Mela Gallery</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-xl border-4 border-orange-300">
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-600/90 to-pink-600/90 text-white p-4 z-20">
        <h1 className="text-2xl font-bold">SHARAVANI MELA</h1>
        <div className="flex items-center space-x-2">
          <span className="text-lg">📷</span>
          <span className="text-lg font-semibold">PHOTO CONTEST</span>
        </div>
        <div className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-medium inline-block mt-1">
          Pic of the Day
        </div>
      </div>

      <Carousel className="w-full h-full">
        <CarouselContent>
          {imagesToShow.map((image, index) => (
            <CarouselItem key={image.id} className={index === currentIndex ? 'block' : 'hidden'}>
              <div className="relative w-full h-56">
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                  {image.description && (
                    <p className="text-white/90 text-sm">{image.description}</p>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-white/80 hover:bg-white" />
        <CarouselNext className="right-2 bg-white/80 hover:bg-white" />
      </Carousel>
      
      {/* Dots indicator */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {imagesToShow.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full border-2 border-white ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
