import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClientPortalContext } from '../../../context/clientPortalContext';
import { AppView } from '../../App/AppView';
import { useClientAuth } from '../../../hooks/useClientAuth';

export const PortalAppRender = () => {
  const { portalName } = useParams();
  const { clientPortal } = useContext(ClientPortalContext);
  const { clientUser } = useClientAuth(clientPortal?.id)
  const [app, setApp] = useState(null);

  useEffect(() => {
    if (!clientPortal || !clientUser) return;
    console.log(clientPortal);
    const foundApp = clientPortal.portal_apps?.find(app => app?.name.toLowerCase() === portalName.toLowerCase());
    console.log({
      ss: clientPortal.portal_apps.map(app => ({
        name: app?.name.toLowerCase(),
        portalName: portalName.toLowerCase()
      }))
    });
    console.log({
      foundApp
    })
    setApp(foundApp || null);
  }, [clientPortal, clientUser, portalName]);

  return (
    <div className="h-full">
      {!app ? (
        <p>Loading...</p>
      ) : (
        <AppView
            clientId={clientUser?.id}
            settingType={app?.settings?.setupType}
            settings={app?.settings}
            app={app}
        />
      )}
    </div>
  );
};
