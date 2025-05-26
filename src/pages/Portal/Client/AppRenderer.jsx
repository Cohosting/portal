import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClientPortalContext } from '../../../context/clientPortalContext';
import { AppView } from '../../App/AppView';
import { useClientAuth } from '../../../hooks/useClientAuth';
import PageHeader from './components/PageHeader';

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
                    <div className="flex justify-between items-center w-full p-4 border-b border-gray-200">
            {/* Title skeleton */}
            <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse"></div>
            
            {/* Menu button skeleton */}
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
      ) : (
        <div>
        <PageHeader
          title={app?.name}
          description={'A space built around your needs.'}
          />
        <AppView
            clientId={clientUser?.id}
            settingType={app?.settings?.setupType}
            settings={app?.settings}
            app={app}
            isConnected={app.settings?.clientsSettings?.some(setting => setting.clientId === clientUser?.id )}

        />
        </div>

      )}
    </div>
  );
};
