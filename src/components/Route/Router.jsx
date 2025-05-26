import React from 'react'
import { Signup } from '../../pages/Auth/Signup';
import { Login } from '../../pages/Auth/Login';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Dashboard } from '../../pages/Dashboard/Dashboard';
import { ProtectedRoutes } from './ProtectedRoutes';
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
import { AccountSettings } from '../../pages/Settings/Profile/AccountSettings.jsx';
import SubdomainWrapper from '../internal/SubdomainWrapper';
import { AppConfigurations } from '../../pages/App/AppConfigurations';
import InvoiceDetails from '../../pages/Portal/Client/Invoices/InvoiceDetails';
import Chat from '../../pages/Chat/Chat';
import Conversation from '../../pages/Chat/Conversation.jsx';
import SubscriptionPage from '../../pages/Subscriptions/SubscriptionPage.jsx';
import InvitationAccept from '../../pages/Team/InvitationAccept.jsx';
import SettingsLayout from '../../pages/Settings/SettingsLayout.jsx';
import QuickSetup from '../../pages/Auth/QuickSetup.jsx';
import SubscriptionSuccess from '../internal/SubscriptionSuccess.jsx';
import Files from '../../pages/Files/Files.jsx';
import { SetPasswordPage } from '@/pages/Portal/Client/SetPasswordPage';
import { ForgetPassword } from '@/pages/Portal/Client/ForgetPassword';



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
        path: '/files',
        element: <Files />,
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
        element: <ProtectedLayout />,
        children: [
          {
            index: true,
            element: <SubscriptionPage />,
          },
        ],

      },
      {
        path: '/settings',
        element: <SettingsLayout />,
        children: [
          { path: 'portal', element: <Settings /> },
          { path: 'account', element: <AccountSettings /> },
          { path: 'subscriptions', element: <SubscriptionPage /> },
          { path: 'teams', element: <Team /> },
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
          {
            path: ':appId/app-configurations/:clientId',
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
            element: <AccountSettings />,
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
        path: 'billings/:id',
        element: (
          <ClientPortal>
<InvoiceDetails />
          </ClientPortal>
        ) 
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
    path: '/quick-setup',
    element: (
      <SubdomainWrapper>
        <QuickSetup />
      </SubdomainWrapper>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/set-password',
    element: <SetPasswordPage />,

  },
{  path:'/forgot-password',
  element: <ForgetPassword />,
},

  {
    path: '/success',
    element: <SubscriptionSuccess />,
  },
  {
    path: '/invitations/:inviteId/accept/:token',
    element: <InvitationAccept />,
  },
  {

  }
]);

    export { router };