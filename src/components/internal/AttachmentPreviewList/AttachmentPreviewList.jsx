import React from 'react';
import AttachmentPreview from './AttachmentPreview';
import { deleteFile } from '../../../services/fileUploadService';
import { useParams } from 'react-router-dom';

const AttachmentPreviewList = ({ 
    images, 
    onFileUpload, 
    onRemove, 
    setIsFileUploading,
    onUploadStart,
    onUploadEnd,
    onDeleteStart,
    onDeleteEnd,
    uploadedFiles
}) => {
    const { conversationId } = useParams();

    const handleRemoveWithDelete = (index) => {
        // Return an async function that will be called when remove button is clicked
        return async () => {
            const file = images[index];
            const uploadedUrl = uploadedFiles?.get(file);
            
            console.log(
                file,
                uploadedUrl,
                index,
                conversationId
            )
            console.log('🗑️ Starting file removal process:', {
                fileName: file.name,
                index,
                hasUploadedUrl: !!uploadedUrl
            });

            // Start delete process indicator
            if (onDeleteStart) {
                onDeleteStart();
            }

            try {
                // If file has been uploaded, delete it from storage
                if (uploadedUrl) {
                    console.log('🗑️ Deleting file from storage:', uploadedUrl);
                    await deleteFile(uploadedUrl.filePath, conversationId);
                    console.log('✅ File deleted from storage successfully');
                }

                // Remove from UI after successful deletion (or if not uploaded)
                onRemove(index);
                
            } catch (error) {
                console.error('❌ Error deleting file from storage:', error);
                // You might want to show an error toast/notification here
                alert(`Failed to delete file: ${error.message}`);
            } finally {
                // End delete process indicator
                if (onDeleteEnd) {
                    onDeleteEnd();
                }
            }
        };
    };

    return (
        <div className="flex flex-wrap gap-2 absolute bottom-[140px]">
            {images.map((image, index) => (
                <AttachmentPreview
                    key={`${image.name}-${image.size}-${image.lastModified}-${index}`}
                    setIsFileUploading={setIsFileUploading}
                    file={image}
                    onRemove={handleRemoveWithDelete(index)}
                    onFileUpload={onFileUpload}
                    onUploadStart={onUploadStart}
                    onUploadEnd={onUploadEnd}
                    uploadedUrl={uploadedFiles?.get(image)} // Pass the uploaded URL
                />
            ))}
        </div>
    );
};

export default AttachmentPreviewList;