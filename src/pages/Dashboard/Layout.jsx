import { Avatar, Box, Button, Divider, Flex, Slide, Text, useDisclosure, useMediaQuery, useOutsideClick } from '@chakra-ui/react'
import React, { useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  AiFillMessage,
  AiOutlineFile,
  AiOutlineHome,
  AiOutlineRotateLeft,
  AiOutlineSetting,
} from 'react-icons/ai';
import { MdPayment } from 'react-icons/md';
import { GiHamburgerMenu, GiSettingsKnobs } from 'react-icons/gi';
import { BiCustomize } from 'react-icons/bi';
import { FiUsers } from 'react-icons/fi';
import { FaMoneyBillAlt, FaRegUserCircle } from 'react-icons/fa';
import { BiMessageMinus } from 'react-icons/bi';
import { RiBillLine, RiTeamLine } from 'react-icons/ri';
import { PortalContext } from '../../context/portalContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Overlay } from '../../components/UI/Overlay';
import { AuthContext } from '../../context/authContext';

const NavItem = ({ children, icon, url, isActive, onClick }) => {
  const navigate = useNavigate();
  let active =
    isActive ||
    window.location.pathname.replace('/', '') === children.toLowerCase()
      ? true
      : false;

  const handleNavigate = () => {
    onClick ? onClick() : navigate(url);
  };

  return (
    <CommonBoxContainer isActive={active} onClick={handleNavigate}>
      <Flex alignItems={'center'} cursor={'pointer'}>
        {icon}
        <Text ml={2} fontSize={'13px'}>
          {children}
        </Text>
      </Flex>
    </CommonBoxContainer>
  );
};

let CommonBoxContainer = ({ children, isActive, onClick }) => {
  return (
    <Flex
      cursor={'pointer'}
      borderRadius={'4px'}
      bg={isActive ? 'rgb(239 241 244)' : 'transparent'}
      _hover={{
        bg: 'rgb(239 241 244)',
        transition: '0.2s',
      }}
      alignItems={'center'}
      p={'4px 8px'}
      onClick={onClick}
    >
      {children}
    </Flex>
  );
};

