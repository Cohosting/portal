import React from 'react';
import PersonalInformation from '../components/PersonalInformation';
import ChangePassword from '../components/ChangePassword';
import LogoutOtherSessions from '../components/LogoutOtherSessions';
import DeleteAccount from '../components/DeleteAccount';
import { useSupabase } from '../../../hooks/useSupabase';
import { Loader } from 'lucide-react';
import { Layout } from '@/pages/Dashboard/Layout';
import DashboardSkeleton, { CustomSkeleton } from '@/components/SkeletonLoading';
import PageHeader from '@/components/internal/PageHeader';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';


export const AccountSettings = () => {
  const { user, updateProfile, changePassword, logoutOtherSessions, deleteAccount, loading, logout } = useSupabase();

  console.log('loading', loading)

  if (loading) return  (
<Layout>
            <header className="bg-white border-b px-3 sm:px-6 border-gray-200 py-4 sm:py-5 lg:py-6">
              <div className="flex flex-col">
                {/* icon skeleton  */}
                <div className="flex items-center mb-0 lg:mb-2  ">
                  <div className="animate-pulse rounded-sm block lg:hidden h-6 w-6 bg-gray-200 mr-4" />
                  <CustomSkeleton className="h-6 w-32" />
                </div>
                <CustomSkeleton className="h-4 w-80 hidden lg:block" />
              </div>
            </header>
            <div className='flex items-center justify-center mt-3'>

              <Loader className='animate-spin w-8 h-8 ' />

              <p className='ml-2'>Loading...</p>
            </div>
  </Layout>
)
  
  return (
    <Layout>
      <PageHeader
        title="Account Settings"
        description="Manage your account settings."
      />
      {
        loading ? (
          <div className="  w-full   bg-white bg-opacity-70 z-50 flex items-center justify-center">
            <Loader className='animate-spin w-8 h-8 ' />
          </div>
        ) : (
          <>
            <div className="max-w-7xl  px-6 pb-6 mt-4">
              <PersonalInformation user={user} updateProfile={updateProfile} />
              <ChangePassword changePassword={changePassword} />
              {/* <DeleteAccount deleteAccount={deleteAccount} /> */}


              <div className="mt-6">  
                <p className="text-sm font-medium text-gray-600"> Logout from this device</p>
                <Button onClick={logout}
              className="mt-4 rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout</Button>
              </div>
            </div>
          </>
        )

      }

    </Layout>
  );
};