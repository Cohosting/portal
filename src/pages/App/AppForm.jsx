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

export const AppForm = () => {
  const {
    appState,
    setAppState,
    isLoading,
    isFetching,
    handleSubmit,
    mode,
    appId
  } = useAppForm();

  const navigate = useNavigate();


  return (
    <Layout headerName='Apps'>
      <Box w={['100%', '85%']} mx={'auto'} fontSize={['15px', '16px']} mt={5}>
        {isFetching && <div>Loading...</div>}
        {!isFetching && (
          <AppFormFields mode={mode} appState={appState} setAppState={setAppState} />
        )}
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
