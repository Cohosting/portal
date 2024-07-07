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
    <Layout>
      <Flex
        flexDir={['column', 'row']}
        alignItems={'center'}
        justifyContent={'space-between'}
        p={[2, 3]}
        borderBottom={'1px solid #eee'}
      >
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
          fontSize={['14px', '16px']}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Apps</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">Add an app</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">Custom app</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Box mt={[3, 0]}>
          <Button size={'sm'} variant={'outline'} onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            // isDisabled={
            //   !appState.name ||
            //   (appState.settings.setupType !== 'manual' &&
            //     !appState.settings.content)
            // }
            size={'sm'}
            ml={2}
            onClick={handleSubmit}
          >
            {appId ? 'Update' : 'Add'}
          </Button>
        </Box>
      </Flex>
      {isFetching && <div>Loading...</div>}
      {!isFetching && (
        <AppFormFields mode={mode} appState={appState} setAppState={setAppState} />
      )}
    </Layout>
  );
};
