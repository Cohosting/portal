import React from 'react';
import { Layout } from '../Dashboard/Layout';
import { AppFormFields } from './AppFormFields';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from './useAppForm';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

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

  console.log(
    {
      appState
    }
  )
  return (
    <Layout headerName='Apps'>
      <div className="w-full md:w-10/12 mx-auto text-sm md:text-base mt-5">
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
          <button className='text-md cursor-pointer ' onClick={() => navigate(-1)} >Cancel</button>

          <button onClick={handleSubmit} className='btn-indigo ml-4 px-8'>
            {isLoading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </Layout>
  );
};
