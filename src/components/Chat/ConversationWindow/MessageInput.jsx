import React, { useState, useEffect } from "react";
import AttachFileButton from "../../internal/AttachFileButton";
import ImagePreviewList from "../../internal/AttachmentPreviewList";
import { useMediaQuery } from "react-responsive";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCallback } from "react";

const MessageInput = ({ onSendMessage, onMoodChange, isFileUploading, setIsFileUploading, colorSettings }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState(new Map()); // Track file -> URL mapping
    const [message, setMessage] = useState("");
    const [uploadingCount, setUploadingCount] = useState(0); // Track number of files being uploaded
    const [deletingCount, setDeletingCount] = useState(0); // Track number of files being deleted
    const isLessThan768 = useMediaQuery({ query: '(max-width: 768px)' });

    // Extract colors from colorSettings with fallbacks
    let { loginButtonColor, loginButtonTextColor } = colorSettings || {};
    const buttonBgColor = loginButtonColor || '#000000'; // black as fallback
    const buttonTextColor = loginButtonTextColor || '#ffffff'; // white as fallback

    // Check if all files are uploaded
    const allFilesUploaded = selectedFiles.length > 0 && selectedFiles.length === uploadedFiles.size;
    const hasFilesToUpload = selectedFiles.length > 0;
    const isUploading = uploadingCount > 0;
    const isDeleting = deletingCount > 0;
    const isProcessing = isUploading || isDeleting;

    // Disable send button if:
    // 1. There are files selected but not all are uploaded
    // 2. Files are currently uploading or being deleted
    // 3. Message is empty and no files are selected
    const isSendDisabled = (hasFilesToUpload && !allFilesUploaded) || isProcessing || (!message.trim() && !hasFilesToUpload);

    // Set up beforeunload protection when files are processing
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isProcessing) {
                event.preventDefault();
                event.returnValue = 'Files are still being processed. Are you sure you want to leave?';
                return 'Files are still being processed. Are you sure you want to leave?';
            }
        };

        if (isProcessing) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isProcessing]);

    // Also set up visibility change handler for additional protection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && isProcessing) {
                // Optional: You could also send a beacon or perform cleanup here
                console.warn('⚠️ User is navigating away while files are processing');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isProcessing]);

    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (isSendDisabled) {
            console.log('Cannot send: Files still processing or no content');
            return;
        }

        // Get URLs in the same order as selectedFiles
        const selectedFilePublicUrls = selectedFiles.map(file => uploadedFiles.get(file));
        
        onSendMessage(message, selectedFiles, selectedFilePublicUrls);
        setMessage("");
        setSelectedFiles([]);
        setUploadedFiles(new Map());
        setUploadingCount(0);
        setDeletingCount(0);
    };

    const handleFileSelect = (files) => {
        setSelectedFiles((prevImages) => [...prevImages, ...Array.from(files)]);
    };

    const handleRemoveImage = (index) => {
        const removedFile = selectedFiles[index];
        setSelectedFiles((prevImages) => prevImages.filter((_, i) => i !== index));
        
        // Also remove from uploadedFiles map
        setUploadedFiles(prev => {
            const newMap = new Map(prev);
            newMap.delete(removedFile);
            return newMap;
        });
    };

    const handleFileUpload = useCallback((file, url) => {
        setUploadedFiles(prev => {
            const newMap = new Map(prev);
            newMap.set(file, url);
            return newMap;
        });
    }, []);

    const handleUploadStart = useCallback(() => {
        setUploadingCount(prev => prev + 1);
    }, []);
    
    const handleUploadEnd = useCallback(() => {
        setUploadingCount(prev => Math.max(0, prev - 1));
    }, []);

    const handleDeleteStart = useCallback(() => {
        setDeletingCount(prev => prev + 1);
    }, []);

    const handleDeleteEnd = useCallback(() => {
        setDeletingCount(prev => Math.max(0, prev - 1));
    }, []);

    // Update the global isFileUploading state
    useEffect(() => {
        setIsFileUploading(isProcessing);
    }, [isProcessing, setIsFileUploading]);

    // Dynamic button styles
    const buttonStyles = {
        backgroundColor: buttonBgColor,
        color: buttonTextColor,
        border: 'none'
    };

    const buttonDisabledStyles = {
        backgroundColor: buttonBgColor,
        color: buttonTextColor,
        opacity: 0.5,
        cursor: 'not-allowed'
    };

    // Button text based on state
    const getButtonText = () => {
        if (isDeleting && isUploading) {
            return `Processing (${uploadingCount + deletingCount})...`;
        }
        if (isDeleting) {
            return `Deleting (${deletingCount})...`;
        }
        if (isUploading) {
            return `Uploading (${uploadingCount})...`;
        }
        if (hasFilesToUpload && !allFilesUploaded) {
            return `Waiting for uploads...`;
        }
        return 'Send Message';
    };

    // Enhanced tooltip text
    const getTooltipText = () => {
        if (isDeleting) {
            return 'Files are being deleted from storage';
        }
        if (isUploading) {
            return 'Files are being uploaded';
        }
        if (hasFilesToUpload && !allFilesUploaded) {
            return 'Wait for uploads to complete';
        }
        if (!message.trim() && !hasFilesToUpload) {
            return 'Enter a message or attach files';
        }
        return 'Send message';
    };

    return (
        <div className={isLessThan768 ? 'pb-4' : "pb-6"}>

            <ImagePreviewList
                setIsFileUploading={setIsFileUploading}
                images={selectedFiles}
                onFileUpload={handleFileUpload}
                onRemove={handleRemoveImage}
                onUploadStart={handleUploadStart}
                onUploadEnd={handleUploadEnd}
                onDeleteStart={handleDeleteStart}
                onDeleteEnd={handleDeleteEnd}
                uploadedFiles={uploadedFiles} // Pass uploaded files map
            />

            <div className="flex gap-x-3">
                <form onSubmit={handleSubmit} className="relative flex-auto">
                    <Textarea
                        id={"message"}
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        disabled={isProcessing}
                        className={isProcessing ? 'bg-gray-50 cursor-not-allowed bg-white' : 'bg-white'}
                    />
                    <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                        <div className="flex items-center space-x-5">
                            <AttachFileButton 
                                onFileSelect={handleFileSelect} 
                                disabled={isProcessing}
                            />
                        </div>
                        
                        <Button 
                            className="hover:opacity-90 transition-opacity"
                            style={isSendDisabled ? buttonDisabledStyles : buttonStyles}
                            disabled={isSendDisabled} 
                            type="submit"
                            title={getTooltipText()}
                        >
                            {getButtonText()}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MessageInput;