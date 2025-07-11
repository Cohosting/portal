import React from 'react';
import DropdownMenu from '../../internal/DropdownMenu/DropdownMenu';
import IconButton from './../../IconButton';
import { Search, Plus } from 'lucide-react';
import { useConversationContext } from '../../../context/useConversationContext';
import { useMediaQuery } from 'react-responsive';
import { SidebarTrigger } from '@/components/ui/sidebar';

const ConversionHeader = ({ handleNewConversation, handleMassConversation }) => {
    const { setSidebarOpen } = useConversationContext();

    const isLessThan1024 = useMediaQuery({ query: '(max-width: 1024px)' });

    return (
        <div className="flex items-center shadow-sm justify-between gap-4 p-4 border-b border-gray-200">
          {isLessThan1024 && (

            <SidebarTrigger />
             /*  <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md border border-gray-300"
              >
                  <svg
                      className="h-6 w-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16m-7 6h7"
                      />
                  </svg>
              </button> */
          )}

          <h6 className="text-sm font-medium text-[#0A0D14]">Conversion</h6>
          <div className="flex gap-4 items-center">
              <DropdownMenu
                  trigger={
                      <IconButton
                          size="small"
                          variant="neutral"
                          icon={
                              <Plus
                                  color="#525866"
                      size={14}
                      strokeWidth={2.5}
                      aria-hidden="true"
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
 
          </div>
      </div>
  );
};

export default ConversionHeader;
