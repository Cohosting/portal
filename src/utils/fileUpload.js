export const getUploadFolder = mimeType => {
  if (mimeType.startsWith('image/')) {
    return 'images';
  } else if (mimeType.startsWith('video/')) {
    return 'videos';
  } else {
    return 'files';
  }
};
