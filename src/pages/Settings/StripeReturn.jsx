import React, { useEffect, useState } from 'react';
import { createStripeConnectAccount } from '../../utils/stripe';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/axiosConfig';
import { Button } from '@headlessui/react';

export const StripeReturn = () => {
  const [stripeUser, setStripeUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFill, setIsLoadingFill] = useState(false);
  const { currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);

  const getStripeUser = async stripeConnectAccountId => {
    if (!stripeConnectAccountId) {
      throw new Error('No stripe connect account id found');
    }
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get(`/stripe/connect/account/${stripeConnectAccountId}`);
      const stripeAccount = data.stripeAccount;

      setStripeUser(stripeAccount);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!portal) return;
    getStripeUser(portal.stripe_connect_account_id);
  }, [portal]);

  console.log({
    stripeUser,
  });

  return (
    <div className="p-4">
      <p className="text-4xl">Let me check your account</p>

      {isLoading && <div className="m-5 animate-spin">🔄</div>}
      {stripeUser && stripeUser.details_submitted && (
        <p className="text-2xl">
          Your account information submitted successfully
        </p>
      )}
      {stripeUser && !stripeUser.details_submitted && (
        <p className="text-2xl">
          Your account information is not submitted successfully
        </p>
      )}
      {stripeUser && !stripeUser.charges_enabled && (
        <div className="text-2xl flex flex-col gap-2">
          <p>Your onboarding is not completed</p>
          {stripeUser?.requirements?.pending_verification.length > 0 && (
            <>
              <p className="text-red-500">Your information is being verified! It's pending! please wait for confirmation</p>
              <p></p>
            </>
          )}
          {stripeUser?.requirements?.currently_due.length > 0 && stripeUser?.requirements?.past_due.length > 0 && (
            <p className="text-red-700">
              Thanks for submitting your information. It seems you still need to submit some information or documents. Please submit those.
            </p>
          )}

          <p>Do you want to fill it!? </p>
          <Button
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={isLoadingFill}
            onClick={() =>
              createStripeConnectAccount(
                portal.uid,
                portal.stripe_connect_account_id,
                portal.id,
                setIsLoadingFill
              )
            }
          >
            {isLoadingFill ? 'Loading...' : 'Fill it'}
          </Button>
        </div>
      )}
    </div>
  );
};
