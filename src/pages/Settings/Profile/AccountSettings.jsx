import React from 'react';
import PersonalInformation from '../components/PersonalInformation';
import ChangePassword from '../components/ChangePassword';
import LogoutOtherSessions from '../components/LogoutOtherSessions';
import DeleteAccount from '../components/DeleteAccount';
import { useSupabase } from '../../../hooks/useSupabase';
import { Spinner } from '@phosphor-icons/react';


export const AccountSettings = () => {
  const { user, updateProfile, changePassword, logoutOtherSessions, deleteAccount, loading, logout } = useSupabase();


  console.log({
    user, loading
  })
  return (
    <div>
      {
        loading ? (
          <div className="  w-full h-full bg-white bg-opacity-70 z-50 flex items-center justify-center">
            <Spinner className='animate-spin w-8 h-8 ' />
          </div>
        ) : (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <PersonalInformation user={user} updateProfile={updateProfile} />
              <ChangePassword changePassword={changePassword} />
              <LogoutOtherSessions logoutOtherSessions={logoutOtherSessions} />
              <DeleteAccount deleteAccount={deleteAccount} />

              {/* signout */}
              <button onClick={logout}>Logout</button>
            </div>
          </>
        )

      }

    </div>
  );
};