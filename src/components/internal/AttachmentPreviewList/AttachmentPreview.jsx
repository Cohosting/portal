import React, { useEffect, useRef, useState } from 'react';
import { uploadFile } from '../../../services/fileUploadService';
import { useParams } from 'react-router-dom';
import { Dialog, DialogBackdrop } from '@headlessui/react';
import imageCompression from 'browser-image-compression';
import { X, File, FileText, Video, Image, Loader2 } from 'lucide-react';

const compressFile = async (file) => {
    console.log('🗜️ Starting file compression for:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
    });

    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 600,
        useWebWorker: true,
        initialQuality: 0.75,
    };

    console.log('🗜️ Compression options:', options);

    try {
        const startTime = performance.now();
        const compressedFile = await imageCompression(file, options);
        const endTime = performance.now();
        
        console.log('✅ File compression completed:', {
            originalSize: file.size,
            compressedSize: compressedFile.size,
            compressionRatio: ((file.size - compressedFile.size) / file.size * 100).toFixed(2) + '%',
            processingTime: (endTime - startTime).toFixed(2) + 'ms'
        });
        
        return compressedFile;
    } catch (error) {
        console.error('❌ Error during image compression:', {
            error: error.message,
            stack: error.stack,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        });
        throw error;
    }
};

const AttachmentPreview = ({ 
    file, 
    onRemove, 
    onFileUpload, 
    setIsFileUploading,
    onUploadStart,
    onUploadEnd,
    uploadedUrl // Add this prop to check if already uploaded
}) => {
    const [uploading, setUploading] = useState(!uploadedUrl); // Not uploading if already has URL
    const [deleting, setDeleting] = useState(false);
    const { conversationId } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const hasStartedUpload = useRef(false);

    console.log('🔄 AttachmentPreview render:', {
        fileName: file?.name,
        fileSize: file?.size,
        fileType: file?.type,
        conversationId,
        uploading,
        deleting,
        uploadedUrl,
        hasStartedUpload: hasStartedUpload.current,
        isModalOpen
    });

    useEffect(() => {
        // Skip if already uploaded
        if (uploadedUrl) {
            console.log('✅ File already uploaded, skipping:', uploadedUrl);
            setUploading(false);
            return;
        }

        // Skip if no file
        if (!file) {
            console.log('⏭️ Skipping upload: No file provided');
            return;
        }

        // Skip if upload already started for this component instance
        if (hasStartedUpload.current) {
            console.log('⏭️ Skipping upload: Already started for this component');
            return;
        }

        const uploadAttachment = async () => {
            console.log('📤 Starting file upload process...');
            hasStartedUpload.current = true;
            
            try {
                console.log('🔄 Setting file uploading state to true');
                setIsFileUploading(true);
                
                // Notify parent that upload is starting
                if (onUploadStart) {
                    onUploadStart();
                }
                
                let compressedFile = null;
                
                if (file.type.startsWith('image/')) {
                    console.log('🖼️ File is an image, starting compression...');
                    compressedFile = await compressFile(file);
                } else {
                    console.log('📄 File is not an image, skipping compression');
                    compressedFile = file;
                }
                
                console.log('📤 Uploading file to server...', {
                    fileName: compressedFile.name,
                    fileSize: compressedFile.size,
                    conversationId
                });
                
                const uploadStartTime = performance.now();
                const uploadFileUrl = await uploadFile(compressedFile, conversationId);
                const uploadEndTime = performance.now();
                
                console.log('✅ File upload completed:', {
                    url: uploadFileUrl,
                    uploadTime: (uploadEndTime - uploadStartTime).toFixed(2) + 'ms'
                });
                
                console.log('📞 Calling onFileUpload callback with file and URL:', file, uploadFileUrl);
                // Pass both file and URL to parent
                onFileUpload(file, uploadFileUrl);
                
            } catch (error) {
                console.error('❌ Upload process failed:', {
                    error: error.message,
                    stack: error.stack,
                    fileName: file.name,
                    conversationId
                });
                setUploadError(error.message);
                // Reset hasStartedUpload on error so user can retry
                hasStartedUpload.current = false;
            } finally {
                console.log('🏁 Upload process finished, cleaning up states');
                setUploading(false);
                setIsFileUploading(false);
                
                // Notify parent that upload has ended
                if (onUploadEnd) {
                    onUploadEnd();
                }
            }
        };

        uploadAttachment();

    }, [file, conversationId, onFileUpload, setIsFileUploading, onUploadStart, onUploadEnd, uploadedUrl]);

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isPDF = file.type === 'application/pdf';
    const fileName = file.name;

    console.log('📋 File type analysis:', {
        fileName,
        fileType: file.type,
        isImage,
        isVideo,
        isPDF
    });

    const handleFileClick = () => {
        console.log('👆 File clicked for preview:', {
            fileName,
            canPreview: isImage || isVideo || isPDF,
            currentModalState: isModalOpen
        });
        
        if (isImage || isVideo || isPDF) {
            console.log('🔓 Opening modal for file preview');
            setIsModalOpen(true);
        } else {
            console.log('⚠️ File type not supported for preview');
        }
    };

    const closeModal = () => {
        console.log('🔒 Closing modal');
        setIsModalOpen(false);
    };

    const handleRemove = async () => {
        console.log('🗑️ Remove button clicked for file:', fileName);
        setDeleting(true);
        try {
            await onRemove();
        } finally {
            // The parent component will handle the actual deletion
            // This component just shows the deleting state
            setDeleting(false);
        }
    };

    const FilePreview = ({ children, icon: Icon }) => (
        <div
            className="w-24 h-24 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg cursor-pointer group relative hover:shadow-sm transition-all duration-200"
            onClick={handleFileClick}
        >
            {Icon && <Icon className="h-8 w-8 text-gray-500 mb-2" />}
            {children}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-md py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 whitespace-nowrap z-50 pointer-events-none shadow-lg">
                {fileName}
            </div>
        </div>
    );

    // Debug object URL creation
    let objectUrl = null;
    try {
        objectUrl = URL.createObjectURL(file);
        console.log('🔗 Object URL created successfully:', objectUrl);
    } catch (error) {
        console.error('❌ Failed to create object URL:', error);
    }

    // Cleanup object URL on unmount
    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [objectUrl]);

    // Get file extension
    const fileExtension = fileName.split('.').pop().toUpperCase();

    return (
        <div className="relative group">
            <div className={`
                relative overflow-hidden rounded-xl transition-all duration-300
                ${uploading || deleting ? 'bg-gray-50 border-2 border-dashed border-gray-300' : 
                  uploadError ? 'bg-red-50 border-2 border-red-200' : 
                  'bg-white border border-gray-200 hover:border-gray-400 hover:shadow-md'}
            `}>
                {uploadError && (
                    <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded-t-xl">
                        Upload failed
                    </div>
                )}
                
                <div className="p-3">
                    {isImage ? (
                        <div className="relative overflow-hidden rounded-lg">
                            <img
                                src={objectUrl}
                                alt="Preview"
                                className="w-24 h-24 object-cover cursor-pointer"
                                onClick={handleFileClick}
                                onLoad={() => console.log('🖼️ Image preview loaded successfully')}
                                onError={(e) => console.error('❌ Image preview failed to load:', e)}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 pointer-events-none" />
                        </div>
                    ) : isVideo ? (
                        <FilePreview icon={Video}>
                            <div className="text-center">
                                <div className="text-xs font-medium text-gray-700">VIDEO</div>
                                <div className="text-xs text-gray-500 mt-0.5">{fileExtension}</div>
                            </div>
                        </FilePreview>
                    ) : isPDF ? (
                        <FilePreview icon={FileText}>
                            <div className="text-center">
                                <div className="text-xs font-medium text-gray-700">PDF</div>
                            </div>
                        </FilePreview>
                    ) : (
                        <FilePreview icon={File}>
                            <div className="text-center">
                                <div className="text-xs font-medium text-gray-700">{fileExtension}</div>
                                <div className="text-xs text-gray-500 mt-0.5">File</div>
                            </div>
                        </FilePreview>
                    )}
                </div>
                
                {/* Loading overlay for uploading */}
                {uploading && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <div className="text-xs text-gray-600 mt-2">Uploading...</div>
                        </div>
                    </div>
                )}
                
                {/* Loading overlay for deleting */}
                {deleting && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                        <div className="flex flex-col items-center">
                            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                            <div className="text-xs text-gray-600 mt-2">Deleting...</div>
                        </div>
                    </div>
                )}
                
                {/* Remove button */}
                {!uploading && !deleting && (
                    <button
                        type="button"
                        onClick={handleRemove}
                        className={`
                            absolute top-2 right-2 p-1.5 rounded-lg
                            transition-all duration-200
                            ${uploadError ? 
                              'bg-red-500 hover:bg-red-600 text-white' : 
                              'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 opacity-0 group-hover:opacity-100'}
                        `}
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {/* Modal */}
            <Dialog 
                open={isModalOpen} 
                onClose={closeModal} 
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                <DialogBackdrop className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden">
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">{fileName}</h3>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>
                    
                    <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
                        {isImage ? (
                            <img
                                src={objectUrl}
                                alt="Preview"
                                className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                                onLoad={() => console.log('🖼️ Modal image loaded successfully')}
                                onError={(e) => console.error('❌ Modal image failed to load:', e)}
                            />
                        ) : isVideo ? (
                            <video
                                src={objectUrl}
                                controls
                                className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                                onLoadedData={() => console.log('🎥 Modal video loaded successfully')}
                                onError={(e) => console.error('❌ Modal video failed to load:', e)}
                            />
                        ) : isPDF ? (
                            <embed
                                src={objectUrl}
                                type="application/pdf"
                                width="100%"
                                height="600px"
                                className="rounded-lg shadow-lg"
                                onLoad={() => console.log('📄 Modal PDF loaded successfully')}
                                onError={(e) => console.error('❌ Modal PDF failed to load:', e)}
                            />
                        ) : (
                            <div className="text-center py-12">
                                <File className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <div className="font-semibold text-gray-700">{fileName}</div>
                                <div className="text-sm text-gray-500 mt-2">Preview not available</div>
                            </div>
                        )}
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default AttachmentPreview;