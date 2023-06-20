import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { ClientPortalContext } from '../../../context/clientPortalContext';
import { useNavigate, useParams } from 'react-router-dom';
import { PortalComponentDecider } from './PortalComponentDecider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { sortAppWithAboveSettings } from '../../../utils';
import { ClientAuthContext } from '../../../context/clientAuthContext';

// create a function that sorts the apps by index and filters out the disabled apps and also if the setup type is manual then check for clientSettings array if that apps assigned to that user
let sortAppWithIndexAndFilterOutDisabledApps = portal => {};
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

  console.log({
    updatedApps,
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
  const [apps, setApps] = useState([]);
  const { clientPortal } = useContext(ClientPortalContext);
  const { portalName } = useParams();
  const settings = clientPortal.brandSettings;

  useEffect(() => {
    if (!clientPortal || !clientUser) return;
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
    <Flex h={'100vh'}>
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
      <Box flex={1}>
        {' '}
        <PortalComponentDecider />
      </Box>
    </Flex>
  );
};
