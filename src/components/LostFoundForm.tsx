
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CameraUpload from '@/components/CameraUpload';

interface LostFoundFormData {
  name: string;
  phone: string;
  type: 'Lost' | 'Found';
  submitted_at?: string;
  helpdesk_contact?: string;
}

interface LostFoundFormProps {
  onSuccess: () => void;
}

const LostFoundForm: React.FC<LostFoundFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<LostFoundFormData>({
    defaultValues: {
      name: '',
      phone: '',
      type: 'Lost',
      submitted_at: '',
      helpdesk_contact: ''
    }
  });

  const watchType = form.watch('type');

  const handlePhotoSelected = (file: File) => {
    console.log('Photo selected for Lost & Found:', file.name);
    setImage(file);

    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string> => {
    if (!image) throw new Error('No image selected');

    const fileName = `${Date.now()}-${Math.random()}.${image.name.split('.').pop()}`;
    console.log('Uploading image to lost-found-images bucket:', fileName);
    
    const { error } = await supabase.storage
      .from('lost-found-images')
      .upload(fileName, image);

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('lost-found-images')
      .getPublicUrl(fileName);

    console.log('Generated public URL:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  };

  const onSubmit = async (data: LostFoundFormData) => {
    if (!image) {
      toast({
        title: 'Error',
        description: 'Please upload a photo of the item',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Starting submission process...');
      const imageUrl = await uploadImage();

      const submitData = {
        name: data.name,
        phone: data.phone,
        type: data.type,
        images: [imageUrl], // Database expects array of URLs
        submitted_at: data.type === 'Found' ? data.submitted_at : null,
        helpdesk_contact: data.type === 'Found' ? data.helpdesk_contact : null
      };

      console.log('Submitting data to database:', submitData);

      const { data: result, error } = await supabase
        .from('lost_found_items')
        .insert([submitData])
        .select();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Successfully saved submission:', result);

      toast({ 
        title: 'Success', 
        description: 'Item submitted successfully!' 
      });
      
      form.reset();
      setImage(null);
      setPreview(null);
      onSuccess();
    } catch (err) {
      console.error('Submission error:', err);
      toast({
        title: 'Error',
        description: 'Failed to submit your item. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Lost &amp; Found Form
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              rules={{
                required: 'Phone number is required',
                pattern: { value: /^[0-9]{10}$/, message: 'Enter a 10‑digit number' }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="Lost">Lost</option>
                      <option value="Found">Found</option>
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />

            {watchType === 'Found' && (
              <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800">Found Item Details</h4>

                <FormField
                  control={form.control}
                  name="submitted_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Submitted At (Helpdesk Name)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter helpdesk name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="helpdesk_contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Helpdesk Contact Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Enter helpdesk contact" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            <CameraUpload
              label="Upload Item Photo"
              onPhotoSelected={handlePhotoSelected}
              preview={preview}
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting…' : 'Submit'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LostFoundForm;
