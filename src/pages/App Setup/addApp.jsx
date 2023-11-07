import React, { useContext, useEffect, useState } from 'react';
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
import { AddAppForm } from './AddAppForm';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AuthContext } from '../../context/authContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { PortalContext } from '../../context/portalContext';
import queryString from 'query-string';

export const AddApp = () => {
  const [appEditState, setAppEditState] = useState(null);
  const [extentionId, setExtentionId] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const { user } = useContext(AuthContext);
  const { portal } = useContext(PortalContext);
  const location = useLocation();
  const [appState, setAppState] = useState({
    name: '',
    icon: '',
    settings: {
      autoSize: false,
      setupType: 'automatic',
      viewType: 'embedded',
      content: '',
      clientsSettings: [],
    },
  });
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const ref = doc(collection(db, 'apps'));

      if (!extentionId) {
        /* Creating apps */
        await setDoc(ref, {
          ...appState,
          createdAt: new Date(),
          portalId: portal.id,
          createdBy: user.uid,
          id: ref.id,
        });
        await updateDoc(doc(db, 'portals', portal.id), {
          apps: arrayUnion({
            name: appState.name,
            id: ref.id,
            icon: appState.icon,
            index: portal.apps.length,
          }),
        });
      } else {
        await updateDoc(doc(db, 'apps', extentionId), {
          ...appState,
          updatedAt: new Date(),
        });
        const oldApp = portal.apps.find(app => app.id === extentionId);
        await updateDoc(doc(db, 'portals', portal.id), {
          apps: arrayRemove(oldApp),
        });

        /* Adding new one */
        await updateDoc(doc(db, 'portals', portal.id), {
          apps: arrayUnion({
            name: appState.name,
            id: extentionId,
            icon: appState.icon,
            index: oldApp.index,
          }),
        });
      }

      setIsLoading(false);

      navigate('/');
    } catch (error) {
      console.log('Error creating apps: ', error);
      setIsError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!extentionId) {
      setIsFetching(false);
      return;
    }
    (async () => {
      const getExtention = async () => {
        setIsFetching(true);
        const extention = await getDoc(doc(db, 'apps', extentionId));
        setAppState(extention.data());
        setAppEditState(extention.data());
        setIsFetching(false);
      };
      getExtention();
    })();

    return () => {};
  }, [extentionId]);

  useEffect(() => {
    const extentionId = queryString.parse(location.search).extentionId;
    setExtentionId(extentionId);
  }, [location]);
  return (
    <Layout>
      <Flex
      flexDir={['column', 'row']}
        alignItems={'center'}
        justifyContent={'space-between'}
        p={[2,3]}
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
          <Button size={'sm'} variant={'outline'}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            isDisabled={
              !appState.name ||
              (appState.settings.setupType !== 'manual' &&
                !appState.settings.content)
            }
            size={'sm'}
            ml={2}
            onClick={handleSubmit}
          >
            {extentionId ? 'Update' : 'Add'}
          </Button>
        </Box>
      </Flex>
      {isFetching && <div>Loading...</div>}
      {!isFetching && (
        <AddAppForm
          mode={extentionId ? 'edit' : 'add'}
          appState={appState}
          setAppState={setAppState}
        />
      )}
    </Layout>
  );
};
