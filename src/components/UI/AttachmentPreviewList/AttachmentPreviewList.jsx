import React from 'react';
import AttachmentPreview from './AttachmentPreview';

const AttachmentPreviewList = ({ images, onFileUpload, onRemove, setIsFileUploading }) => {
    return (
        <div className="flex flex-wrap gap-2 absolute bottom-40 ">
            {images.map((image, index) => (
                <AttachmentPreview
                    setIsFileUploading={setIsFileUploading}
                    key={image.name}
                    file={image}
                    onRemove={() => onRemove(index)}
                    onFileUpload={onFileUpload}
                />
            ))}
        </div>
    );
};

export default AttachmentPreviewList;
