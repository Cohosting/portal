// components/AppListItem.jsx
import React from 'react';
import { Flex, Box, Text, Menu, MenuButton, IconButton, MenuItem, MenuList } from '@chakra-ui/react';
import { MdDragHandle } from 'react-icons/md';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { GiSightDisabled } from 'react-icons/gi';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const AppListItem = ({ item, provided, handleDeleteApp, markAsDisabled }) => {

    const navigate = useNavigate()

    return (
        <Flex
            ref={provided.innerRef}
            {...provided.draggableProps}
            alignItems="center"
            justifyContent="space-between"
            px={[2, 4]}
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
                            onClick={() => markAsDisabled(item.id, item.disabled ? false : true)}
                            icon={<GiSightDisabled />}
                        >
                            {
                                item.disabled ? 'Enable' : 'Disable'
                            }
                        </MenuItem>
                    )}
                </MenuList>
            </Menu>
        </Flex>
    )
};

export default AppListItem;