import React, { useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';

const AvatarUpload = ({ user }) => {
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || 'https://gravatar.com/avatar/');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarChange = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar_${new Date().getTime()}.${fileExt}`;
      const filePath = `users/${user.id}/${fileName}`;

      // Resize image before upload
      const resizedFile = await resizeImage(file, 256, 256);

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, resizedFile);

      if (uploadError) {
        throw uploadError;
      }

      // Generate blob URL from the resized file
      const blobUrl = URL.createObjectURL(resizedFile);
      setAvatarUrl(blobUrl);

      // Update user's avatar URL in the database
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (urlError) {
        throw urlError;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast.success('Avatar updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setUploading(false);
    }
  };

  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(resolve, 'image/png');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleChangeAvatarClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="col-span-full flex items-center gap-x-8">
      <img
        alt="Avatar"
        src={avatarUrl}
        className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
      />
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          accept="image/*"
          className="hidden"
        />
        <Button
          type="button"
          onClick={handleChangeAvatarClick}
          disabled={uploading}
          className="bg-black hover:bg-gray-800 text-white"
        >
          {uploading ? 'Uploading...' : 'Change avatar'}
        </Button>
        <p className="mt-2 text-xs leading-5 text-gray-400">
          JPG, GIF or PNG. 1MB max.
        </p>
      </div>
    </div>
  );
};

export default AvatarUpload;