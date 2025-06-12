
export const sanitizeFileName = (fileName) => {
    // Get file extension
    const lastDotIndex = fileName.lastIndexOf('.');
    const name = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
    const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : '';
    
    // Sanitize the name part
    const sanitizedName = name
      .replace(/[^a-zA-Z0-9\-_]/g, '_') // Replace invalid characters with underscores
      .replace(/_+/g, '_') // Replace multiple consecutive underscores with single underscore
      .replace(/^_|_$/g, '') // Remove leading/trailing underscores
      .substring(0, 100); // Limit length to 100 characters
    
    // Sanitize extension (remove any invalid characters but keep the dot)
    const sanitizedExtension = extension.replace(/[^a-zA-Z0-9.]/g, '');
    
    return sanitizedName + sanitizedExtension;
  };