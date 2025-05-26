import React, { useState } from "react";
import AttachFileButton from "../../internal/AttachFileButton";
import ImagePreviewList from "../../internal/AttachmentPreviewList";
import { useMediaQuery } from "react-responsive";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MessageInput = ({ onSendMessage, onMoodChange, isFileUploading, setIsFileUploading, colorSettings }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFilePublicUrls, setSelectedFilePublicUrls] = useState([]);
    const [message, setMessage] = useState("");
    const isLessThan768 = useMediaQuery({ query: '(max-width: 768px)' });

    // Extract colors from colorSettings with fallbacks
    let { loginButtonColor, loginButtonTextColor } = colorSettings || {};
    const buttonBgColor = loginButtonColor || '#000000'; // black as fallback
    const buttonTextColor = loginButtonTextColor || '#ffffff'; // white as fallback

    const handleSubmit = (event) => {
        event.preventDefault();
        onSendMessage(message, selectedFiles, selectedFilePublicUrls);
        setMessage("");
        setSelectedFiles([]);
        setSelectedFilePublicUrls([]);
    };

    const handleFileSelect = (files) => {
        setSelectedFiles((prevImages) => [...prevImages, ...Array.from(files)]);
    };

    const handleRemoveImage = (index) => {
        setSelectedFiles((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    // Dynamic button styles
    const buttonStyles = {
        backgroundColor: buttonBgColor,
        color: buttonTextColor,
        border: 'none'
    };

    // Hover and disabled styles
    const buttonHoverStyles = {
        backgroundColor: buttonBgColor,
        opacity: 0.9
    };

    const buttonDisabledStyles = {
        backgroundColor: buttonBgColor,
        color: buttonTextColor,
    };

    return (
        <div className={isLessThan768 ? 'pb-4' : "pb-6"}>
            <ImagePreviewList
                setIsFileUploading={setIsFileUploading}
                images={selectedFiles}
                onFileUpload={(file) => setSelectedFilePublicUrls((prevFile) => [...prevFile, file])}
                onRemove={handleRemoveImage}
            />

            <div className="flex gap-x-3">
                <form onSubmit={handleSubmit} className="relative flex-auto">
                    <Textarea
                        id={"message"}
                        placeholder={"Type a message..."}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                    />
                    <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                        <div className="flex items-center space-x-5">
                            <AttachFileButton onFileSelect={handleFileSelect} />
                        </div>
                        
                        <Button 
                            className=" hover:opacity-90"
                            style={isFileUploading ? buttonDisabledStyles : buttonStyles}
                            disabled={isFileUploading} 
                            type="submit"
 
                        >
                            Send Message
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MessageInput;