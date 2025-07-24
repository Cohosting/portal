import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { XCircle, Plus, RotateCcw } from 'lucide-react';

export const AssetItem = ({
  field,
  onUpload,
  initialDownloadUrl,
  text,
  subText,
}) => {
  const [downloadURL, setDownloadURL] = useState(initialDownloadUrl || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Validate file type
  const isValidImageType = (file) => {
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    return validTypes.includes(file.type);
  };

  const handleUpload = async (selectedImage) => {
    if (selectedImage) {
      // Clear any previous errors
      setUploadError('');
      
      // Validate file type
      if (!isValidImageType(selectedImage)) {
        setUploadError('Please select a PNG or JPG image file.');
        return;
      }

      setIsUploading(true);
      const randomId = uuidv4();
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}-${randomId}.${fileExt}`;

      let { error } = await supabase.storage
        .from('portal_bucket')
        .upload(filePath, selectedImage, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error', error.message);
        setUploadError('Upload failed. Please try again.');
      } else {
        const { data: { publicUrl } } = supabase
          .storage
          .from('portal_bucket')
          .getPublicUrl(filePath);
        setDownloadURL(publicUrl);
        onUpload(field, publicUrl);
      }
      setIsUploading(false);
    }
  };

  const handleFileOpen = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setDownloadURL('');
    setUploadError('');
    onUpload(field, '');
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    setDownloadURL(initialDownloadUrl);
  }, [initialDownloadUrl]);

  return (
    <li className="flex items-center justify-between gap-x-6 py-5">
      <div>
        <p className="text-sm font-semibold leading-6 text-gray-900">{text}</p>
        <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
          <p className="truncate">{subText}</p>
          {uploadError && (
            <p className="text-red-500 text-xs mt-1">{uploadError}</p>
          )}
        </div>
      </div>
      <div className="relative">
        <div
          className="flex items-center justify-center cursor-pointer w-[48px] h-[48px] border-gray-300 transition-all hover:border-indigo-500 overflow-hidden"
          onClick={downloadURL ? toggleExpand : handleFileOpen}
        >
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpg,image/jpeg"
          />
          {isUploading ? (
            <div className="flex items-center justify-center w-full h-full bg-gray-100">
              <RotateCcw className="h-6 w-6 text-gray-400 animate-spin" />
            </div>
          ) : downloadURL ? (
            <img src={downloadURL} className="w-full rounded-md h-full object-cover" alt="Uploaded asset" />
          ) : (
            <div className="flex items-center justify-center border-2 rounded-full w-[38px] h-[38px]">
              <Plus className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>
        {downloadURL && !isUploading && (
          <button
            onClick={handleRemove}
            className="absolute -top-1 -right-1 bg-white rounded-full shadow-md p-0.5"
          >
            <XCircle className="h-5 w-5 text-red-500" />
          </button>
        )}
      </div>
      {isExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={toggleExpand}>
          <div className="relative bg-white p-4 rounded-lg w-full max-w-3xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={downloadURL} alt="Expanded asset" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            <button
              onClick={toggleExpand}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </li>
  );
};