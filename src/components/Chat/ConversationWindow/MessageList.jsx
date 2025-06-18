import React, { useState } from "react";
import MessageItem from "./MessageItem";
import EmptyStateFeedback from "@/components/EmptyStateFeedback";
import { MessagesSquare } from "lucide-react";
import AlertDialog from "@/components/Modal/AlertDialog";
import Gallery from "@/components/Gallery";
import { deleteMessage } from "@/services/chat";

const MessageList = ({ messages, user, hasMore, observeLastElement, colorSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryMedia, setGalleryMedia] = useState([]);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  const handleOpenGallery = (media, index) => {
    setGalleryMedia(media);
    setGalleryStartIndex(index);
    setGalleryOpen(true);
  };

  const handleCloseGallery = () => {
    setGalleryOpen(false);
    setGalleryMedia([]);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMessage(selectedMessageId);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="mt-16">
        <EmptyStateFeedback
          title="No Messages Yet"
          message="Looks like your inbox is empty. Start a conversation to see messages here."
          IconComponent={MessagesSquare}
          centered
        />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 py-10">
        {messages?.map((message, index) => {
          const sender = message.sender;
          const isOwn = sender?.id === user.id;
          const media = message?.attachments?.filter(
            a => a.type === "image" || a.type === "video"
          );
      

          return (
            <MessageItem
              key={message.id}
              isOwn={isOwn}
              avatarSrc={sender?.avatar_url}
              avatarInitial={message.name}
              name={sender?.name}
              attachments={message.attachments}
              timestamp={message.timestamp}
              content={message.content}
              status={message.status}
              id={message.id}
              observeLastElement={index === messages?.length - 1 ? observeLastElement : null}
              colorSettings={colorSettings}
              onDelete={() => {
                setSelectedMessageId(message.id);
                setIsOpen(true);
              }}
              media={media}
              onOpenGallery={handleOpenGallery}
            />
          );
        })}
      </div>

      <AlertDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message?"
        confirmButtonText={isDeleting ? "Deleting..." : "Yes, Delete"}
        confirmButtonColor="bg-red-500"
      />

      <Gallery
        isOpen={galleryOpen}
        onClose={handleCloseGallery}
        images={galleryMedia}
        initialIndex={galleryStartIndex}
      />
    </>
  );
};

export default MessageList;
