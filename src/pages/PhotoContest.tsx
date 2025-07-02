
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import CameraUpload from '@/components/CameraUpload';

const PhotoContest = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    description: '',
    image: null as File | null
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoSelected = (file: File) => {
    setFormData({ ...formData, image: file });
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.image) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image to storage
      const fileExt = formData.image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading file to photo-contest bucket:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('photo-contest')
        .upload(filePath, formData.image);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photo-contest')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', publicUrl);

      // Save submission to database
      const { data, error: dbError } = await supabase
        .from('photo_contest_submissions')
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            description: formData.description,
            image_url: publicUrl
          }
        ])
        .select();

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      console.log('Successfully saved submission:', data);

      toast({
        title: "Photo submitted successfully!",
        description: "Your entry has been received for the contest."
      });
      
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error submitting photo:', error);
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-gradient text-white px-4 py-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/')} className="text-white">
            ← 
          </button>
          <h1 className="text-lg font-semibold">{t('photo_contest')}</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-3 app-gradient rounded-2xl flex items-center justify-center">
              <span className="text-2xl text-white">📸</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{t('submit_your_entry')}</h2>
            <p className="text-gray-600 text-sm">{t('share_best_moments')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('full_name')} *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('enter_name')}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('phone_number')} *
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t('enter_phone')}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('photo_description')}
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={language === 'hi' ? 'अपनी फोटो का वर्णन करें (वैकल्पिक)' : 'Describe your photo (optional)'}
                className="w-full h-20"
                disabled={isSubmitting}
              />
            </div>

            <CameraUpload
              label={t('upload_contest_photo')}
              onPhotoSelected={handlePhotoSelected}
              preview={photoPreview}
              required
            />

            <Button 
              type="submit" 
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full text-lg font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('submitting') : t('submit_entry_button')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhotoContest;
