
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const AdminDashboard: React.FC = () => {
  const [crowdStatuses, setCrowdStatuses] = useState<CrowdStatus[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'low' | 'medium' | 'high'>('low');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    checkAdminAccess();
    fetchCrowdStatuses();
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

      setCrowdStatuses(data || []);
    } catch (error) {
      console.error('Error fetching crowd statuses:', error);
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
          is_active: true,
          display_order: 999
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
    } catch (error) {
      console.error('Error adding gallery image:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('admin.dashboard')}</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Crowd Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.crowd_management')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('admin.location')}
                </label>
                <Input
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  placeholder="Enter location name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('admin.status')}
                </label>
                <Select value={selectedStatus} onValueChange={(value: 'low' | 'medium' | 'high') => setSelectedStatus(value)}>
                  <SelectTrigger>
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
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                />
              </div>
              <Button onClick={updateCrowdStatus} className="w-full">
                {t('admin.update_status')}
              </Button>
            </CardContent>
          </Card>

          {/* Gallery Management */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.gallery_management')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Image URL
                </label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Image Title
                </label>
                <Input
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  placeholder="Enter image title"
                />
              </div>
              <Button onClick={addGalleryImage} className="w-full">
                {t('admin.add_image')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Current Crowd Statuses */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Current Crowd Statuses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {crowdStatuses.map((status) => (
                <div key={status.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      status.status_color === 'green' ? 'bg-green-500' :
                      status.status_color === 'yellow' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{status.location}</p>
                      <p className="text-sm text-gray-500">{status.description}</p>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
