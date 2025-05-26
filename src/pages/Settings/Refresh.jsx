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
  const { user, currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);
  const navigate = useNavigate();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <Layout hideMobileNav>
      <PageHeader
        title="Session Expired"
        description="Your session has expired. Please refresh to continue."
      />

      <div className="flex flex-col items-center justify-center h-[60vh]">
        {!user || !portal ? (
          <Loader className="animate-spin h-8 w-8 text-gray-600" />
        ) : (
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-6">
                <AlertTriangle size={64} strokeWidth={1.5} className="text-amber-500" />
              </div>

              <p className="text-3xl font-medium mb-2">Session Expired</p>
              <p className="text-gray-600 mb-8">
                The session may be expired. Wanna continue?
              </p>

              <div className="flex justify-center space-x-4">
                <Button
                  className={`bg-black text-white px-6 py-2 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  disabled={isLoading}
                  onClick={() =>
                    createStripeConnectAccount(
                      portal.createdBy,
                      portal.stripe_connect_account_id,
                      portal.id,
                      setIsLoading
                    )
                  }
                >
                  {isLoading ? 'Loading...' : 'Connect'}
                </Button>
                <Button
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md"
                  onClick={() => navigate('/')}
                >
                  Go back to the dashboard
                </Button>
              </div>
            </div>
        )}
      </div>
    </Layout>
  );
};
