import React from 'react';
import { PortalAppRender } from './AppRenderer';
import { useParams } from 'react-router-dom';
import ClientBillingActivity from './ClientBillingActivity';
import Chat from './ClientChat';
import ClientFiles from './ClientFiles';

export const PortalComponentDecider = ({ portalData }) => {
  const { portalName } = useParams();
  switch (portalName?.toLowerCase()) {
    case 'messages':
      return <Chat portalData={portalData} />;
    case 'files':
      return  <ClientFiles />
    case 'billings':
      return <ClientBillingActivity />;

    default:
      return <PortalAppRender />;
  }
};
