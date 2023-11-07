import { Box, Button, Flex, Slide, Spinner, Text, useDisclosure, useMediaQuery, useOutsideClick } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { ClientPortalContext } from '../../../context/clientPortalContext';
import { useNavigate, useParams } from 'react-router-dom';
import { PortalComponentDecider } from './PortalComponentDecider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { sortAppWithAboveSettings } from '../../../utils';
import { ClientAuthContext } from '../../../context/clientAuthContext';
import { GiHamburgerMenu } from 'react-icons/gi';

import { Overlay } from './../../../components/UI/Overlay'

// create a function that sorts the apps by index and filters out the disabled apps and also if the setup type is manual then check for clientSettings array if that apps assigned to that user

const fetchAppDataForEachApp = async portal => {
  if (!portal) return;
  const newApps = [...portal.apps];
  const promises = newApps.map(async app => {
    // firstore v9
    const appRef = doc(db, 'apps', app.id);
    const appDoc = await getDoc(appRef);
    const appData = appDoc.data();
    return {
      ...appData,
      index: app.index,
      isDefault: app.isDefault,
    };
  });
  const appData = await Promise.all(promises);
  const updatedApps = newApps.map((app, index) => {
    return {
      ...app,
      ...appData[index],
    };
  });


  return updatedApps;
};

const NavItem = ({ children, isActive, ...rest }) => {
  return (
    <Box
      cursor={'pointer'}
      my={1}
      py={2}
      px={4}
      bg={isActive ? 'blue.500' : 'transparent'}
      color={isActive ? 'white' : 'gray.500'}
      borderRadius="md"
      _hover={{
        bg: isActive ? 'blue.600' : 'gray.200',
        color: isActive ? 'white' : 'black',
      }}
      {...rest}
    >
      <Text fontSize="md">{children}</Text>
    </Box>
  );
};
export const ClientDashboardLayout = ({ children }) => {
  const { clientUser } = useContext(ClientAuthContext);
  const navigate = useNavigate();
  const [apps, setApps] = useState(null);
  const { clientPortal } = useContext(ClientPortalContext);
  const { portalName } = useParams();
  const  {isOpen, onOpen, onClose} = useDisclosure()
  const [isLessThen660] =  useMediaQuery('(min-width: 660px)');

  const ref = React.useRef();
  useOutsideClick({
    ref: ref,
    handler: onClose,
  });

  const settings = clientPortal.brandSettings || {};

  useEffect(() => {
    if (!clientPortal || !clientUser) { 

      console.log('I think this is the problem');
      return;
    };
    (async () => {
      const apps = await fetchAppDataForEachApp(clientPortal);
      const sorted = sortAppWithAboveSettings(apps, clientUser.id);
      setApps(sorted);

      if (!portalName) {
        navigate(`/portal/${sorted[0].name}`);
      }
    })();
  }, [clientPortal, clientUser]);

  return (
    <Flex h={'100vh'} flexDir={!isLessThen660 ? 'column' : 'row'}>
      {
        !isLessThen660 && (
          <Flex alignItems={'center'} p={'10px'} borderBottom={'1px solid'} borderColor={'gray.400'} >
            <Button onClick={onOpen}>
              <GiHamburgerMenu />
            </Button>
            <Text ml={3}>Welcome</Text>
          </Flex>
        )
      }
      {
        !apps ? <Spinner /> : (
          <>
          <Overlay isOpen={isOpen} />
          <Slide in={isOpen} direction="left" >
           

          <Box
          ref={ref}
          zIndex={99999}
          w={'240px'}
          h={'100%'}
          bg={settings?.sidebarBgColor || 'gray.100'}
          color={settings?.sidebarTextColor || 'gray.800'}
          p={4}
        >
          <Text>{settings?.brandName}</Text>
          {apps.map(app => (
            <NavItem
              key={app.id}
              isActive={app?.name.toLowerCase() === portalName?.toLowerCase()}
              onClick={() => {
                onClose()
                navigate(`/portal/${app.name}`)}}
            >
              {app.name}
            </NavItem>
          ))}
            </Box>

          </Slide>
          {
            isLessThen660 && (
              <Box
              w={'300px'}
              h={'100%'}
              bg={settings?.sidebarBgColor || 'gray.100'}
              color={settings?.sidebarTextColor || 'gray.800'}
              p={4}
            >
              <Text>{settings?.brandName}</Text>
              {apps.map(app => (
                <NavItem
                  key={app.id}
                  isActive={app?.name.toLowerCase() === portalName?.toLowerCase()}
                  onClick={() => navigate(`/portal/${app.name}`)}
                >
                  {app.name}
                </NavItem>
              ))}
            </Box>
            )
          }

        <Box flex={1} overflowY={'auto'} >
          {' '}
          <PortalComponentDecider />
        </Box>
        </>

        )
      }
     
    </Flex>
  );
};
