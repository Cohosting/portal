import React from 'react'
import { Signup } from '../../pages/Auth/Signup';
import { Login } from '../../pages/Auth/Login';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Dashboard } from '../../pages/Dashboard/Dashboard';
import { ProtectedRoutes } from './ProtectedRoutes';
import { Pricing } from '../../pages/Subscriptions/Pricing';
import { Success } from '../../pages/Subscriptions/Success';
import { Failed } from '../../pages/Subscriptions/Failed';
import { Settings } from '../../pages/Settings/Setting';
import { Refresh } from '../../pages/Settings/Refresh';
import { StripeReturn } from '../../pages/Settings/StripeReturn';
import { Client } from '../../pages/Client/Client';
import { ClientPortal } from '../../pages/Portal/Client/Portal';
import { ClientDetails } from '../../pages/Client/ClientDetails';
import { Invoices } from '../../pages/Invoices/Invoices';
import { InvoiceForm } from '../../pages/Invoices/InvoiceForm';
import { AppForm } from '../../pages/App/AppForm';
import { AppsList } from '../../pages/App/AppsList';
import { CustomizePortal } from '../../pages/Settings/CustomizePortal';
import { Team } from '../../pages/Team/Team';
import { AccountSettingsPage } from '../../pages/Settings/Profile/Profile';
import { AcceptInvitationPage } from '../../pages/Team/AcceptInvitationPage';
import SubdomainWrapper from '../UI/SubdomainWrapper';
import { AppConfigurations } from '../../pages/App/AppConfigurations';
import InvoiceDetails from '../../pages/Portal/Client/Invoices/InvoiceDetails';
import Chat from '../../pages/Chat/Chat';
import Conversation from '../../pages/Chat/Conversation.jsx';



// Layout for ProtectedRoutes
function ProtectedLayout() {
  return (
    <ProtectedRoutes>
      <Outlet />
    </ProtectedRoutes>
  );
}

// Layout for SubdomainWrapper
function SubdomainLayout() {
  return (
    <SubdomainWrapper>
      <Outlet />
    </SubdomainWrapper>
  );
}



const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'messages',
        element: <Chat />,
        children: [
          {
            path: ':conversationId',
            element: <Conversation />,
          },
        ],
      },
      {
        path: 'subscription',
        element: <SubdomainLayout />,
        children: [
          {
            index: true,
            element: <Pricing />,
          },
        ],
      },
      {
        path: 'settings',
        element: <SubdomainLayout />,
        children: [
          {
            index: true,
            element: <Settings />,
          },
        ],
      },
      {
        path: 'clients',
        element: <SubdomainLayout />,
        children: [
          {
            index: true,
            element: <Client />,
          },
        ],
      },
      {
        path: 'reauth',
        element: <Refresh />,
      },
      {
        path: 'return',
        element: <StripeReturn />,
      },

      {
        path: 'client/details/:id',
        element: <ClientDetails />,
      },
      {
        path: 'billing',
        element: <SubdomainLayout />,
        children: [
          {
            index: true,
            element: <Invoices />,
          },
          {
            path: ':mode',
            element: <InvoiceForm />,
          },
        ],
      },
      {
        path: 'customize',
        element: <SubdomainLayout />,
        children: [
          {
            index: true,
            element: <CustomizePortal />,
          },
        ],
      },
      {
        path: 'apps',
        element: <SubdomainLayout />,
        children: [
          {
            index: true,
            element: <AppsList />,
          },
          {
            path: 'new',
            element: <AppForm />,
          },
          {
            path: ':appId/edit',
            element: <AppForm />,
          },
          {
            path: ':appId/app-configurations',
            element: <AppConfigurations />,
          },
        ],
      },
      {
        path: 'team',
        element: <SubdomainLayout />,
        children: [
          {
            index: true,
            element: <Team />,
          },
        ],
      },
      {
        path: 'settings/me',
        element: <SubdomainLayout />,
        children: [
          {
            index: true,
            element: <AccountSettingsPage />,
          },
        ],
      },
    ],
  },
  {
    path: 'portal',
    children: [
      {
        path: ':portalName',
        element: <ClientPortal />,
      },
      {
        path: 'invoices/:id',
        element: <InvoiceDetails />,
      },
    ],
  },
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
    path: '/success',
    element: <Success />,
  },
  {
    path: '/cancel',
    element: <Failed />,
  },
  {
    path: '/accept-team',
    element: <AcceptInvitationPage />,
  },
]);

    export { router };