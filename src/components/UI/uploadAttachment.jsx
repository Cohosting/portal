import React, { useContext, useState } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';

export const UploadAttachmentComponent = ({ setAttachments }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState('');
  const { user } = useSelector(state => state.auth)
  const { data: portal } = usePortalData(user?.portals);

  const handleFileChange = event => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
  const handleUpload = () => {
    if (file) {
      setUploading(true);

      const path = `porta/${portal.portalURL}/${file.name}`;
      const portalRef = ref(storage, path);

      uploadBytes(portalRef, file)
        .then(async snapshot => {
          setUploadedPath(snapshot.ref.fullPath);
          const url = await getDownloadURL(snapshot.ref);
          console.log(url);
          setAttachments([
            {
              ...url,
            },
          ]);
          setUploading(false);
        })
        .catch(error => {
          console.error('Error uploading file:', error);
          setUploading(false);
        });
    }
  };

  return (
    <Box>
      <input type="file" onChange={handleFileChange} />
      <Button
        mt={2}
        onClick={handleUpload}
        isLoading={uploading}
        loadingText="Uploading..."
      >
        Upload
      </Button>
      {uploadedPath && (
        <Text mt={2}>
          File uploaded successfully. Path: <code>{uploadedPath}</code>
        </Text>
      )}
    </Box>
  );
};
