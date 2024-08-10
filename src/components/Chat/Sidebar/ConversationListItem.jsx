import React from "react";

import Avatar from '../../Avatar'
import { formateLastMessageTime } from "../../../utils/chat/chatUtils";
const ConversationListItem = (props) => {
    const { chat, lastMessage, lastMessageTime, current, handleClick } = props;
    const isGroup = chat.type === "group";

    const renderAvatar = () => {
        if (isGroup) {
            return (
                <div className="relative w-10 h-10">
                    <div className="absolute bottom-0 left-0">
                        <Avatar
                            src={chat.avatars[0]}
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
            className={`flex items-center  border-b   w-full gap-3 py-3 px-3  cursor-pointer ${current
                && "bg-gray-50 text-indigo-600"
                }`}
            onClick={handleClick}
        >
            <div className="select-none">{renderAvatar()}</div>
            <div className="flex w-full flex-col">
                <div className="flex flex-1 items-center justify-between gap-2">
                    <p className="font-medium text-sm select-none">{chat.name}</p>
                    <p className="text-xs select-none text-gray-500">{lastMessageTime && formateLastMessageTime(lastMessageTime)}</p>
                </div>
                <p className="pb-1 text-xs text-gray-500 select-none">{lastMessage}</p>
            </div>
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
