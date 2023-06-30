import { useEffect, useState } from 'react';

export const useTrialStatus = portal => {
  const [trialStatus, setTrialStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!portal) {
      setIsLoading(false);
      return;
    }

    const checkTrialStatus = async () => {
      try {
        const currentDate = new Date();
        const trialEndDate = portal.trialEndDate.toDate();
        /* isExpiryCount is used to deccide wheather we should consider expire period! because if it subscribe to the app then it should not count any trial period */
        if (currentDate > trialEndDate && portal.isExpiryCount) {
          setTrialStatus('expired');
        } else if (currentDate < trialEndDate && portal.isExpiryCount) {
          setTrialStatus('active');
        } else if (!portal.isExpiryCount) {
          setTrialStatus('notApplicable');
        }
      } catch (error) {
        console.error('Error checking trial status:', error);
      }

      setIsLoading(false);
    };

    checkTrialStatus();
  }, [portal]);

  return { trialStatus, isLoading };
};
