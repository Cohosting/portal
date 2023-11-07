import React, { useContext, useEffect, useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import {
  Box,
  Flex,
  IconButton,
  Text,
  VStack,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  Button,
  Collapse,
  useToast,
} from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MdDragHandle, MdMoreVert, MdAdd } from 'react-icons/md';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { PortalContext } from '../../context/portalContext';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { GiSightDisabled } from 'react-icons/gi';

export const AppSetup = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [previousList, setPreviousList] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [list, setList] = useState([]);
  const { portal } = useContext(PortalContext);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!portal) return;
    // sort the apps
    const apps = portal.apps.sort((a, b) => a.index - b.index);
    setList(apps);
    setPreviousList(apps);
  }, [portal]);

  useEffect(() => {
    if (previousList !== null) {
      const dataChanged = JSON.stringify(list) !== JSON.stringify(previousList);
      setHasChanges(dataChanged);
    }
  }, [list, previousList]);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      // use v9 syntax
      const portalRef = doc(db, 'portals', portal.id);
      await updateDoc(portalRef, {
        apps: list,
      });

      setPreviousList(list);
      setHasChanges(false);
      setIsLoading(false);
      toast({
        title: 'App order updated.',
        description: 'The order of your apps has been successfully updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoading(false);
      console.log(`Could not update portal: ${error}`);
    }
    // Perform the update logic here
  };

  if (!portal) {
    return <Layout>Loading...</Layout>;
  }

  const handleDeleteApp = async id => {
    // Filter the deleted app and update the database and  list with also index updating

    try {
      const newList = list.filter(item => item.id !== id);
      newList.forEach((item, index) => {
        item.index = index;
      });
      const portalRef = doc(db, 'portals', portal.id);
      setList(newList);
      setPreviousList(newList);
      await updateDoc(portalRef, {
        apps: newList,
      });

      toast({
        title: 'App deleted.',
        description: 'The app has been successfully deleted.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log(`Error deleting app: ${error}`);
    }
  };

  const markAsDisabled = async id => {
    try {
      const newList = list.map(item => {
        if (item.id === id) {
          item.disabled = !item.disabled;
        }
        return item;
      });
      const portalRef = doc(db, 'portals', portal.id);
      setList(newList);
      setPreviousList(newList);
      await updateDoc(portalRef, {
        apps: newList,
      });

      toast({
        title: 'App updated.',
        description: 'The app has been successfully updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log(`Error updating app: ${error}`);
    }
  };

  return (
    <Layout>
      <Box p={[2,4]} mt={4} >
      <Collapse in={hasChanges} animateOpacity>
        
        <Flex
          alignItems={'center'}
          justifyContent={'flex-end'}
          borderBottom={'1px solid #ccc'}
        >
          <Button variant={'outline'} size={'md'}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            onClick={handleUpdate}
            ml={3}
            size={'md'}
          >
            update
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
          <Text fontSize={['lg',"xl"]}>App Setup</Text>
          <IconButton
            onClick={() => navigate(`setup`)}
            icon={<MdAdd />}
            aria-label="Add New"
          />
        </Flex>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="list">
            {provided => (
              <VStack
                {...provided.droppableProps}
                ref={provided.innerRef}
                align="stretch"
                spacing={4}
              >
                {list?.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={item.index}
                  >
                    {provided => (
                      <Flex
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        alignItems="center"
                        justifyContent="space-between"
                        px={[2,4]}
                        py={2}
                        boxShadow="md"
                        borderRadius="md"
                        bg="white"
                      >
                        <Flex
                          flex={1}
                          {...provided.dragHandleProps}
                          alignItems="center"
                        >
                          <Box as={MdDragHandle} color="gray.400" mr={2} />
                          <Box>
                            <Text fontSize={['15px', '16px']}>{item.name}</Text>
                            <Text fontSize={['12px', '14px']}>Read more</Text>
                          </Box>
                        </Flex>
                        <Menu>
                          <MenuButton
                            variant={'ghost'}
                            as={IconButton}
                            aria-label="Options"
                            icon={<HamburgerIcon />}
                          />
                          <MenuList> 
                            {
                              !item.isDefault && (
                                <MenuItem
                                icon={<AiOutlineEdit />}
                                onClick={() =>
                                  navigate(
                                    `/module-management/setup?extentionId=${item.id}`
                                  )
                                }
                              >
                                Edit
                              </MenuItem>
                              )
                            }
                       
                            {!item.isDefault && (
                              <MenuItem
                                onClick={() => handleDeleteApp(item.id)}
                                icon={<AiOutlineDelete />}
                              >
                                Delete
                              </MenuItem>
                            )}
                            {item.isDefault && (
                              <MenuItem
                                onClick={() => markAsDisabled(item.id)}
                                icon={<GiSightDisabled />}
                              >
                                Disabled
                              </MenuItem>
                            )}
                          </MenuList>
                        </Menu>
                      </Flex>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </VStack>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
</Box>

    </Layout>
  );
};
