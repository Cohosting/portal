import React from 'react'
import { Signup } from '../../pages/Auth/Signup';
import { Login } from '../../pages/Auth/Login';
import { createBrowserRouter } from 'react-router-dom';
import { Dashboard } from '../../pages/Dashboard/Dashboard';
import { ProtectedRoutes } from './ProtectedRoutes';
import { Pricing } from '../../pages/Subscriptions/Pricing';
import { Success } from '../../pages/Subscriptions/Success';
import { Failed } from '../../pages/Subscriptions/Failed';
import { Settings } from '../../pages/Settings/Setting';
import { Refresh } from '../../pages/Settings/Refresh';
import { StripeReturn } from '../../pages/Settings/StripeReturn';
import { Client } from '../../pages/Client/Client';
import { ClientLogin } from '../../pages/Portal/Client/ClientLogin';
import { ClientPortal } from '../../pages/Portal/Client/ClientPortal';
import { ClientDetails } from '../../pages/Client/ClientDetails';
import { Invoices } from '../../pages/Invoices/Invoices';
import { InvoiceForm } from '../../pages/Invoices/InvoiceForm';
import { AddApp } from '../../pages/App Setup/addApp';
import { Extentions } from '../../pages/App Setup/Extentions';
import { AppSetup } from '../../pages/App Setup/appSetup';
import { CustomizePortal } from '../../pages/Settings/CustomizePortal';
import { Team } from '../../pages/Team/Team';
import { AccountSettingsPage } from '../../pages/Settings/Profile/Profile';
import { AcceptInvitationPage } from '../../pages/Team/AcceptInvitationPage';
import SubdomainWrapper from '../UI/SubdomainWrapper';

const router = createBrowserRouter([
  {
    path: '/signup',
    element: (
      <SubdomainWrapper>
        <Signup />
      </SubdomainWrapper>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoutes>
        <Dashboard />
      </ProtectedRoutes>
    ),
  },
  {
    path: '/subscription',
    element: (
      <ProtectedRoutes>
        <SubdomainWrapper>
          <Pricing />
        </SubdomainWrapper>
      </ProtectedRoutes>
    ),
  },
  {
    path: '/success',
    element: <Success />,
  },
  {
    path: '/cancel',
    element: <Failed />,
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoutes>
        <SubdomainWrapper>
          <Settings />
        </SubdomainWrapper>
      </ProtectedRoutes>
    ),
  },
  {
    path: '/client',
    element: (
      <ProtectedRoutes>
        <SubdomainWrapper>
          <Client />
        </SubdomainWrapper>
      </ProtectedRoutes>
    ),
  },
  {
    path: '/reauth',
    element: (
      <ProtectedRoutes>
        <Refresh />
      </ProtectedRoutes>
    ),
  },
  {
    path: '/return',
    element: (
      <ProtectedRoutes>
        <StripeReturn />
      </ProtectedRoutes>
    ),
  },
  {
    path: '/portal',
    element: <ClientPortal />,
  },
  {
    path: '/portal/:portalName',
    element: <ClientPortal />,
  },

  {
    path: '/client/details/:id',
    element: <ClientDetails />,
  },
  {
    path: '/billing',
    element: (
      <ProtectedRoutes>
        <SubdomainWrapper>
          <Invoices />
        </SubdomainWrapper>
      </ProtectedRoutes>
    ),
  },
  {
    path: '/billing/create',
    element: (
      <ProtectedRoutes>
        <SubdomainWrapper>
          <InvoiceForm />
        </SubdomainWrapper>
      </ProtectedRoutes>
    ),
  },
  {
    path: '/customize',
    element: (
      <ProtectedRoutes>
        <SubdomainWrapper>
          <CustomizePortal />
        </SubdomainWrapper>
      </ProtectedRoutes>
    ),
  },

  {
    path: '/module-management',
    element: (
      <ProtectedRoutes>
        <SubdomainWrapper>
          <AppSetup />
        </SubdomainWrapper>
      </ProtectedRoutes>
    ),
  },
  {
    path: '/module-management/setup',
    element: (
      <ProtectedRoutes>
        <SubdomainWrapper>
          <AddApp />
        </SubdomainWrapper>
      </ProtectedRoutes>
    ),
  },
  {
    path: '/extentions',
    element: (
      <ProtectedRoutes>
        <SubdomainWrapper>
          <Extentions />
        </SubdomainWrapper>
      </ProtectedRoutes>
    ),
  },
  {
    path: '/team',
    element: (
      <ProtectedRoutes>
        <SubdomainWrapper>
          <Team />
        </SubdomainWrapper>
      </ProtectedRoutes>
    ),
  },
  {
    path: '/settings/me',
    element: (
      <ProtectedRoutes>
        <SubdomainWrapper>
          <AccountSettingsPage />
        </SubdomainWrapper>
      </ProtectedRoutes>
    ),
  },
  {
    path: '/accept-team',
    element: <AcceptInvitationPage />,
  },
]);
    
    export { router };