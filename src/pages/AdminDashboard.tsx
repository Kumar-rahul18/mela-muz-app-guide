
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

interface CrowdStatus {
  id: string;
  location: string;
  status: 'low' | 'medium' | 'high';
  status_color: 'green' | 'yellow' | 'red';
  description: string;
}

interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

const AdminDashboard: React.FC = () => {
  const [crowdStatuses, setCrowdStatuses] = useState<CrowdStatus[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'low' | 'medium' | 'high'>('low');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    checkAdminAccess();
    fetchCrowdStatuses();
    fetchGalleryImages();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/admin');
      return;
    }

    const { data: adminData, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (error || !adminData) {
      navigate('/admin');
      return;
    }
  };

  const fetchCrowdStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from('crowd_status')
        .select('*')
        .order('location');

      if (error) {
        console.error('Error fetching crowd statuses:', error);
        return;
      }

      const typedData: CrowdStatus[] = (data || []).map(item => ({
        id: item.id,
        location: item.location,
        status: item.status as 'low' | 'medium' | 'high',
        status_color: item.status_color as 'green' | 'yellow' | 'red',
        description: item.description || ''
      }));

      setCrowdStatuses(typedData);
    } catch (error) {
      console.error('Error fetching crowd statuses:', error);
    }
  };

  const fetchGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order');

      if (error) {
        console.error('Error fetching gallery images:', error);
        return;
      }

      setGalleryImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    }
  };

  const updateCrowdStatus = async () => {
    if (!selectedLocation || !selectedStatus) {
      toast({
        title: "Error",
        description: "Please select location and status",
        variant: "destructive"
      });
      return;
    }

    try {
      const statusColor = selectedStatus === 'low' ? 'green' : 
                         selectedStatus === 'medium' ? 'yellow' : 'red';

      const existingStatus = crowdStatuses.find(cs => cs.location === selectedLocation);
      
      if (existingStatus) {
        const { error } = await supabase
          .from('crowd_status')
          .update({
            status: selectedStatus,
            status_color: statusColor,
            description,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingStatus.id);

        if (error) {
          console.error('Error updating crowd status:', error);
          toast({
            title: "Error",
            description: "Failed to update crowd status",
            variant: "destructive"
          });
          return;
        }
      } else {
        const { error } = await supabase
          .from('crowd_status')
          .insert({
            location: selectedLocation,
            status: selectedStatus,
            status_color: statusColor,
            description
          });

        if (error) {
          console.error('Error creating crowd status:', error);
          toast({
            title: "Error",
            description: "Failed to create crowd status",
            variant: "destructive"
          });
          return;
        }
      }

      toast({
        title: "Success",
        description: "Crowd status updated successfully"
      });

      fetchCrowdStatuses();
      setSelectedLocation('');
      setSelectedStatus('low');
      setDescription('');
    } catch (error) {
      console.error('Error updating crowd status:', error);
    }
  };

  const addGalleryImage = async () => {
    if (!imageUrl || !imageTitle) {
      toast({
        title: "Error",
        description: "Please provide image URL and title",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('gallery_images')
        .insert({
          image_url: imageUrl,
          title: imageTitle,
          description: imageDescription,
          display_order: displayOrder,
          is_active: true
        });

      if (error) {
        console.error('Error adding gallery image:', error);
        toast({
          title: "Error",
          description: "Failed to add gallery image",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Gallery image added successfully"
      });

      setImageUrl('');
      setImageTitle('');
      setImageDescription('');
      setDisplayOrder(1);
      fetchGalleryImages();
    } catch (error) {
      console.error('Error adding gallery image:', error);
    }
  };

  const toggleImageStatus = async (imageId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_active: !currentStatus })
        .eq('id', imageId);

      if (error) {
        console.error('Error updating image status:', error);
        return;
      }

      toast({
        title: "Success",
        description: "Image status updated successfully"
      });

      fetchGalleryImages();
    } catch (error) {
      console.error('Error updating image status:', error);
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId);

      if (error) {
        console.error('Error deleting image:', error);
        return;
      }

      toast({
        title: "Success",
        description: "Image deleted successfully"
      });

      fetchGalleryImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-orange-800">{t('admin.dashboard')}</h1>
          <Button onClick={handleLogout} variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Crowd Status Management */}
          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-pink-100">
              <CardTitle className="text-orange-800">{t('admin.crowd_management')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-orange-700">
                  {t('admin.location')}
                </label>
                <Input
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  placeholder="Enter location name"
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-orange-700">
                  {t('admin.status')}
                </label>
                <Select value={selectedStatus} onValueChange={(value: 'low' | 'medium' | 'high') => setSelectedStatus(value)}>
                  <SelectTrigger className="border-orange-200 focus:border-orange-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('admin.low')}</SelectItem>
                    <SelectItem value="medium">{t('admin.medium')}</SelectItem>
                    <SelectItem value="high">{t('admin.high')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-orange-700">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
              <Button onClick={updateCrowdStatus} className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                {t('admin.update_status')}
              </Button>
            </CardContent>
          </Card>

          {/* Gallery Management */}
          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
              <CardTitle className="text-purple-800">{t('admin.gallery_management')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-purple-700">
                  Image URL
                </label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-purple-700">
                  Image Title
                </label>
                <Input
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  placeholder="Enter image title"
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-purple-700">
                  Description
                </label>
                <Textarea
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  placeholder="Enter image description"
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-purple-700">
                  Display Order
                </label>
                <Input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                  placeholder="Display order"
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
              <Button onClick={addGalleryImage} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                {t('admin.add_image')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Current Crowd Statuses */}
        <Card className="mb-6 border-orange-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-100 to-pink-100">
            <CardTitle className="text-orange-800">Current Crowd Statuses</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {crowdStatuses.map((status) => (
                <div key={status.id} className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-gradient-to-r from-orange-50 to-pink-50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      status.status_color === 'green' ? 'bg-green-500' :
                      status.status_color === 'yellow' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-orange-800">{status.location}</p>
                      <p className="text-sm text-orange-600">{status.description}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    status.status_color === 'green' ? 'bg-green-100 text-green-700' :
                    status.status_color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {status.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gallery Images Management */}
        <Card className="border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
            <CardTitle className="text-purple-800">Gallery Images</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div key={image.id} className="border border-purple-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-pink-50">
                  <img 
                    src={image.image_url} 
                    alt={image.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-semibold text-purple-800">{image.title}</h3>
                  <p className="text-sm text-purple-600 mb-2">{image.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-500">Order: {image.display_order}</span>
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        variant={image.is_active ? "default" : "outline"}
                        onClick={() => toggleImageStatus(image.id, image.is_active)}
                        className="text-xs"
                      >
                        {image.is_active ? 'Active' : 'Inactive'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteImage(image.id)}
                        className="text-xs"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
