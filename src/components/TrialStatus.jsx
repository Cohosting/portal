import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../context/authContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PortalContext } from '../context/portalContext';

export const TrialStatus = () => {
  const [trialStatus, setTrialStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { portal } = useContext(PortalContext);

  useEffect(() => {
    if (!portal) {
      return;
    }
    const checkTrialStatus = async () => {
      try {
        if (portal) {
          const currentDate = new Date();
          const trialEndDate = portal.trialEndDate.toDate();

          if (currentDate > trialEndDate && portal.isExpiryCount) {
            setTrialStatus('expired');
          } else {
            let dayRemained = Math.floor(
              (trialEndDate.getTime() - currentDate.getTime()) /
                (1000 * 3600 * 24)
            );

            setTrialStatus('active -- ' + dayRemained + ' days left');
          }
        }
      } catch (error) {
        console.error('Error checking trial status:', error);
      }

      setIsLoading(false);
    };

    checkTrialStatus();
  }, [portal]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (trialStatus === 'expired') {
    return (
      <div>
        <p>
          Your trial has expired. Please subscribe to continue using the app.
        </p>
        {/* Add subscription payment integration here */}
      </div>
    );
  }

  return (
    <div>
      <p>Your trial is {trialStatus}</p>
      {/* Render your app content for users with an active trial */}
    </div>
  );
};
