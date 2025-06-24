
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files).slice(0, 3);
      setImages(fileArray);
      
      // Create previews
      const previews = fileArray.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const image of images) {
      const fileName = `${Date.now()}-${Math.random()}.${image.name.split('.').pop()}`;
      const { data, error } = await supabase.storage
        .from('lost-found-images')
        .upload(fileName, image);

      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('lost-found-images')
        .getPublicUrl(fileName);
      
      uploadedUrls.push(publicUrlData.publicUrl);
    }
    
    return uploadedUrls;
  };

  const onSubmit = async (data: LostFoundFormData) => {
    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one image",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const imageUrls = await uploadImages();
      
      const submitData = {
        name: data.name,
        phone: data.phone,
        type: data.type,
        images: imageUrls,
        submitted_at: data.type === 'Found' ? data.submitted_at : null,
        helpdesk_contact: data.type === 'Found' ? data.helpdesk_contact : null
      };

      const { error } = await supabase
        .from('lost_found_items')
        .insert([submitData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Your item has been submitted successfully",
      });

      form.reset();
      setImages([]);
      setImagePreviews([]);
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit your item",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">Lost & Found Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Name is required" }}
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
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number"
                }
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
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="Lost">Lost</option>
                      <option value="Found">Found</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchType === 'Found' && (
              <>
                <FormField
                  control={form.control}
                  name="submitted_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Submitted At (Helpdesk Name)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter helpdesk name" {...field} />
                      </FormControl>
                      <FormMessage />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Images (Max 3)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {imagePreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LostFoundForm;
