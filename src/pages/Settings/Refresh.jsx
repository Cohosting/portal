import React, { useState } from 'react';
import { createStripeConnectAccount } from '../../utils/stripe';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { Loader, AlertTriangle } from 'lucide-react';
import { Button } from '@headlessui/react';
import DashboardSkeleton from '@/components/SkeletonLoading';
import { Layout } from '../Dashboard/Layout';
import PageHeader from '@/components/internal/PageHeader';

export const Refresh = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, currentSelectedPortal } = useSelector((state) => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);
  const navigate = useNavigate();

  const handleConnect = async () => {
    setError('');
    if (!navigator.onLine) {
      setError('You appear to be offline. Please check your connection and try again.');
      return;
    }

    setIsLoading(true);
    try {
      // assume this returns a Promise; if not, wrap it
      await createStripeConnectAccount(
        portal.createdBy,
        portal.stripe_connect_account_id,
        portal.id
      );
 
    } catch (err) {
      console.error(err);
      setError(
        err?.message ||
        'Something went wrong on our end. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // initial loading of user/portal data
  if (!user || !portal) {
    return (
      <Layout hideMobileNav>
        <PageHeader
          title="Session Expired"
          description="Your session has expired. Please refresh to continue."
        />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader className="animate-spin h-8 w-8 text-gray-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideMobileNav>
      <PageHeader
        title="Session Expired"
        description="Your session has expired. Please refresh to continue."
      />

      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="text-center max-w-md">
          {error && (
            <div className="flex items-center bg-red-100 text-red-700 p-4 rounded-md mb-6">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-center mb-6">
            <AlertTriangle size={64} strokeWidth={1.5} className="text-amber-500" />
          </div>

          <p className="text-3xl font-medium mb-2">Session Expired</p>
          <p className="text-gray-600 mb-8">
            Your session has expired—would you like to reconnect?
          </p>

          <div className="flex justify-center space-x-4">
            <Button
              className="bg-black text-white px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isLoading}
              onClick={handleConnect}
            >
              {isLoading && (
                <Loader className="animate-spin h-5 w-5 mr-2" />
              )}
              {isLoading ? 'Connecting...' : 'Connect'}
            </Button>

            <Button
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md"
              onClick={() => navigate('/')}
            >
              Go back to dashboard
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
