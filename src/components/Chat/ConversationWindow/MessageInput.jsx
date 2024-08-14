import React, { useState } from "react";
import Button from "./../../UI/Button";
import AttachFileButton from "../../UI/AttachFileButton";
import MoodSelector from "../../UI/MoodSelector";
import { useMoodSelection } from "../../../hooks/useMoodSelection";
import TextArea from "../../UI/TextArea";
import ImagePreviewList from "../../UI/AttachmentPreviewList";
import { useMediaQuery } from "@chakra-ui/react";

const MessageInput = ({ onSendMessage, onMoodChange, isFileUploading, setIsFileUploading }) => {
    const { selected, handleMoodChange } = useMoodSelection(onMoodChange);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFilePublicUrls, setSelectedFilePublicUrls] = useState([]);
    const [message, setMessage] = useState("");
    const [isLessThan768] = useMediaQuery('(max-width: 768px)');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSendMessage(message, selected, selectedFiles, selectedFilePublicUrls);
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
    return (
        <div className={isLessThan768 ? 'pb-4' : "pb-10"}>
            <ImagePreviewList
                setIsFileUploading={setIsFileUploading}
                images={selectedFiles}
                onFileUpload={(file) => setSelectedFilePublicUrls((prevFile) => [...prevFile, file])}
                onRemove={handleRemoveImage}
            />

            <div className="  flex gap-x-3">
                <form onSubmit={handleSubmit} className="relative flex-auto">
                    <TextArea
                        id={"message"}
                        placeholder={"Type a message..."}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}



                    />
                    <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                        <div className="flex items-center space-x-5">
                            <AttachFileButton onFileSelect={handleFileSelect} />
                        </div>
                        <Button disabled={isFileUploading} type="submit">Send Message</Button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default MessageInput;