
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { usePhotoVotes } from '@/hooks/usePhotoVotes';

interface Submission {
  id: string;
  image_url: string;
  created_at: string;
  name: string;
  is_approved: boolean;
  vote_count: number;
}

const Gallery = () => {
  const [photos, setPhotos] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { userVotes, votingStates, toggleVote, hasVoted } = usePhotoVotes();

  /* ------------ fetch all submissions ------------ */
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data, error } = await supabase
          .from('photo_contest_submissions')
          .select('id, image_url, created_at, name, is_approved, vote_count')
          .order('vote_count', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching photos:', error);
          setError('Failed to load photos');
        } else {
          console.log('Fetched photos:', data);
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

  // Real-time updates for vote counts
  useEffect(() => {
    const channel = supabase
      .channel('photo-votes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'photo_contest_submissions'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          if (payload.eventType === 'UPDATE' && payload.new) {
            setPhotos(prev => prev.map(photo => 
              photo.id === payload.new.id 
                ? { ...photo, vote_count: payload.new.vote_count }
                : photo
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleVoteClick = async (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    console.log('Vote clicked for photo:', photoId);
    await toggleVote(photoId);
  };

  /* ------------ ui ------------ */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* header */}
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
          <div className="text-center py-20 text-gray-500">Loading photos…</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>No photos submitted yet.</p>
            <p className="text-xs mt-2">
              Photos from the photo contest will appear here once submitted.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-center">
              <p className="text-gray-600 text-sm">
                {photos.length} photo{photos.length !== 1 ? 's' : ''} submitted to the contest
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Photos are sorted by popularity • Tap ❤️ to vote for your favorites
              </p>
            </div>

            {/* grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="rounded-lg overflow-hidden border shadow-sm bg-white cursor-pointer transform transition-all hover:scale-105 relative"
                  onClick={() => setSelectedImage(photo.image_url)}
                >
                  <img
                    src={photo.image_url}
                    alt={`${photo.name}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement?.insertAdjacentHTML(
                        'afterbegin',
                        '<div class="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">Image not available</div>',
                      );
                    }}
                  />
                  
                  {/* Vote button overlay */}
                  <button
                    onClick={(e) => handleVoteClick(e, photo.id)}
                    disabled={votingStates[photo.id]}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
                      hasVoted(photo.id)
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                    } ${votingStates[photo.id] ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                  >
                    <Heart 
                      className={`w-4 h-4 ${hasVoted(photo.id) ? 'fill-current' : ''}`}
                    />
                  </button>

                  <div className="p-2">
                    <div className="text-sm font-medium text-gray-800">By {photo.name}</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Heart className="w-3 h-3 fill-current text-red-500" />
                        <span className="font-medium">{photo.vote_count || 0}</span>
                        <span className="text-xs">votes</span>
                      </div>
                      {photo.vote_count > 0 && photo.vote_count >= Math.max(...photos.map(p => p.vote_count || 0)) && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                          🏆 Top
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* full-screen modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img src={selectedImage} alt="Full view" className="max-w-full max-h-full object-contain rounded-lg" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
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