export const Layout = ({ children, }) => {
  const [isLessThen756] = useMediaQuery('(max-width: 760px)')
  const { user } = useContext(AuthContext)
  const { portal, portalTeamMemberData } = useContext(PortalContext);
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef();
  useOutsideClick({
    ref: ref,
    handler: () => onClose(false),
  })

  const { isOpen, onOpen, onClose } = useDisclosure();


  const SidebarContent = () => (
    <Box
    bg={'#f8f9fb'}
    px={'16px 8px 28px 8px'}
    height={'100%'}
    w={'200px'}
    p={1}
      position={'fixed'}
      overflowY={'auto'}
  >
    <Box p={'16px 8px 20px 8px'}>
      <CommonBoxContainer>

          <Avatar size={'sm'} name={user?.name} src=' ' />
          <Text ml={2} fontSize={'14px'}>
            {user?.name || 'Himel'}
          </Text>
          {/*        <Box
          display={'flex'}
          alignItems={'center'}
          fontSize={'14px'}
          bg={'white'}
          borderRadius={'4px'}
          p={2}
          w={'25px'}
          h={'25px'}
        >
            <Text></Text>
        </Box>
         */}
      </CommonBoxContainer>
    </Box>
    {portalTeamMemberData?.role === 'owner' ? (
      <Box ml={'13px'} fontSize={'13px'} color={'red'}>
        <Text>For test purpose</Text>
        <Text>This is owner account</Text>
      </Box>
    ) : (
      <Box ml={'13px'} fontSize={'13px'} color={'red'}>
        <Text>For test purpose</Text>
        <Text>This is member account</Text>
      </Box>
    )}
    <Box mb={'5px'}>
      <NavItem
        isActive={false}
        onClick={() => navigate('/')}
        icon={<AiOutlineHome />}
      >
        Home
      </NavItem>
      <NavItem onClick={() => navigate('/client')} icon={<FiUsers />}>
        Client
      </NavItem>

      <Divider mt={'5px'} />
    </Box>

    <Box>
      <Text my={2} px={'8px'} color={'#90959D'} fontSize={'12px'}>
        Apps
      </Text>

      <NavItem icon={<AiOutlineFile />}>Files</NavItem>
      <NavItem icon={<BiMessageMinus />}>Messages</NavItem>
      <NavItem
        isActive={location.pathname.includes('billing')}
        onClick={() => navigate('/billing')}
        icon={<MdPayment />}
      >
        Billing
      </NavItem>

      <Box>
        <NavItem
          isActive={location.pathname.includes('extentions')}
          url={`/extentions?id=${
            portal?.apps?.filter(app => !app.isDefault)?.[0]?.id || ''
          }`}
          icon={<MdPayment />}
        >
          extentions
        </NavItem>
        <Box ml={4}>
          {portal?.apps
            ?.filter(app => !app.isDefault)
            .map(app => (
              <Flex
                onClick={() => navigate(`/extentions/?id=${app.id}`)}
                key={app.id}
                alignItems={'center'}
                mt={1}
                cursor={'pointer'}
                borderRadius={'4px'}
                sx={{
                  ...(location.search.includes(app.id) && {
                    bg: '#f1f1f1',
                  }),
                }}
              >
                <Text ml={4} my={1} fontSize={'13px'}>
                  {app.name}
                </Text>
              </Flex>
            ))}
        </Box>
      </Box>
    </Box>
    <Box>
      <Text my={2} px={'8px'} color={'#90959D'} fontSize={'12px'}>
        Preference
      </Text>
      <NavItem
        isActive={location.pathname.includes('module-management')}
        onClick={() => navigate('/module-management')}
        icon={<GiSettingsKnobs />}
      >
        App settings
      </NavItem>
      <NavItem
        isActive={location.pathname.includes('customize')}
        onClick={() => navigate('/customize')}
        icon={<BiCustomize />}
      >
        Customise
      </NavItem>
      <NavItem
        isActive={location.pathname.includes('team')}
        onClick={() => navigate('/team')}
        icon={<RiTeamLine />}
      >
        Team
      </NavItem>{' '}
      <NavItem
        isActive={location.pathname.includes('subscription')}
        onClick={() => navigate('/subscription')}
        icon={<AiOutlineRotateLeft />}
      >
        Subscription
      </NavItem>
      <NavItem
        isActive={ location.pathname === '/settings'}
        onClick={() => navigate('/settings')}
        icon={<AiOutlineSetting />}
      >
        Portal settings
      </NavItem>
      <NavItem
        isActive={location.pathname.includes('/me')}
        onClick={() => navigate('/settings/me')}
        icon={<FaRegUserCircle />}
      >
        Profile
      </NavItem>

    </Box>
  </Box>
  )
  return (
    <Flex height={'100vh'} overflowY={'auto'}>
      {
             isLessThen756  && (
              <Box p={1}>
                <Button onClick={onOpen} mt={'12px'} ml={'8px'} border={'1px solid'} borderColor={'gray.300'} borderRadius={3} variant={'unstyled'} p={3} ><GiHamburgerMenu /></Button>
              </Box>
            )
      }
      <Box zIndex={99999999999}>
      <Overlay isOpen={isOpen} />



            <Slide    in={isOpen} direction="left">
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
          {/* Add your sidebar content here */}
          <SidebarContent />

        </Box>
      </Slide>
      </Box>
 
      {
        !isLessThen756 && (
     <SidebarContent />
        )
      }
     
   
        
     
 
      <Box paddingLeft={!isLessThen756 && '200px'} height={'100%'} pr={1} flex={1}>
        {children}
      </Box>
    </Flex>
  );
};
