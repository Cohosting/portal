import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
export const UploadAttachmentComponent = ({ setAttachments }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState('');
  // const { user, currentSelectedPortal } = useSelector(state => state.auth)
  // const { data: portal } = usePortalData(currentSelectedPortal);

  const handleFileChange = event => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file) {
      setUploading(true);



      const path = `invoice/${file.name + "-" + uuidv4()}`;



      const { error, data } = await supabase.storage
        .from('portal_bucket')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error', error.message);
      }
      else {
        const { data: { publicUrl } } = supabase
          .storage
          .from('portal_bucket')
          .getPublicUrl(path);
        console.log({ publicUrl });
        setUploadedPath(publicUrl);
        setAttachments(prev => [...prev, publicUrl]);
        console.log('Upload complete');
      }
    }

  };

  return (
    <div className='flex items-center space-x-2 mt-3'>
      <input type="file" onChange={handleFileChange} />
      <button

        onClick={handleUpload}
        className='btn-indigo'

      >
        Upload
      </button>
      {uploadedPath && (
        <div className='mt-2'>
          File uploaded successfully. Path: <code>{uploadedPath}</code>
        </div>
      )}
    </div>
  );
};
