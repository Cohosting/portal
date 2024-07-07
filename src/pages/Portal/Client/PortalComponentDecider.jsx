import React from 'react';
import { PortalAppRender } from './AppRenderer';
import { useParams } from 'react-router-dom';
import { ClientBilling } from './Billing';

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
      return <ClientBilling />;

    default:
      return <PortalAppRender />;
  }
};
