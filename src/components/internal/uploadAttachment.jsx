// src/components/internal/UploadAttachmentComponent.jsx
import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../lib/supabase';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Eye, Loader } from 'lucide-react';

// Helper to sanitize file names
const sanitizeFileName = (name) =>
  name
    .replace(/[^\w.-]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();

export const UploadAttachmentComponent = ({
  attachments = [],    // ← default to []
  setAttachments,
}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [removingIds, setRemovingIds] = useState([]);

  // Always work with a true array
  const safeAttachments = Array.isArray(attachments) ? attachments : [];

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  };

  const clearFileInput = () => {
    const input = document.querySelector('input[type="file"]');
    if (input) input.value = '';
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);

    const uploadPromises = files.map(async (file) => {
      const suffix = uuidv4().split('-')[0];
      const name = sanitizeFileName(file.name);
      const path = `invoice/${name}-${suffix}`;

      const { error } = await supabase.storage
        .from('portal_bucket')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Upload error', error.message);
        return null;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from('portal_bucket')
        .getPublicUrl(path);

      return { id: uuidv4(), name: file.name, url: publicUrl };
    });

    const results = await Promise.all(uploadPromises);
    const successful = results.filter((r) => r);
    setAttachments([...safeAttachments, ...successful]);

    setFiles([]);
    clearFileInput();
    setUploading(false);
  };

  const removeAttachment = useCallback(
    async (index) => {
      const file = safeAttachments[index];
      if (!file) return;

      // mark as removing
      setRemovingIds((prev) => [...prev, file.id]);

      // derive your storage path from the URL
      const urlParts = file.url.split('/');
      const path = urlParts.slice(-2).join('/'); 

      const { error: deleteError } = await supabase
        .storage
        .from('portal_bucket')
        .remove([path]);

      if (deleteError) {
        console.error('Failed to delete file:', deleteError.message);
        // optional: toast.error(...)
      }

      // remove from array
      const next = safeAttachments.filter((_, i) => i !== index);
      setAttachments(next);

      // un-mark removing
      setRemovingIds((prev) => prev.filter((id) => id !== file.id));
    },
    [safeAttachments, setAttachments]
  );

  return (
    <div className="mt-6">
      <Label className="block text-[15px] font-medium mb-2">
        Attachments
      </Label>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1">
          <div className="flex w-full">
            <label className="flex flex-1 items-center px-3 py-1 text-sm border border-gray-300 bg-white rounded-l-md cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                className="hidden"
              />
              <span className="text-gray-500">
                {files.length > 0
                  ? `${files.length} file${files.length > 1 ? 's' : ''} selected`
                  : 'Choose files'}
              </span>
            </label>
            <Button
              onClick={handleUpload}
              disabled={uploading || !files.length}
              className="rounded-l-none bg-gray-600 hover:bg-gray-700 text-white"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      </div>

      {safeAttachments.length > 0 && (
        <div className="space-y-2">
          {safeAttachments.map((file, idx) => {
            const isRemoving = removingIds.includes(file.id);
            return (
              <div
                key={file.id}
                className="flex justify-between items-center p-3 border border-gray-200 rounded-md bg-white"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md text-gray-500">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
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
                  onClick={() => removeAttachment(idx)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                  disabled={isRemoving}
                >
                  {isRemoving ? (
                    <Loader className="animate-spin h-4 w-4 text-gray-500" />
                  ) : (
                    <X className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
