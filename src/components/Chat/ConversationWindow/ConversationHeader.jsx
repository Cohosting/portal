import React from 'react'
import DropdownMenu from '../../internal/DropdownMenu/'
import IconButton from '../../IconButton'
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router-dom'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ConversationHeader = ({
    name,
    handleDeleteConversation,
    participants,
    length,
    conversationId,
    currentUserId, // Add currentUserId prop
}) => {
    const isLessThan768 = useMediaQuery({ query: '(max-width: 768px)' });
    const isLessThan1024 = useMediaQuery({ query: '(max-width: 1024px)' });
    const navigate = useNavigate();
    const { open, setOpen } = useSidebar()

    // Check if this is a group chat (more than 2 participants)
    const isGroupChat = participants && participants.length > 2;
    
    // Get the other participant's info for 1x1 chats
    const otherParticipant = !isGroupChat && participants && participants.length === 2 
        ? participants.find(p => p.participant_id !== currentUserId)
        : null;

    // For group chats, get avatars to display
    const maxAvatarsToShow = 3;
    const visibleParticipants = isGroupChat ? participants.slice(0, maxAvatarsToShow) : [];
    const remainingCount = isGroupChat && participants.length > maxAvatarsToShow ? participants.length - maxAvatarsToShow : 0;

    // Determine what name to display
    const displayName = !isGroupChat && otherParticipant ? otherParticipant.name : name;
    
    return (
        <div className="flex flex-1 items-center gap-x-4 justify-between lg:gap-x-6 ">

            {
                conversationId && isLessThan768 && (
                    <IconButton
                        className={'cursor-pointer'}
                        onClick={() => window.location.hostname.includes('dashboard.') ? navigate('/messages') : navigate('/portal/messages')}
                        variant="neutral"
                        icon={
                            <ChevronLeft
                                color="#525866"
                                aria-hidden="true"
                                size={20}
                                weight="bold"
                            />
                        }
                        tooltip="Back"
                    />
                )
            }

            {/* Render the back button only when hasManyConversation is true */}
            {isLessThan768 && length > 1 && (
                <IconButton
                    className={'cursor-pointer'}
                    onClick={() => window.location.hostname.includes('dashboard.') ? navigate('/messages') : navigate('/portal/messages')}
                    variant="neutral"
                    icon={
                        <ChevronLeft
                            color="#525866"
                            aria-hidden="true"
                            size={20}
                            weight="bold"
                        />
                    }
                    tooltip="Back"
                />
            )}
            {
                length === 1 && isLessThan1024 && (
                    <SidebarTrigger onClick={() => setOpen(true)} />
                )
            }
            <div className="flex items-center gap-x-3">
                <TooltipProvider>
                    {/* Avatar for 1x1 chats */}
                    {!isGroupChat && otherParticipant && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex-shrink-0">
                                    {otherParticipant.avatar_url ? (
                                        <img 
                                            src={otherParticipant.avatar_url} 
                                            alt={otherParticipant.name}
                                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center border border-gray-200">
                                            <span className="text-xs font-medium text-gray-700">
                                                {otherParticipant.name?.charAt(0)?.toUpperCase() || '?'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent 
                                side="bottom" 
                                className="bg-gray-900 text-white px-2 py-1 text-xs rounded shadow-lg [&_.bg-primary]:hidden"
                            >
                                <p>{otherParticipant.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                    
                    {/* Multiple avatars for group chats */}
                    {isGroupChat && (
                        <div className="flex items-center">
                            <div className="flex -space-x-2">
                                {visibleParticipants.map((participant, index) => (
                                    <Tooltip key={participant.participant_id}>
                                        <TooltipTrigger asChild>
                                            <div className="relative">
                                                {participant.avatar_url ? (
                                                    <img 
                                                        src={participant.avatar_url} 
                                                        alt={participant.name}
                                                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center border-2 border-white shadow-sm">
                                                        <span className="text-xs font-medium text-gray-700">
                                                            {participant.name?.charAt(0)?.toUpperCase() || '?'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent 
                                            side="bottom" 
                                            className="bg-gray-900 text-white px-2 py-1 text-xs rounded shadow-lg [&_.bg-primary]:hidden"
                                        >
                                            <p>{participant.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                                
                                {/* +X more indicator */}
                                {remainingCount > 0 && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center border-2 border-white shadow-sm">
                                                <span className="text-xs font-medium text-white">
                                                    +{remainingCount}
                                                </span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent 
                                            side="bottom" 
                                            className="bg-gray-900 text-white px-2 py-1 text-xs rounded shadow-lg [&_.bg-primary]:hidden"
                                        >
                                            <div className="space-y-1">
                                                {participants.slice(maxAvatarsToShow).map((participant) => (
                                                    <p key={participant.participant_id}>{participant.name}</p>
                                                ))}
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                    )}
                </TooltipProvider>
                
                <div className="flex flex-col min-w-0">
                    <h6 className="text-sm font-medium text-[#0A0D14] truncate">
                        {displayName}
                    </h6>
                    {/* Display participants only for group chats (more than 2 participants) */}
                    {isGroupChat && (
                        <div className="flex items-center gap-x-1">
                            <span className="text-xs text-gray-500 truncate">
                                {participants.length} participants
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-x-4 lg:gap-x-6">
                <DropdownMenu
                    trigger={
                        <IconButton
                            variant="neutral"
                            icon={
                                <MoreVertical
                                    color="#525866"
                                    aria-hidden="true"
                                    size={20}
                                    weight="bold"
                                />
                            }
                            tooltip="Settings"
                        />
                    }
                    options={[
                        {
                            name: "Delete Conversation",
                            onClick: handleDeleteConversation,
                        },
                    ]}
                />
            </div>
        </div>
    )
}

export default ConversationHeader