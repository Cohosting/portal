import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../lib/supabase';
import { Eye, X } from '@phosphor-icons/react';

export const UploadAttachmentComponent = ({ setAttachments }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleUpload = async () => {
    if (files.length > 0) {
      setUploading(true);
      const uploadPromises = files.map(async (file) => {
        const uniqueSuffix = uuidv4().split('-')[0]; // Shorten the UUID for uniqueness
        const path = `invoice/${file.name}-${uniqueSuffix}`;
        const { error, data } = await supabase.storage
          .from('portal_bucket')
          .upload(path, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Upload error', error.message);
          return null;
        } else {
          const { data: { publicUrl } } = supabase
            .storage
            .from('portal_bucket')
            .getPublicUrl(path);
          return { id: uuidv4(), name: file.name, url: publicUrl };
        }
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean);

      setUploadedFiles((prev) => [...prev, ...successfulUploads]);
      setAttachments([...uploadedFiles, ...successfulUploads]);
      setFiles([]);
      setUploading(false);
    }
  };

  const removeAttachment = useCallback((index) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
    setAttachments((prev) => {
      const newAttachments = [...prev];
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  }, [setAttachments]);

  const clearFileInput = () => {
    // This function is used to clear the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center space-x-2">
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        <button
          onClick={() => {
            handleUpload();
            clearFileInput();
          }}
          disabled={uploading || files.length === 0}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {files.length > 0 && (
        <div className="text-sm text-gray-500">
          {files.length} file(s) selected
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {uploadedFiles.map((file, index) => (
          <div key={file.id} className="relative p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium truncate">{file.name}</span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <Eye size={16} className="mr-1" />
              <span className="text-sm">Preview</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};