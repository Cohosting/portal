import React, { useState, memo } from "react";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IconButton from "../../IconButton";
import Avatar from "../../Avatar";
import FileItem from "../../internal/FileItem";
import MediaModal from "./MediaModal";
import { deleteMessage, updateMessage } from "../../../services/chat";
import MessageContent from "./MessageContent";
import { LazyLoadImage } from "react-lazy-load-image-component";

const MessageItem = ({
    isOwn,
    avatarSrc,
    avatarInitial,
    name,
    timestamp,
    content,
    status,
    attachments,
    id,
    observeLastElement,
    colorSettings
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mediaType, setMediaType] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const openModal = (url, type) => {
        setMediaType(type);
        setMediaUrl(url);
        setIsModalOpen(true);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const renderMediaGrid = (media) => {
        const mediaCount = media?.length;

        if (mediaCount === 0) return null;

        const gridClassName =
            mediaCount === 1 ? "grid-cols-1" :
                mediaCount === 2 ? "grid-cols-2" :
                    mediaCount === 3 ? "grid-cols-2" :
                        "grid-cols-2 sm:grid-cols-3";
        return (
            <div className=""> {/* Fixed width container */}
                <div className={`grid ${gridClassName} gap-2 mb-2`}>
                    {media?.map((item, index) => {
                        const isLarge = mediaCount === 3 && index === 0;
                        const showOverlay = mediaCount > 4 && index === 3;

                        return (
                            <div
                                key={index}
                                className={`relative overflow-hidden rounded-md ${isLarge ? 'col-span-2 row-span-2' : ''}`}
                                style={{
                                    aspectRatio: isLarge ? '16 / 9' : '1 / 1',
                                }}
                            >
                                {item.type === 'image' ? (
                                    <LazyLoadImage
                                        src={item.url}
                                        alt={item.name}
                                        className="w-full h-full object-cover cursor-pointer"
                                        onClick={() => { openModal(item.url, 'image') }}
                                    />
                                ) : (
                                    <div
                                        className="relative w-full h-full bg-black cursor-pointer"
                                        onClick={() => { openModal(item.url, 'video') }}
                                    >
                                        <button className="absolute inset-0 flex items-center justify-center text-white text-2xl">
                                            ▶
                                        </button>
                                        <video
                                            className="opacity-0 w-full h-full object-cover"
                                            src={item.url}
                                        />
                                    </div>
                                )}
                                {showOverlay && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl">
                                        +{mediaCount - 4} more
                                    </div>
                                )}
                            </div>
                        );
                    }).slice(0, 4)}
                </div>
            </div>
        );
    };

    const renderOtherFiles = (files) => (
        <div className="flex flex-col gap-2 mb-2">
            {files?.map((file, index) => <FileItem key={file?.name} fileName={file?.name} fileType={file?.type} fileSize={'1.4MB'} />)}
        </div>
    );

    const media = attachments?.filter((attachment) => attachment?.type === 'image' || attachment?.type === 'video');
    const otherFiles = attachments?.filter((attachment) => attachment?.type !== 'image' && attachment?.type !== 'video');

    const messageDelete = async () => {
        await deleteMessage(id);
    }

    return (
        <div
            ref={observeLastElement}
            className={`relative flex gap-x-4 group ${isOwn ? "flex-row-reverse self-end" : "flex-row self-start"}`}
        >
            <Avatar size="sm" name={name} src={avatarSrc} initial={avatarInitial} />
            <div onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)} className="flex flex-col max-w-[400px] w-full gap-2 cursor-pointer">
                <div className={`flex justify-between items-center gap-2 ${isOwn ? "flex-row-reverse self-end" : "flex-row self-start"}`}>
                    <div className="flex items-center gap-2">
                        <div className="py-0.5 px-2 text-xs leading-5 font-medium text-gray-900">
                            {name}
                        </div>
                        <time dateTime={timestamp} className="py-0.5 text-xs leading-5 text-gray-500">
                            {timestamp}
                        </time>
                    </div>
                </div>
                <div className="flex items-center">
                    {
                        isOwn && (   
                            <div className={`opacity-0 ${isHovered && 'opacity-100'}  m-2`}> 
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <IconButton
                                            variant="ghost"
                                            icon={<MoreVertical color="#525866" aria-hidden="true" size={16} weight="bold" />}
                                            size="small"
                                            tooltip="Settings"
                                        />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-white" align="end">
                                        <DropdownMenuItem className=" cursor-pointer hover:text-white hover:bg-gray-800" onClick={handleEdit}>
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className=" cursor-pointer hover:text-white hover:bg-gray-800" onClick={messageDelete}>
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )
                    }

                    <div className="w-full">
                        <div className="flex items-center">
                            <div className={`relative w-full mb-3 flex flex-col rounded-md p-3 ring-1 ring-inset ring-gray-200 ${isOwn ? '  text-gray-900' : 'bg-white text-gray-900'}`}>
                                <MessageContent
                                    isEditing={isEditing}
                                    content={content}
                                    isOwn={isOwn}
                                    handleCancelEdit={handleCancelEdit}
                                    handleUpdateEdit={updateMessage}
                                    status={status}
                                    id={id}
                                    colorSettings={colorSettings}
                                />
                            </div>
                        </div>
                        <div className="w-full">
                            {renderMediaGrid(media)}
                            {renderOtherFiles(otherFiles)}
                        </div>
                    </div>
                </div>
            </div>
            <MediaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mediaType={mediaType}
                mediaUrl={mediaUrl}
            />
        </div>
    );
};

// Memoize the component to avoid unnecessary re-renders
export default MessageItem;