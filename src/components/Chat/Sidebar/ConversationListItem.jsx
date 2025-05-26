import React from "react";

import Avatar from '../../Avatar'
import { formateLastMessageTime } from "../../../utils/chat/chatUtils";

const ConversationListItem = (props) => {
    const { chat, lastMessage, lastMessageTime, current, handleClick, isUnread, colorSettings } = props;
    const isGroup = chat.type === "group";

    let { loginButtonColor, loginButtonTextColor } = colorSettings || {};

    // Fallback colors if colorSettings are not provided
    const fallbackAccentColor = loginButtonColor || '#1f2937'; // gray-800 as fallback
    const fallbackActiveTextColor = loginButtonTextColor || '#ffffff'; // white as fallback

    const renderAvatar = () => {
        if (isGroup) {
            return (
                <div className="relative w-10 h-10">
                    <div className="absolute bottom-0 left-0">
                        <Avatar
                            src={chat?.avatars[0]}
                            variant="circle"
                            alt={chat.name}
                            size="xs"
                        />
                    </div>
                    <div className="absolute top-0 right-0">
                        <Avatar
                            src={chat.avatars[1]}
                            variant="circle"
                            alt={chat.name}
                            size="xs"
                        />
                    </div>
                </div>
            );
        } else {
            return <Avatar name={chat?.name} src={chat.avatar} variant="circle" size={"sm"} alt={chat.name} />;
        }
    };

    // Dynamic styles for current item
    const currentItemStyles = current ? {
        backgroundColor: fallbackAccentColor,
        color: fallbackActiveTextColor
    } : {};

    return (
        <div
            className={`flex items-center w-full gap-3 py-3 px-4 cursor-pointer  
                ${current 
                    ? "shadow-sm" 
                    : "bg-white hover:bg-gray-50"
                } 
                ${isUnread && lastMessage && !current ? "border-l-4 border-blue-600" : ""}
                ${isUnread && lastMessage && current ? "border-l-4 border-blue-600 font-bold" : ""}`}
            style={currentItemStyles}
            onClick={handleClick}
        >
            <div className="select-none">{renderAvatar()}</div>
            <div className="flex w-full flex-col">
                <div className="flex flex-1 items-center justify-between gap-2">
                    <p 
                        className={`text-sm select-none truncate ${
                            isUnread ? "font-bold" : "font-medium"
                        }`}
                        style={{
                            color: current 
                                ? fallbackActiveTextColor 
                                : (isUnread ? '#111827' : '#374151') // gray-900 : gray-700
                        }}
                    >
                        {chat.name}
                    </p>
                    <p 
                        className="text-xs select-none"
                        style={{
                            color: current 
                                ? fallbackActiveTextColor 
                                : '#6b7280' // gray-500
                        }}
                    >
                        {lastMessageTime && formateLastMessageTime(lastMessageTime)}
                    </p>
                </div>
                {lastMessage ? (
                    <p 
                        className={`text-xs select-none truncate ${
                            isUnread ? "font-medium" : ""
                        }`}
                        style={{
                            color: current 
                                ? fallbackActiveTextColor 
                                : (isUnread ? '#1f2937' : '#4b5563') // gray-800 : gray-600
                        }}
                    >
                        {lastMessage}
                    </p>
                ) : (
                    <p 
                        className="text-xs italic"
                        style={{
                            color: current 
                                ? fallbackActiveTextColor 
                                : '#9ca3af' // gray-400
                        }}
                    >
                        No conversation yet
                    </p>
                )}
            </div>
            {isUnread && lastMessage && (
                <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
            )}
        </div>
    );
};

ConversationListItem.defaultProps = {
    chat: {
        type: "individual",
        avatar: "",
        avatars: ["", ""],
        name: "Unknown User",
    },
    lastMessage: "",
    time: "",
    current: false,
    handleClick: () => { },
};

export default ConversationListItem;