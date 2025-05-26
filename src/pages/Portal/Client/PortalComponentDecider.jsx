import React from 'react';
import { PortalAppRender } from './AppRenderer';
import { useParams } from 'react-router-dom';
import ClientBillingActivity from './ClientBillingActivity';
import Chat from './ClientChat';

export const PortalComponentDecider = ({ portalData }) => {
  const { portalName } = useParams();
  switch (portalName?.toLowerCase()) {
    case 'messages':
      return <Chat portalData={portalData} />;
    case 'files':
      return (
        <div>
          <h1>Files</h1>
        </div>
      );
    case 'billings':
      return <ClientBillingActivity />;

    default:
      return <PortalAppRender />;
  }
};
