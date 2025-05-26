import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Flex, Slide, Spinner, Text, useDisclosure, useMediaQuery, useOutsideClick } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';

import { Overlay } from '../../../components/internal/Overlay';
import { PortalComponentDecider } from './PortalComponentDecider';
import { useDomainInfo } from '../../../hooks/useDomainInfo';
import { useClientPortalData } from '../../../hooks/react-query/usePortalData';
import { useClientAuth } from '../../../hooks/useClientAuth';
import Sidebar from './components/Sidebar';


export const ClientDashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const { portalName } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLessThen660] = useMediaQuery('(min-width: 660px)');
  const { domain } = useDomainInfo();
  const { data: portal } = useClientPortalData(domain);
  const { clientUser } = useClientAuth(portal?.id);
  const [apps, setApps] = useState(null);
  const ref = useRef();

  useOutsideClick({
    ref,
    handler: onClose,
  });

  useEffect(() => {
    if (!portal || !clientUser) return;

    (async () => {
      setApps(portal.portal_apps);
    })();
  }, [portal, clientUser]);

  const settings = portal?.brandSettings || {};

  return (
    <Flex h="100vh" flexDir={!isLessThen660 ? 'column' : 'row'}>
      {!isLessThen660 && (
        <Flex alignItems="center" p="10px" borderBottom="1px solid" borderColor="gray.400">
          <Button onClick={onOpen}>
            <GiHamburgerMenu />
          </Button>
          <Text ml={3}>Welcome</Text>
        </Flex>
      )}
      {!apps ? (
        <Spinner />
      ) : (
        <>
          <Overlay isOpen={isOpen} />
          <Slide in={isOpen} direction="left">
            <Sidebar apps={apps} portalName={portalName} settings={settings} onClose={onClose} navigate={navigate} ref={ref} />
          </Slide>
          {isLessThen660 && (
            <Sidebar apps={apps} portalName={portalName} settings={settings} onClose={onClose} navigate={navigate} ref={ref} />
          )}
          {children}
        </>
      )}
    </Flex>
  );
};
