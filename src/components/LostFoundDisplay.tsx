
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { X, Phone, User, Calendar, MapPin } from 'lucide-react';

interface LostFoundItem {
  id: string;
  name: string;
  phone: string;
  type: 'Lost' | 'Found';
  images: string[];
  submitted_at?: string;
  helpdesk_contact?: string;
  created_at: string;
}

const LostFoundDisplay: React.FC = () => {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Lost' | 'Found'>('Lost');
  const [selectedImages, setSelectedImages] = useState<{ images: string[], currentIndex: number } | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('lost_found_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching items:', error);
      } else {
        // Type assertion to ensure proper typing
        const typedData = (data || []).map(item => ({
          ...item,
          type: item.type as 'Lost' | 'Found'
        }));
        setItems(typedData);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => item.type === activeTab);

  const openImageModal = (images: string[], startIndex: number = 0) => {
    setSelectedImages({ images, currentIndex: startIndex });
  };

  const closeImageModal = () => {
    setSelectedImages(null);
  };

  const nextImage = () => {
    if (selectedImages && selectedImages.currentIndex < selectedImages.images.length - 1) {
      setSelectedImages({
        ...selectedImages,
        currentIndex: selectedImages.currentIndex + 1
      });
    }
  };

  const prevImage = () => {
    if (selectedImages && selectedImages.currentIndex > 0) {
      setSelectedImages({
        ...selectedImages,
        currentIndex: selectedImages.currentIndex - 1
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('Lost')}
          className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'Lost'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          🔍 Lost Items ({items.filter(i => i.type === 'Lost').length})
        </button>
        <button
          onClick={() => setActiveTab('Found')}
          className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'Found'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          📦 Found Items ({items.filter(i => i.type === 'Found').length})
        </button>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">
            {activeTab === 'Lost' ? '🔍' : '📦'}
          </div>
          <p className="text-lg">No {activeTab.toLowerCase()} items found.</p>
          <p className="text-sm mt-2">Be the first to submit a {activeTab.toLowerCase()} item!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 group">
              {/* Image Section */}
              <div className="relative aspect-square bg-gray-100">
                {item.images.length > 0 ? (
                  <div className="relative w-full h-full">
                    <img
                      src={item.images[0]}
                      alt={`${item.type} item`}
                      className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                      onClick={() => openImageModal(item.images, 0)}
                    />
                    {item.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                        +{item.images.length - 1} more
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-sm">No image</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.type === 'Lost' 
                      ? 'bg-red-100 text-red-800 border border-red-200' 
                      : 'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    {item.type}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-900">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm">{item.phone}</span>
                  </div>
                </div>

                {item.type === 'Found' && (item.submitted_at || item.helpdesk_contact) && (
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    {item.submitted_at && (
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>Submitted at: {item.submitted_at}</span>
                      </div>
                    )}
                    {item.helpdesk_contact && (
                      <div className="flex items-center text-xs text-gray-600">
                        <Phone className="w-3 h-3 mr-1" />
                        <span>Helpdesk: {item.helpdesk_contact}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Enhanced Image Modal */}
      {selectedImages && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full w-full">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-0 right-0 z-10 text-white bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-75 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {selectedImages.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  disabled={selectedImages.currentIndex === 0}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-75 transition-colors disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  disabled={selectedImages.currentIndex === selectedImages.images.length - 1}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-75 transition-colors disabled:opacity-30"
                >
                  →
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="flex items-center justify-center h-full">
              <img
                src={selectedImages.images[selectedImages.currentIndex]}
                alt="Full view"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>

            {/* Image Counter */}
            {selectedImages.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                {selectedImages.currentIndex + 1} of {selectedImages.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LostFoundDisplay;
