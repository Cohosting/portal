import { supabase } from '../lib/supabase';
import { getUploadFolder } from '../utils/fileUpload';

// Helper to turn bytes into something like "1.2 MB"
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = Math.max(decimals, 0);
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const uploadFile = async (file, conversationId) => {
  // Get the MIME type of the file
  const mimeType = file.type;

  // Determine the folder based on MIME type
  const folder = getUploadFolder(mimeType);

  // Generate a unique file name
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
  const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
  const uniqueFileName = `${timestamp}_${safeFileName}`;

  // Construct the file path
  const filePath = `conversations_${conversationId}/${folder}/${uniqueFileName}`;

  // Upload the file to Supabase storage
  const { data, error } = await supabase.storage
    .from('chat-uploads')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading file:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get the download URL
  const { data: url, error: urlError } = supabase.storage
    .from('chat-uploads')
    .getPublicUrl(filePath);

  if (urlError) {
    console.error('Error getting public URL:', urlError);
    throw new Error(`Failed to get public URL: ${urlError.message}`);
  }

  const publicURL = url.publicUrl;

  // Return the public URL plus size info
  return {
    type: folder.slice(0, -1),
    url: publicURL,
    name: file.name,
    filePath: filePath,           // for deletion later
    size: file.size,              // raw bytes
    sizeReadable: formatBytes(file.size)  // e.g. "1.23 MB"
  };
};


// New deleteFile function for Supabase
export const deleteFile = async (filePath, conversationId) => {
  try {
    console.log('🗑️ Attempting to delete file:', { filePath, conversationId });

    // Extract file path from the public URL
     
    if (!filePath) {
      throw new Error('Could not extract file path from URL');
    }

    console.log('📂 Extracted file path:', filePath);

    // Delete the file from Supabase storage
    const { data, error } = await supabase.storage
      .from('chat-uploads')
      .remove([filePath]);

    if (error) {
      console.error('❌ Supabase delete error:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }

    console.log('✅ File deleted successfully from Supabase:', data);
    return { success: true, deletedPath: filePath };
  } catch (error) {
    console.error('❌ Error deleting file:', error);
    throw error;
  }
};

// Helper function to extract file path from Supabase public URL
const extractFilePathFromUrl = (publicUrl, conversationId) => {
  try {
    // Supabase public URLs typically look like:
    // https://[project].supabase.co/storage/v1/object/public/chat-uploads/conversations_123/images/filename.jpg
    
    // Find the bucket name and extract everything after it
    const bucketName = 'chat-uploads';
    const bucketIndex = publicUrl.indexOf(`/public/${bucketName}/`);
    
    if (bucketIndex === -1) {
      // Alternative approach: look for conversation pattern
      const conversationPattern = `conversations_${conversationId}`;
      const conversationIndex = publicUrl.indexOf(conversationPattern);
      
      if (conversationIndex === -1) {
        throw new Error('Could not find conversation pattern in URL');
      }
      
      // Extract from conversation pattern to end of URL (before query params)
      const pathStart = conversationIndex;
      const url = new URL(publicUrl);
      const pathWithoutQuery = url.pathname;
      const relevantPart = pathWithoutQuery.substring(pathWithoutQuery.indexOf(conversationPattern));
      
      return relevantPart;
    }
    
    // Extract the file path after /public/bucket-name/
    const pathStart = bucketIndex + `/public/${bucketName}/`.length;
    const url = new URL(publicUrl);
    const pathWithoutQuery = url.pathname;
    const filePath = pathWithoutQuery.substring(pathStart);
    
    return filePath;
  } catch (error) {
    console.error('Error extracting file path from URL:', error);
    
    // Fallback: try to construct path from URL components
    try {
      const url = new URL(publicUrl);
      const pathSegments = url.pathname.split('/');
      
      // Look for conversations_ pattern
      const conversationSegmentIndex = pathSegments.findIndex(segment => 
        segment.startsWith(`conversations_${conversationId}`)
      );
      
      if (conversationSegmentIndex !== -1) {
        // Join segments from conversation folder onwards
        return pathSegments.slice(conversationSegmentIndex).join('/');
      }
    } catch (fallbackError) {
      console.error('Fallback extraction also failed:', fallbackError);
    }
    
    return null;
  }
};

// Alternative delete function if you have the file path stored
export const deleteFileByPath = async (filePath) => {
  try {
    console.log('🗑️ Deleting file by path:', filePath);

    const { data, error } = await supabase.storage
      .from('chat-uploads')
      .remove([filePath]);

    if (error) {
      console.error('❌ Supabase delete error:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }

    console.log('✅ File deleted successfully:', data);
    return { success: true, deletedPath: filePath };
  } catch (error) {
    console.error('❌ Error deleting file by path:', error);
    throw error;
  }
};

// Batch delete function for multiple files
export const deleteMultipleFiles = async (fileUrls, conversationId) => {
  try {
    console.log('🗑️ Batch deleting files:', fileUrls.length);
    
    // Extract all file paths
    const filePaths = fileUrls.map(url => extractFilePathFromUrl(url, conversationId)).filter(Boolean);
    
    if (filePaths.length === 0) {
      throw new Error('No valid file paths found');
    }

    // Delete all files in one batch operation
    const { data, error } = await supabase.storage
      .from('chat-uploads')
      .remove(filePaths);

    if (error) {
      console.error('❌ Batch delete error:', error);
      throw new Error(`Batch delete failed: ${error.message}`);
    }

    console.log('✅ Batch delete successful:', data);
    return {
      success: true,
      deletedPaths: filePaths,
      deletedCount: filePaths.length
    };
  } catch (error) {
    console.error('❌ Error in batch delete:', error);
    throw error;
  }
};

// Function to clean up files for an entire conversation
export const deleteConversationFiles = async (conversationId) => {
  try {
    console.log('🗑️ Cleaning up all files for conversation:', conversationId);
    
    const folderPath = `conversations_${conversationId}`;
    
    // List all files in the conversation folder
    const { data: files, error: listError } = await supabase.storage
      .from('chat-uploads')
      .list(folderPath, {
        limit: 1000,
        offset: 0
      });

    if (listError) {
      console.error('❌ Error listing files:', listError);
      throw new Error(`Failed to list files: ${listError.message}`);
    }

    if (!files || files.length === 0) {
      console.log('ℹ️ No files found for conversation');
      return { success: true, deletedCount: 0 };
    }

    // Delete all files in the conversation folder
    const filePaths = files.map(file => `${folderPath}/${file.name}`);
    
    const { data, error } = await supabase.storage
      .from('chat-uploads')
      .remove(filePaths);

    if (error) {
      console.error('❌ Error deleting conversation files:', error);
      throw new Error(`Failed to delete conversation files: ${error.message}`);
    }

    console.log('✅ Successfully deleted all conversation files:', data);
    return {
      success: true,
      deletedCount: filePaths.length,
      deletedPaths: filePaths
    };
  } catch (error) {
    console.error('❌ Error cleaning up conversation files:', error);
    throw error;
  }
};