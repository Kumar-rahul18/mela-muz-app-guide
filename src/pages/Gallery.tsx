
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Submission {
  id: string;
  image_url: string;
  created_at: string;
  name: string;
  is_approved: boolean;
}

const Gallery = () => {
  const [photos, setPhotos] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        console.log('Fetching all photos from photo_contest_submissions...');
        
        const { data, error } = await supabase
          .from('photo_contest_submissions')
          .select('id, image_url, created_at, name, is_approved')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching photos:', error);
          setError('Failed to load photos');
        } else {
          console.log('Successfully fetched photos:', data);
          setPhotos(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
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
          <h1 className="text-lg font-semibold">Photo Contest Gallery</h1>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading photos...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>No photos submitted yet.</p>
            <p className="text-xs mt-2">Photos from the photo contest will appear here once submitted.</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-center">
              <p className="text-gray-600 text-sm">
                {photos.length} photo{photos.length !== 1 ? 's' : ''} submitted to the contest
              </p>
              <p className="text-gray-500 text-xs mt-1">
                All submissions are shown here regardless of approval status
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div 
                  key={photo.id} 
                  className="rounded-lg overflow-hidden border shadow-sm bg-white cursor-pointer transform transition-all hover:scale-105 relative" 
                  onClick={() => setSelectedImage(photo.image_url)}
                >
                  <img
                    src={photo.image_url}
                    alt={`Photo by ${photo.name}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', photo.image_url);
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement?.insertAdjacentHTML('afterbegin', 
                        '<div class="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">Image not available</div>'
                      );
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    {photo.is_approved ? (
                      <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        ✓ Approved
                      </div>
                    ) : (
                      <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Pending
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <div className="text-sm font-medium text-gray-800">
                      By {photo.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
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
