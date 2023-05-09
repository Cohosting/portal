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

const router = createBrowserRouter([
    {
        path: '/signup',
        element: <Signup />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
        element: (
            <ProtectedRoutes>
                <Dashboard />
            </ProtectedRoutes>
        ) 
    },
    {
        path: '/pricing',
        element: (
            <ProtectedRoutes>
                <Pricing />
            </ProtectedRoutes>
        ) 
    },
    {
        path: '/success',
        element:   <Success  />
    },
    {
        path: '/cancel',
        element: <Failed />
    },
    {
        path: '/settings',
        element: <Settings />
    },
    {
        path: '/client',
        element: (
            <ProtectedRoutes>
                <Client />
            </ProtectedRoutes>
        )
    },
    {
        path: '/reauth',
        element: (
            <ProtectedRoutes>
                <Refresh />
            </ProtectedRoutes>
        )
    },
    {
        path: '/return',
        element: (
            <ProtectedRoutes>
                <StripeReturn />
            </ProtectedRoutes>
        )
    }
    
    
    ]);
    
    export { router };