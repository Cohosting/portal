import React, { useContext, useEffect, useState } from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { Transition } from '@headlessui/react';
import { signUpUserWithPortalAndSeat } from '../../utils/signupUtils';
import { supabase } from '../../lib/supabase';
import { AuthListenerContext } from '../../pages/Auth/AuthListener';
import { useDispatch } from 'react-redux';
import { setCurrentSelectedPortal, setUser } from '../../store/slices/authSlice';


const AccountSetupCompletion = ({
  setShouldShowStep
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [session, setSession] = useState(null);
  const dispatch = useDispatch();
  const { refetchUserData } = useContext(AuthListenerContext);
  useEffect(() => {
    // Set up Supabase Auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Cleanup listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleFixSetup = async () => {
    if (!session) {
      return;
    }

    setIsLoading(true);
    try {
      await signUpUserWithPortalAndSeat({
        id: session.user.id,
        email: session.user.email,
      });



      const data = await refetchUserData();
      const userData = {
        ...data.user,
        portals: data.portals,
        default_portal: data?.user?.default_portal,
      }
      dispatch(setUser(userData));
      dispatch(setCurrentSelectedPortal(userData?.default_portal));


      console.log(`user`, data);

      setShouldShowStep(true);
      setIsComplete(true);
    } catch (error) {
      console.error('Failed to complete setup:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <p className="text-center text-gray-600">Please sign in to complete your account setup.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <Transition
        show={!isComplete}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center mb-4 text-amber-500">
            <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
            <h2 className="text-lg font-semibold">Account Setup Incomplete</h2>
          </div>
          <p className="text-gray-600 mb-6">
            We encountered an issue while setting up your account. Some of your data may not have been stored properly. Don't worry, we can fix this quickly!
          </p>
          <button
            onClick={handleFixSetup}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Fixing...' : 'Complete Setup'}
          </button>
        </div>
      </Transition>

      <Transition
        show={isComplete}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        <div className="bg-green-50 p-4 rounded-md border border-green-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your account setup is now complete. Thank you for your patience.</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default AccountSetupCompletion;