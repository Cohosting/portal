import React from 'react';
import { Layout } from '../Dashboard/Layout';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
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
      <Box w={['100%', '85%']} mx={'auto'} fontSize={['15px', '16px']} mt={5}>
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
        <Flex mt={4} justify='flex-end'>
          <button className='text-md cursor-pointer ' onClick={() => navigate(-1)} >Cancel</button>


          <button onClick={handleSubmit} className='btn-indigo ml-4 px-8'>
            {isLoading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
          </button>


        </Flex>
      </Box>

    </Layout>
  );
};
