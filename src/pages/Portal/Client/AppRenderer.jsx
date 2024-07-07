import { Box, Text } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClientPortalContext } from '../../../context/clientPortalContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { AppView } from '../../App/AppView';

export const PortalAppRender = () => {
  const { portalName } = useParams();
  const { clientPortal } = useContext(ClientPortalContext);
  const { clientUser } = {}
  const [app, setApp] = useState(null);

  useEffect(() => {
    if (!clientPortal || !clientUser) return;
    const app = clientPortal.apps.find(app => app.name === portalName);
    if (!app) return;

    (async () => {
      const appDoc = await getDoc(doc(db, 'apps', app.id));
      setApp(appDoc.data());
    })();
  }, [clientPortal, clientUser, portalName]);

  return (
    <Box height={'100%'}>
      {!app ? (
        <Text>Loading...</Text>
      ) : (
        <AppView
          clientId={clientUser.id}
          settingType={app.settings.setupType}
          settings={app.settings}
        />
      )}
    </Box>
  );
};
