import React from 'react'
import DropdownMenu from '../../internal/DropdownMenu/'
import IconButton from '../../IconButton'
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router-dom'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

const ConversationHeader = ({
    name,
    handleDeleteConversation,
    refetchConversations,
    participants,
    length,

}) => {
    const isLessThan768 = useMediaQuery({ query: '(max-width: 768px)' });
    const isLessThan1024 = useMediaQuery({ query: '(max-width: 1024px)' });
    const navigate = useNavigate();
    const { open, setOpen } = useSidebar()

    const onDeleteConversation = async () => {
        await handleDeleteConversation();

        refetchConversations && await refetchConversations();
        if (window.location.pathname.includes('portal')) {
            navigate('/portal/messages');
        } else {
            navigate('/messages');
        }
    }

    return (
        <div className="flex flex-1 items-center gap-x-4 justify-between lg:gap-x-6 ">

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
            <div className="flex flex-col">
                <h6 className="text-sm font-medium text-[#0A0D14]">
                    {name}
                </h6>
                {/* display participants name if more than one */}
                {participants && participants.length > 1 && (
                    <div className="flex items-center gap-x-2">
                        {participants.map((participant, index) => (
                            <span key={index} className="text-xs text-gray-500">
                                {participant.name}
                                {index < participants.length - 1 && ', '}
                            </span>
                        ))}
                    </div>
                )}
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
                            onClick: handleDeleteConversation && onDeleteConversation,
                        },
                    ]}
                />
            </div>
        </div>
    )
}

export default ConversationHeader