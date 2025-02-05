import React from "react";

import Avatar from '../../Avatar'
import { formateLastMessageTime } from "../../../utils/chat/chatUtils";
const ConversationListItem = (props) => {
    const { chat, lastMessage, lastMessageTime, current, handleClick, isUnread } = props;
    const isGroup = chat.type === "group";

    console.log({
        chat
    })
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
            return <Avatar src={chat.avatar} variant="circle" size={"sm"} alt={chat.name} />;
        }
    };

    return (
        <div
            className={`flex  items-center w-full gap-3 py-3 px-4 cursor-pointer
          ${current ? "bg-indigo-100 text-indigo-900 shadow-sm" : "bg-white hover:bg-gray-50"} 
          ${isUnread && lastMessage && !current ? "border-l-4 border-blue-600" : ""}
          ${isUnread && lastMessage && current ? "border-l-4 border-blue-600 font-bold " : ""}  bg-gray-300`}
            onClick={handleClick}
        >
            <div className="select-none">{renderAvatar()}</div>
            <div className="flex w-full flex-col">
                <div className="flex flex-1 items-center justify-between gap-2">
                    <p className={`text-sm select-none truncate ${isUnread ? "font-bold text-gray-900" : "font-medium text-gray-700"} 
              ${current ? "text-indigo-900" : ""}`}>
                        {chat.name}
                    </p>
                    <p className={`text-xs select-none ${current ? "text-indigo-700" : "text-gray-500"}`}>
                        {lastMessageTime && formateLastMessageTime(lastMessageTime)}
                    </p>
                </div>
                {lastMessage ? (
                    <p className={`text-xs select-none truncate ${isUnread ? "font-medium text-gray-800" : "text-gray-600"} 
              ${current ? "text-indigo-800" : ""}`}>
                        {lastMessage}
                    </p>
                ) : (
                    <p className="text-xs text-gray-400 italic">No conversation yet</p>
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
