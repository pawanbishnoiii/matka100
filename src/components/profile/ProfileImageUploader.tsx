
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ProfileImageUploaderProps {
  currentImageUrl?: string;
  onImageUpdate: (imageUrl: string) => void;
}

export const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  currentImageUrl,
  onImageUpdate,
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    if (!user) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update user profile with new image URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_image_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onImageUpdate(publicUrl);
      toast({
        title: 'Success',
        description: 'Profile image updated successfully',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-sm mx-auto">
      <div className="relative">
        <Avatar className="w-24 h-24 sm:w-32 sm:h-32 ring-4 ring-purple-500/20">
          <AvatarImage src={currentImageUrl} className="object-cover" />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl">
            <User className="w-8 h-8" />
          </AvatarFallback>
        </Avatar>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-2 -right-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg transition-colors disabled:opacity-50"
        >
          <Camera className="w-4 h-4" />
        </motion.button>
      </div>

      <motion.div
        className={`
          w-full border-2 border-dashed rounded-lg p-4 text-center transition-all
          ${dragOver ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-300 dark:border-gray-600'}
          ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-purple-400'}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {uploading ? 'Uploading...' : 'Drop image here or click to browse'}
        </p>
        <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
      />
    </div>
  );
};
