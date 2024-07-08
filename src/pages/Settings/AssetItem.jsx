import { AddIcon } from '@chakra-ui/icons';
import { Box, Flex, Image, Progress, Text } from '@chakra-ui/react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { storage } from '../../lib/firebase';
import { supabase } from '../../lib/supabase';

export const AssetItem = ({
  field,
  onUpload,
  initialDownloadUrl,
  text,
  subText,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(initialDownloadUrl || '');
  const fileInputRef = useRef(null);

  const handleUpload = async (selectedImage) => {
    if (selectedImage) {
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `public/${field}/${fileName}`;

      let { error, data } = await supabase.storage
        .from('portal_bucket') // Replace 'your-bucket-name' with your actual bucket name
        .upload(`${filePath}`, selectedImage, {
          cacheControl: '3600',
          upsert: false
        })


      if (error) {
        console.error('Upload error', error.message);
      } else {
        // Assuming 'data' contains the file metadata including the path
        const { data: {
          publicUrl
        } } = supabase
          .storage
          .from('portal_bucket')
          .getPublicUrl(filePath)
        console.log({ publicUrl })
        setDownloadURL(publicUrl);
        onUpload(field, publicUrl);
        console.log('Upload complete');
      }
    }
  };

  const handleFileOpen = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    handleUpload(file);
  };

  useEffect(() => {
    setDownloadURL(initialDownloadUrl);
  }, [initialDownloadUrl]);

  return (
/*     <Flex
      p={3}
      borderTop={'1px solid gray'}
      alignItems={'center'}
      justifyContent={'space-between'}
    > */
    <li className="flex items-center justify-between gap-x-6 py-5">

      <Box>
        <p className="text-sm font-semibold leading-6 text-gray-900">{text}</p>
        <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">

          <p className="truncate">{subText}</p>
        </div>
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
    </li>
    // </Flex>
  );
};
