import React from 'react';
import { Layout } from '../Dashboard/Layout';
import { AppFormFields } from './AppFormFields';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from './useAppForm';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import PageHeader from '@/components/internal/PageHeader';
import { Button } from '@/components/ui/button';

export const AppForm = () => {
  const {
    appState,
    setAppState,
    isLoading,
    isFetching,
    handleSubmit,
    mode,
    appId,
    isError
  } = useAppForm();

  const navigate = useNavigate();
  let title = mode === 'edit' ? 'Edit Application' : 'Create New Application';
  let description = mode === 'edit' ? 'Update the details of your existing application.' : 'Start by entering information to create a new application.';

  if( isFetching || isLoading) {
    return (
      <Layout hideMobileNav>
                <header className="bg-white border-b border-gray-200 p-6">
          <div className="flex flex-col">
          <div  className={`bg-gray-200 rounded h-6 w-32 mb-2`} style={{ opacity: 0.7 }}    />
          <div className={`bg-gray-200 rounded h-4 w-80  2`}  style={{ opacity: 0.7 }}  />

          </div>
        </header>
      </Layout>
    );
  }



  return (
    <Layout hideMobileNav >
      <PageHeader
  title={title}
  description={description }
/>
      <div className="w-full px-7     ">

        {isFetching && <div>Loading...</div>}
        {!isFetching && (
          <AppFormFields mode={mode} appState={appState} setAppState={setAppState} />
        )}
        {isError && <div className='text-red-500 flex items-center mt-4 '>
          {/* error message with icon */}
          <ExclamationCircleIcon className='w-6 h-6 mr-2' />
          <span>{isError}</span>
        </div>}
        {/* Action div */}
        <div className="mt-4 flex justify-end">
  {/* Cancel Button */}
  <Button
    className="text-gray-500  border border-transparent transition-colors duration-200 px-4 py-2 rounded"
    onClick={() => navigate(-1)}
  >
    Cancel
  </Button>

  {/* Create / Update Button */}
  <Button
    onClick={handleSubmit}
    className="  px-8 py-2 bg-black text-white hover:bg-neutral-900 transition-colors duration-200  "
  >
    {isLoading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
  </Button>
</div>

      </div>
    </Layout>
  );
};
