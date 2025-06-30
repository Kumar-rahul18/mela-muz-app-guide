
// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { useForm } from 'react-hook-form';
// import { supabase } from '@/integrations/supabase/client';
// import { useToast } from '@/hooks/use-toast';
// import { X, Upload, Image as ImageIcon } from 'lucide-react';

// interface LostFoundFormData {
//   name: string;
//   phone: string;
//   type: 'Lost' | 'Found';
//   submitted_at?: string;
//   helpdesk_contact?: string;
// }

// interface LostFoundFormProps {
//   onSuccess: () => void;
// }

// const LostFoundForm: React.FC<LostFoundFormProps> = ({ onSuccess }) => {
//   const [images, setImages] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const { toast } = useToast();

//   const form = useForm<LostFoundFormData>({
//     defaultValues: {
//       name: '',
//       phone: '',
//       type: 'Lost',
//       submitted_at: '',
//       helpdesk_contact: ''
//     }
//   });

//   const watchType = form.watch('type');

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       const fileArray = Array.from(files).slice(0, 3);
//       setImages(fileArray);
      
//       // Create previews
//       const previews = fileArray.map(file => URL.createObjectURL(file));
//       setImagePreviews(previews);
//     }
//   };

//   const removeImage = (index: number) => {
//     const newImages = images.filter((_, i) => i !== index);
//     const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
//     // Revoke the URL to prevent memory leaks
//     URL.revokeObjectURL(imagePreviews[index]);
    
//     setImages(newImages);
//     setImagePreviews(newPreviews);
//   };

//   const uploadImages = async (): Promise<string[]> => {
//     const uploadedUrls: string[] = [];
    
//     for (const image of images) {
//       const fileName = `${Date.now()}-${Math.random()}.${image.name.split('.').pop()}`;
//       const { data, error } = await supabase.storage
//         .from('lost-found-images')
//         .upload(fileName, image);

//       if (error) {
//         console.error('Error uploading image:', error);
//         throw error;
//       }

//       const { data: publicUrlData } = supabase.storage
//         .from('lost-found-images')
//         .getPublicUrl(fileName);
      
//       uploadedUrls.push(publicUrlData.publicUrl);
//     }
    
//     return uploadedUrls;
//   };

//   const onSubmit = async (data: LostFoundFormData) => {
//     if (images.length === 0) {
//       toast({
//         title: "Error",
//         description: "Please upload at least one image",
//         variant: "destructive"
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       const imageUrls = await uploadImages();
      
//       const submitData = {
//         name: data.name,
//         phone: data.phone,
//         type: data.type,
//         images: imageUrls,
//         submitted_at: data.type === 'Found' ? data.submitted_at : null,
//         helpdesk_contact: data.type === 'Found' ? data.helpdesk_contact : null
//       };

//       const { error } = await supabase
//         .from('lost_found_items')
//         .insert([submitData]);

//       if (error) {
//         throw error;
//       }

//       toast({
//         title: "Success",
//         description: "Your item has been submitted successfully",
//       });

//       form.reset();
//       setImages([]);
//       setImagePreviews([]);
//       onSuccess();
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast({
//         title: "Error",
//         description: "Failed to submit your item",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card className="w-full max-w-2xl mx-auto">
//       <CardHeader>
//         <CardTitle className="text-xl font-semibold text-center">Lost & Found Form</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="name"
//               rules={{ required: "Name is required" }}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter your name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="phone"
//               rules={{ 
//                 required: "Phone number is required",
//                 pattern: {
//                   value: /^[0-9]{10}$/,
//                   message: "Please enter a valid 10-digit phone number"
//                 }
//               }}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Phone Number</FormLabel>
//                   <FormControl>
//                     <Input type="tel" placeholder="Enter phone number" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="type"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Type</FormLabel>
//                   <FormControl>
//                     <select 
//                       {...field} 
//                       className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
//                     >
//                       <option value="Lost">Lost</option>
//                       <option value="Found">Found</option>
//                     </select>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {watchType === 'Found' && (
//               <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
//                 <h4 className="font-medium text-green-800">Found Item Details</h4>
//                 <FormField
//                   control={form.control}
//                   name="submitted_at"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Submitted At (Helpdesk Name)</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter helpdesk name" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="helpdesk_contact"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Helpdesk Contact Number</FormLabel>
//                       <FormControl>
//                         <Input type="tel" placeholder="Enter helpdesk contact" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             )}

//             <div className="space-y-4">
//               <label className="text-sm font-medium">Upload Images (Max 3)</label>
              
//               {/* Upload Button */}
//               <div className="flex items-center justify-center w-full">
//                 <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                     <Upload className="w-8 h-8 mb-2 text-gray-500" />
//                     <p className="mb-2 text-sm text-gray-500">
//                       <span className="font-semibold">Click to upload</span> or drag and drop
//                     </p>
//                     <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 3 files)</p>
//                   </div>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={handleImageChange}
//                     className="hidden"
//                   />
//                 </label>
//               </div>

//               {/* Image Previews */}
//               {imagePreviews.length > 0 && (
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium text-gray-700">Selected Images:</p>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {imagePreviews.map((preview, index) => (
//                       <div key={index} className="relative group">
//                         <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
//                           <img
//                             src={preview}
//                             alt={`Preview ${index + 1}`}
//                             className="w-full h-full object-cover transition-transform group-hover:scale-105"
//                           />
//                           <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
//                           <button
//                             type="button"
//                             onClick={() => removeImage(index)}
//                             className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                         <div className="mt-1 flex items-center text-xs text-gray-500">
//                           <ImageIcon className="w-3 h-3 mr-1" />
//                           <span className="truncate">{images[index]?.name}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? 'Submitting...' : 'Submit'}
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// };

// export default LostFoundForm;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { X, Image as ImageIcon } from 'lucide-react';

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

      const previews = fileArray.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(newImages);
    setImagePreviews(newPreviews);
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

      const { error } = await supabase.from('lost_found_items').insert([submitData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your item has been submitted successfully"
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              </div>
            )}

            {/* 👇 Image Upload (Now WebView-friendly) */}
            <div className="space-y-4">
              <FormLabel className="text-sm font-medium">Upload Images (Max 3)</FormLabel>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-80 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        <span className="truncate">{images[index]?.name}</span>
                      </div>
                    </div>
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
