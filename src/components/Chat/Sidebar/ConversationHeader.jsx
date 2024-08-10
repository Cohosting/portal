import React from 'react';
import DropdownMenu from '../../UI/DropdownMenu/DropdownMenu';
import IconButton from './../../IconButton'
import { MagnifyingGlass, Plus } from '@phosphor-icons/react';
const ConversionHeader = ({ handleNewConversation, handleMassConversation }) => {
    return (
        <div className="flex items-center shadow-sm justify-between gap-4 p-4  ">

            <h6 className="text-sm font-medium text-[#0A0D14]">Conversion</h6>
            <div className="flex gap-4 items-center">
                <DropdownMenu
                    trigger={
                        <IconButton
                            size={"small"}
                            variant={"neutral"}
                            icon={
                                <Plus
                                    color="#525866"
                                    aria-hidden="true"
                                    size={14}
                                    weight="bold"

                                />

                            }

                            tooltip="Settings"
                        />
                    }
                    options={[
                        {
                            name: "New Conversation",
                            onClick: handleNewConversation,
                        },
                        { name: "Mass Message", onClick: handleMassConversation },
                    ]}
                />
                <IconButton
                    size={"small"}
                    variant="neutral"
                    icon={
                        <MagnifyingGlass
                            size={14}
                            weight="bold"
                            color="#525866"
                            aria-hidden="true"
                        />
                    }
                    tooltip="Settings"
                />
            </div>
        </div>
    );
}

export default ConversionHeader