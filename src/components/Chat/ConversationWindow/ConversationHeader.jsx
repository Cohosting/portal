import React from 'react'
import DropdownMenu from '../../UI/DropdownMenu/'
import IconButton from '../../IconButton'
import { CaretLeft, DotsThreeVertical } from '@phosphor-icons/react'
import { useMediaQuery } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const ConversationHeader = ({
    name,
    handleDeleteConversation,
    refetchConversations
}) => {
    const [isLessThan768] = useMediaQuery('(max-width: 768px)');
    const naviagate = useNavigate();

    const onDeleteConversation = async () => {
        await handleDeleteConversation();
        await refetchConversations();
        naviagate('/messages')
    }

    return (
        <div className="flex flex-1 items-center gap-x-4 justify-between lg:gap-x-6 ">

            {isLessThan768 && (
                <IconButton
                    className={'cursor-pointer'}
                    onClick={() => naviagate('/messages')}
                    variant="neutral"
                    icon={
                        <CaretLeft
                            color="#525866"
                            aria-hidden="true"
                            size={20}
                            weight="bold"
                        />
                    }
                    tooltip="Settings"
                />
            )}
            <h6 className="text-sm font-medium text-[#0A0D14]">
                {name}
            </h6>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
                <DropdownMenu
                    trigger={
                        <IconButton
                            variant="neutral"
                            icon={
                                <DotsThreeVertical
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