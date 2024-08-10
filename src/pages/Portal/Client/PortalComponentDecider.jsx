import React from 'react';
import { PortalAppRender } from './AppRenderer';
import { useParams } from 'react-router-dom';
import ClientBillingActivity from './ClientBillingActivity';

export const PortalComponentDecider = ({}) => {
  const { portalName } = useParams();
  switch (portalName?.toLowerCase()) {
    case 'messages':
      return (
        <div>
          <h1>Messages</h1>
        </div>
      );
    case 'files':
      return (
        <div>
          <h1>Files</h1>
        </div>
      );
    case 'billing':
      return <ClientBillingActivity />;

    default:
      return <PortalAppRender />;
  }
};
