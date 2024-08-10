import { supabase } from '../lib/supabase';
import { getUploadFolder } from '../utils/fileUpload';

export const uploadFile = async (file, conversationId) => {
  // Get the MIME type of the file
  const mimeType = file.type;

  // Determine the folder based on MIME type
  const folder = getUploadFolder(mimeType);

  // Generate a unique file name (e.g., using timestamp)
  const fileName = `${folder}_${new Date().toISOString()}_${file.name}`;

  // Construct the file path
  const filePath = `conversations_${conversationId}/${folder}/${fileName}`;

  // Upload the file to Supabase storage
  const { data, error } = await supabase.storage
    .from('chat-uploads')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  // Get the download URL
  const { data: url, error: urlError } = supabase.storage
    .from('chat-uploads')
    .getPublicUrl(filePath);

  const publicURL = url.publicUrl;

  if (urlError) {
    console.error('Error getting public URL:', urlError);
    return null;
  }

  // Return the public URL for storing in the database or using directly
  return {
    type: folder.slice(0, -1),
    url: publicURL,
    name: file.name,
  };
};
