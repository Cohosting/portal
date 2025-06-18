import React from "react";
import Avatar from '../../Avatar'
import { formateLastMessageTime } from "../../../utils/chat/chatUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ConversationListItem = (props) => {
    const { chat, lastMessage, lastMessageTime, current, handleClick, isUnread, colorSettings } = props;
    const isGroup = chat.type === "group";

    let { loginButtonColor, loginButtonTextColor } = colorSettings || {};

    // Fallback colors if colorSettings are not provided
    const fallbackAccentColor = loginButtonColor || '#1f2937'; // gray-800 as fallback
    const fallbackActiveTextColor = loginButtonTextColor || '#ffffff'; // white as fallback

    const renderAvatar = () => {
        if (isGroup) {
            const maxAvatarsToShow = 2;
            const visibleParticipants = chat.participants ? chat.participants.slice(0, maxAvatarsToShow) : [];
            const remainingCount = chat.participants && chat.participants.length > maxAvatarsToShow 
                ? chat.participants.length - maxAvatarsToShow 
                : 0;

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="relative w-10 h-10 flex-shrink-0">
                                {/* Stack avatars */}
                                <div className="relative w-full h-full">
                                    {/* Back avatar */}
                                    {visibleParticipants[1] && (
                                        <div className="absolute top-0 left-0 w-7 h-7">
                                            {visibleParticipants[1].avatar_url ? (
                                                <img 
                                                    src={visibleParticipants[1].avatar_url} 
                                                    alt={visibleParticipants[1].name}
                                                    className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-full h-full rounded-full bg-gray-400 flex items-center justify-center border-2 border-white shadow-sm">
                                                    <span className="text-xs font-medium text-white">
                                                        {visibleParticipants[1].name?.charAt(0)?.toUpperCase() || '?'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Front avatar */}
                                    {visibleParticipants[0] && (
                                        <div className="absolute bottom-0 right-0 w-7 h-7">
                                            {visibleParticipants[0].avatar_url ? (
                                                <img 
                                                    src={visibleParticipants[0].avatar_url} 
                                                    alt={visibleParticipants[0].name}
                                                    className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center border-2 border-white shadow-sm">
                                                    <span className="text-xs font-medium text-gray-700">
                                                        {visibleParticipants[0].name?.charAt(0)?.toUpperCase() || '?'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Count badge if more than 2 participants */}
                                    {remainingCount > 0 && (
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center border border-white shadow-sm">
                                            <span className="text-[10px] font-medium text-white">
                                                +{remainingCount}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent 
                            side="right" 
                            className="bg-gray-900 text-white px-2 py-1 text-xs rounded shadow-lg [&_.bg-primary]:hidden"
                        >
                            {chat.participants && chat.participants.length > 0 ? (
                                <div className="space-y-1">
                                    {chat.participants.slice(0, 5).map((participant) => (
                                        <p key={participant.participant_id}>{participant.name}</p>
                                    ))}
                                    {chat.participants.length > 5 && (
                                        <p className="text-gray-300">and {chat.participants.length - 5} others</p>
                                    )}
                                </div>
                            ) : (
                                <p>{chat.participants?.length || 0} participants</p>
                            )}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        } else {
            // Individual chat - use existing Avatar component
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
            <div className="select-none flex-shrink-0">{renderAvatar()}</div>
            <div className="flex w-full flex-col min-w-0">
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
                        className="text-xs select-none flex-shrink-0"
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
                <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 flex-shrink-0"></div>
            )}
        </div>
    );
};

ConversationListItem.defaultProps = {
    chat: {
        type: "individual",
        avatar: "",
        avatars: ["", ""],
        participants: [],
        name: "Unknown User",
    },
    lastMessage: "",
    time: "",
    current: false,
    handleClick: () => { },
};

export default ConversationListItem;