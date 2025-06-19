import React, { memo, useState } from "react";
import { MoreVertical, Play } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IconButton from "../../IconButton";
import Avatar from "../../Avatar";
import FileItem from "../../internal/FileItem";
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
  colorSettings,
  onDelete,
  onOpenGallery,
}) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    myMessageBgColor,
    myMessageTextColor,
    oppositeMessageBgColor,
    oppositeMessageTextColor,
  } = colorSettings || {};

  const handleEdit = () => setIsEditing(true);
  const handleCancelEdit = () => setIsEditing(false);
  const media = attachments?.filter(a => a.type === "image" || a.type === "video") || [];
  const otherFiles = attachments?.filter(a => a.type !== "image" && a.type !== "video") || [];
  const handleImageLoad = idx => setLoadedImages(prev => new Set(prev).add(idx));

  const getGridLayout = count => {
    switch (count) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
      case 4:
        return "grid-cols-2";
      default:
        return "grid-cols-2";
    }
  };

  const renderMediaItem = (item, index) => {
    const isLarge = media.length === 3 && index === 2;
    const showOverlay = media.length > 4 && index === 3;
    const isLoaded = loadedImages.has(index);
    return (
      <div
        key={index}
        className={`
          relative overflow-hidden rounded-xl group cursor-pointer
          transition-all duration-200 hover:shadow-lg
          ${isLarge ? "col-span-2 sm:col-span-2 aspect-[4/3]" : ""}
          ${media.length === 1 ? "aspect-[4/3] max-h-80" : "aspect-square"}
          ${media.length === 2 ? "aspect-square sm:aspect-square" : ""}
        `}
        onClick={() => onOpenGallery?.(media, index)}
      >
        {!isLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />}
        {item.type === "image" ? (
          <LazyLoadImage
            src={item.url}
            alt={item.name || "Image attachment"}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            onLoad={() => handleImageLoad(index)}
            placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E"
          />
        ) : (
          <div className="relative w-full h-full bg-gray-900 group overflow-hidden rounded-xl">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src={item.url}
              preload="metadata"
              muted
              onLoadedData={() => handleImageLoad(index)}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-200 z-10">
              <div className="bg-white bg-opacity-95 rounded-full p-3 shadow-lg group-hover:scale-105 transition-transform duration-200">
                <Play className="w-5 h-5 text-gray-800 ml-0.5" fill="currentColor" />
              </div>
            </div>
          </div>
        )}
        {showOverlay && (
          <div
            className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white text-sm font-medium backdrop-blur-sm cursor-pointer hover:bg-opacity-80 transition-all duration-200 z-20"
            onClick={() => onOpenGallery?.(media, index)}
          >
            <span className="bg-black bg-opacity-60 px-4 py-2 rounded-full">
              +{media.length - 4} more
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderMediaGrid = items =>
    items.length ? (
      <div className="mb-3 relative isolate overflow-hidden">
        {items.length === 3 ? (
          <div className="grid grid-cols-2 gap-1 sm:gap-2">
            {items.slice(0, 2).map(renderMediaItem)}
            <div className="col-span-2">{items[2] && renderMediaItem(items[2], 2)}</div>
          </div>
        ) : (
          <div className={`grid ${getGridLayout(items.length)} gap-1 sm:gap-2`}>
            {items.slice(0, 4).map(renderMediaItem)}
          </div>
        )}
      </div>
    ) : null;

  const renderOtherFiles = files =>
    files.length > 0 && (
      <div className="space-y-2 mb-3">
        {files.map((file, idx) => (
          <FileItem
            key={`${file.name}-${idx}`}
            fileName={file.name}
            fileType={file.type}
            fileSize={file.sizeReadable}
            filePath={file.filePath}
          />
        ))}
      </div>
    );

  const handleDelete = async () => onDelete();

  // Static styles for messages (no hover states)
  const messageStyles = isOwn ? {
    // Own message styles
    backgroundColor: myMessageBgColor || '#202a37',
    color: myMessageTextColor || 'white',
  } : {
    // Opposite message styles
    backgroundColor: oppositeMessageBgColor || 'white',
    color: oppositeMessageTextColor || '#111827',
  };

  return (
    <>
      <div
        ref={observeLastElement}
        className={`relative isolate flex gap-x-4 group/message ${
          isOwn ? "flex-row-reverse self-end" : "flex-row self-start"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Avatar className="max-sm:hidden" size="sm" name={name} src={avatarSrc} initial={avatarInitial} />
        <div className="flex flex-col max-w-[400px] sm:max-w-[450px] w-full gap-2">
          <div className={`flex justify-between items-center gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
            <div className="flex items-center gap-2">
              {/* Avatar before name for non-own messages, after for own messages on small screens */}
              {!isOwn && (
                <Avatar className="sm:hidden" size="sm" name={name} src={avatarSrc} initial={avatarInitial} />
              )}
              <div className="py-0.5 text-xs font-medium text-gray-900">
                {name}
              </div>
              {isOwn && (
                <Avatar className="sm:hidden" size="sm" name={name} src={avatarSrc} initial={avatarInitial} />
              )}
              <time dateTime={timestamp} className="py-0.5 text-xs text-gray-500">
                {timestamp}
              </time>
            </div>
          </div>
          <div className="flex items-start gap-2">
            {isOwn && (
              <div
                className={`transition-opacity duration-200 flex-shrink-0 mt-2 ${
                  isHovered ? "opacity-100" : "opacity-0 group-hover/message:opacity-100"
                }`}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconButton
                      variant="ghost"
                      icon={<MoreVertical size={16} className="text-gray-500" />}
                      size="small"
                      tooltip="Message options"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white shadow-lg border">
                    <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <div className="w-full min-w-0">
              {content && (
                <div
                  className={`message-bubble relative w-full mb-3 flex flex-col px-4 py-3 rounded-2xl ${
                    isOwn 
                      ? "rounded-br-md" 
                      : "ring-1 ring-gray-200 rounded-bl-md"
                  }`}
                  style={messageStyles}
                >
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
              )}
              {renderMediaGrid(media)}
              {renderOtherFiles(otherFiles)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(MessageItem);