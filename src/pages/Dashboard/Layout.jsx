import { Box, Button, Flex, Slide, useDisclosure, useMediaQuery, useOutsideClick } from '@chakra-ui/react'
import React, { useContext, useRef } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';

import { Overlay } from '../../components/UI/Overlay';
import SidebarContent from './SidebarContent';
import { useSelector } from 'react-redux';
import { usePortalData, usePortalTeamMember } from '../../hooks/react-query/usePortalData';

// Layout component that wraps around the entire application UI, providing a sidebar and main content area.
export const Layout = ({ children, }) => {
  const [isMobileView] = useMediaQuery('(max-width: 760px)')
  const { user } = useSelector(state => state.auth)
  const { data: portal } = usePortalData(user?.portals)
  const { data: portalTeamMemberData } = usePortalTeamMember(user?.portals[0], user.email)
  const ref = useRef();
  // Close sidebar when clicking outside of it
  useOutsideClick({
    ref: ref,
    handler: () => onClose(false),
  })
  console.log(portalTeamMemberData)

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex height={'100vh'} overflowY={'auto'}>
      {/* Mobile view hamburger menu button */}
      {
        isMobileView && (
          <Box p={1}>
            <Button onClick={onOpen} mt={'12px'} ml={'8px'} border={'1px solid'} borderColor={'gray.300'} borderRadius={3} variant={'unstyled'} p={3} ><GiHamburgerMenu /></Button>
          </Box>
        )
      }
      {/* Overlay and slide-in sidebar for mobile view */}
      <Box zIndex={99999999999}>
        <Overlay isOpen={isOpen} />

        <Slide in={isOpen} direction="left">
          <Box
            position="fixed"
            top="0"
            left="0"
            width="200px"
            height="100%"
            background="white"
            boxShadow="-4px 0 8px rgba(0, 0, 0, 0.2)"
            zIndex={9999999}
          >
            {/* Sidebar content for mobile view */}
            <SidebarContent />
          </Box>
        </Slide>
      </Box>

      {/* Non-mobile view sidebar content */}
      {
        !isMobileView && (
          <SidebarContent
            user={user}
            portal={portal}
            portalTeamMemberData={portalTeamMemberData}
          />
        )
      }

      {/* Main content area */}
      <Box paddingLeft={!isMobileView && '200px'} height={'100%'} pr={1} flex={1}>
        {children}
      </Box>
    </Flex>
  );
};