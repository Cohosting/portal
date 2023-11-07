import { AddIcon } from '@chakra-ui/icons';
import { Box, Flex, Image, Progress, Text } from '@chakra-ui/react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { storage } from '../../lib/firebase';

export const AssetItem = ({
  field,
  onUpload,
  initialDownloadUrl,
  text,
  subText,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(initialDownloadUrl || '');

  const handleUpload = selectedImage => {
    if (selectedImage) {
      const storageRef = ref(storage, selectedImage.name);
      const uploadTask = uploadBytesResumable(storageRef, selectedImage);

      uploadTask.on('state_changed', snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      });

      uploadTask
        .then(() => {
          getDownloadURL(uploadTask.snapshot.ref).then(url => {
            setDownloadURL(url);
            onUpload(field, url);
            console.log('Upload complete');
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  };
  const fileInputRef = useRef(null);

  const handleFileOpen = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = event => {
    /*     if (downloadURL) return;
     */ const file = event.target.files[0];
    handleUpload(file);
  };

  useEffect(() => {
    setDownloadURL(initialDownloadUrl);
  }, [initialDownloadUrl]);
  return (
    <Flex
      p={3}
      borderTop={'1px solid gray'}
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <Box>
        <Text fontSize={['15px', '16px']} fontWeight={700}>{text}</Text>
        <Text fontSize={['14px', '15px']} >{subText}</Text>
      </Box>
      {/* Sqaure box for image */}
      <Flex
        alignItems={'center'}
        justifyContent={'center'}
        cursor={'pointer'}
        w={[ '35px','48px']}
        h={[ '35px','48px']}
        borderRadius={'6px'}
        border={'1px solid gray'}
        onClick={handleFileOpen}
      >
        <input
          type="file"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {downloadURL ? (
          <Image src={downloadURL} w={'100%'} height={'100%'} />
        ) : (
          <AddIcon font fontSize={['12px', '16px']} />
        )}
      </Flex>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <Box
          position="fixed"
          bottom="20px"
          right="20px"
          backgroundColor="rgba(0, 0, 0, 0.7)"
          color="white"
          padding="10px"
          borderRadius="5px"
        >
          Uploading... {uploadProgress}%
          <Progress value={uploadProgress} size="sm" mt={2} />
        </Box>
      )}
    </Flex>
  );
};
