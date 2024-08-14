import { XMarkIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useRef, useState } from 'react';
import { uploadFile } from '../../../services/fileUploadService';
import { useParams } from 'react-router-dom';
import { Dialog, DialogBackdrop } from '@headlessui/react';
import imageCompression from 'browser-image-compression';

const compressFile = async (file) => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 600,
        useWebWorker: true,
        initialQuality: 0.75,
    };

    try {
        return await imageCompression(file, options);
    } catch (error) {
        console.error('Error during image compression:', error);
        throw error;
    }
};

const AttachmentPreview = ({ file, onRemove, onFileUpload, setIsFileUploading }) => {
    const [uploading, setUploading] = useState(true);
    const { conversationId } = useParams();
    const uploadStartedRef = useRef(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!file || uploadStartedRef.current) return;

        const uploadAttachment = async () => {
            uploadStartedRef.current = true;
            try {
                setIsFileUploading(true);
                let compressedFile = null;
                if (file.type.startsWith('image/')) {
                    compressedFile = await compressFile(file);
                } else {
                    compressedFile = file;
                }
                const uploadFileUrl = await uploadFile(compressedFile, conversationId);
                onFileUpload(uploadFileUrl);
            } catch (error) {
                console.log(error);
            } finally {
                setUploading(false);
                setIsFileUploading(false);
            }
        };

        uploadAttachment();

    }, [file, conversationId, onFileUpload, setIsFileUploading]);

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isPDF = file.type === 'application/pdf';
    const fileName = file.name;

    const handleFileClick = () => {
        if (isImage || isVideo || isPDF) {
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const FilePreview = ({ children }) => (
        <div
            className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-md cursor-pointer group relative"
            onClick={handleFileClick}
        >
            {children}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 whitespace-nowrap z-50 pointer-events-none">
                {fileName}
            </div>
        </div>
    );

    return (
        <div className="relative p-2 border rounded-md">
            {isImage ? (
                <div className="group relative">
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-md cursor-pointer"
                        onClick={handleFileClick}
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 whitespace-nowrap z-50 pointer-events-none">
                        {fileName}
                    </div>
                </div>
            ) : isVideo ? (
                <FilePreview>
                    <div className="text-center">
                        <div className="font-semibold">Video</div>
                    </div>
                </FilePreview>
            ) : isPDF ? (
                <FilePreview>
                    <div className="text-center">
                        <div className="font-semibold">PDF</div>
                    </div>
                </FilePreview>
            ) : (
                <FilePreview>
                    <div className="text-center">
                        <div className="text-sm text-gray-600">Preview not available</div>
                    </div>
                </FilePreview>
            )}
            {uploading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                    <div className="loader" />
                </div>
            )}
            {
                !uploading && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute top-0 right-0 p-1 bg-white rounded-full"
                    >
                        <XMarkIcon className="h-4 w-4 text-red-600" />
                    </button>
                )
            }


            <Dialog open={isModalOpen} onClose={closeModal} className="fixed inset-0 z-50 flex items-center justify-center">
                <DialogBackdrop />
                <div className="relative bg-white p-4 rounded-md max-w-2xl mx-auto">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="absolute top-0 right-0 p-1 bg-white rounded-full"
                    >
                        <XMarkIcon className="h-4 w-4 text-red-600" />
                    </button>
                    {isImage ? (
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="max-w-full max-h-screen object-contain"
                        />
                    ) : isVideo ? (
                        <video
                            src={URL.createObjectURL(file)}
                            controls
                            className="max-w-full max-h-screen object-contain"
                        />
                    ) : isPDF ? (
                        <embed
                            src={URL.createObjectURL(file)}
                            type="application/pdf"
                            width="100%"
                            height="600px"
                            className="max-w-full"
                        />
                    ) : (
                        <div className="text-center">
                            <div className="font-semibold text-sm">{fileName}</div>
                            <div className="text-xs text-gray-600">Preview not available</div>
                        </div>
                    )}
                </div>
            </Dialog>
        </div>
    );
};

export default AttachmentPreview;