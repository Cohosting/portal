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

export const AppsList = () => {
  const navigate = useNavigate();

  const { user } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(user?.portals);

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
    <Layout>
      <Box p={[2, 4]} mt={4}>
        <Collapse in={hasChanges} animateOpacity>
          <Flex
            alignItems={'center'}
            justifyContent={'flex-end'}
            borderBottom={'1px solid #ccc'}
            p={2}
          >
            <Button
              variant={'outline'}
              size={'md'}
              onClick={() => {
                setList(previousList);
              }}
            >
              Cancel
            </Button>
            <Button
              isLoading={isLoading}
              onClick={handleUpdate}
              ml={3}
              size={'md'}
            >
              Update
            </Button>
          </Flex>
        </Collapse>

        <Box>
          <Flex
            justifyContent="space-between"
            mb={4}
            pb={4}
            borderBottom={'1px solid gray'}
          >
            <Text fontSize={['lg', "xl"]}>App</Text>
            <IconButton
              onClick={() => navigate('new')}
              icon={<MdAdd />}
              aria-label="Add New"
            />
          </Flex>

          <DragDropList
            list={list}
            onDragEnd={handleDragEnd}
            handleDeleteApp={handleDeleteApp}
            markAsDisabled={markAsDisabled}
          />
        </Box>
      </Box>
    </Layout>
  );
};
