
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Submission {
  id: string;
  image_url: string;
  created_at: string;
  name: string;
}

const Gallery = () => {
  const [photos, setPhotos] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from('photo_contest_submissions')
        .select('id, image_url, created_at, name')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching photos:', error);
      } else {
        setPhotos(data || []);
      }

      setLoading(false);
    };

    fetchPhotos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-gradient text-white px-4 py-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/')} className="text-white">
            ← 
          </button>
          <h1 className="text-lg font-semibold">Gallery</h1>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading photos...</div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No photos submitted yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="rounded-lg overflow-hidden border shadow-sm bg-white cursor-pointer transform transition-all hover:scale-105" onClick={() => setSelectedImage(photo.image_url)}>
                <img
                  src={photo.image_url}
                  alt={`Photo by ${photo.name}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-2">
                  <div className="text-sm font-medium text-gray-800">
                    By {photo.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
