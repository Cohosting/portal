import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../lib/supabase';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Eye } from 'lucide-react';

// Helper to sanitize file names
const sanitizeFileName = (name) => {
  return name
    .replace(/[^\w.-]/g, '_')  // Replace unsafe characters with underscores
    .replace(/_+/g, '_')       // Collapse multiple underscores
    .toLowerCase();            // Optional: lowercase for consistency
};

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
        const uniqueSuffix = uuidv4().split('-')[0];
        const sanitizedFileName = sanitizeFileName(file.name);
        const path = `invoice/${sanitizedFileName}-${uniqueSuffix}`;

        const { error, data } = await supabase.storage
          .from('portal_bucket')
          .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
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
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="mt-6">
      <Label className="block text-[15px] font-medium mb-2">Attachments</Label>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1">
          <div className="flex w-full">
            <label 
              className="flex flex-1 items-center px-3 py-1 text-sm border border-gray-300 bg-white rounded-l-md cursor-pointer"
            >
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                className="hidden"
              />
              <span className="text-gray-500">
                {files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''} selected` : 'Choose files'}
              </span>
            </label>
            <Button
              onClick={() => {
                handleUpload();
                clearFileInput();
              }}
              disabled={uploading || files.length === 0}
              className="rounded-l-none bg-gray-600 hover:bg-gray-700 text-white"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div key={file.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-md bg-white">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </a>
                </div>
              </div>
              <Button
                onClick={() => removeAttachment(index)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
