import React, { useState } from 'react'
import { createStripeConnectAccount } from '../../utils/stripe';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { Spinner } from '@phosphor-icons/react';
import { Button } from '@headlessui/react';

export const Refresh = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal)

  const navigate = useNavigate();
  return (
    <div className="p-4">
      {
        !user || !portal ? <Spinner className="animate-spin" /> : (
          <>
            <p className="text-4xl">The session may be expired. wanna continue?</p>

            <Button
              className={`bg-green-500 text-white px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              className="ml-3 bg-transparent text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
              onClick={() => navigate('/')}
            >
              Go back to the dashboard
            </Button>
          </>
        )
      }
    </div>
  );
};
