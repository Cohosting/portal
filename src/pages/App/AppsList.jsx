import React, { useEffect, useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import {
  Box,
  Flex,
  IconButton,
  Text,
  Button,
  Collapse,
} from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import DragDropList from '../../components/DragDropList';
import { useApps } from '../../hooks/useApps';
import SectionHeader from '../../components/SectionHeader';

export const AppsList = () => {
  const navigate = useNavigate();

  const { user, currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);

  const {
    list,
    setList,
    handleDeleteApp,
    handleUpdate,
    markAsDisabled,
    hasChanges,
    previousList,
    isLoading
  } = useApps(portal);

  const handleDragEnd = result => {
    if (!result.destination) return;

    const newList = Array.from(list);
    const movedItem = newList[result.source.index];
    newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, movedItem);

    // Update the index property of all items
    newList.forEach((item, index) => {
      item.index = index;
    });

    setList(newList);
  };



  if (!portal) {
    return <Layout>Loading...</Layout>;
  }

  console.log({ list })

  return (
    <Layout headerName='Apps'>
      <Box p={[2, 4]} mt={4}>
        <Box>

          <SectionHeader
            heading="Apps"
            description="Here you can see all the apps you have created. You can also edit or delete them."
            buttonText="Create new app"
            onClick={() => navigate('new')}
          />
          <div className='mt-3'>

          <DragDropList
            list={list}
            onDragEnd={handleDragEnd}
            handleDeleteApp={handleDeleteApp}
            markAsDisabled={markAsDisabled}
            />
          </div>
        </Box>
      </Box>

      <Collapse style={{
        position: 'absolute',
        bottom: 0,
        width: '100%'
      }} in={hasChanges} animateOpacity>
        <Flex
          alignItems={'center'}
          justifyContent={'flex-end'}
          className=' border-t border-gray-20'
          p={5}
        >
          <Button
            variant={'unstyled'}
            mr={'1rem'}
            size={'sm'}
            onClick={() => {
              setList(previousList);
            }}
          >
            Cancel
          </Button>
          <button onClick={handleUpdate} className='btn-indigo'>
            {
              isLoading ? 'Loading...' : 'Save Changes'
            }

          </button>

        </Flex>
      </Collapse>
    </Layout>
  );
};
