import React, { useEffect, useRef, useState } from 'react';
import {
  Input,
  InputGroup,
  Box,
  List,
  ListItem,
  Text,
  Avatar,
  Flex,
  useOutsideClick
} from '@chakra-ui/react';

export const SearchDropdown = ({ users, defaultValue, onSelectUser }) => {
  const [searchValue, setSearchValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef()
  useOutsideClick({
    ref: ref,
    handler: () => setShowDropdown(false),
  })
  const handleInputChange = event => {
    const { value } = event.target;
    setSearchValue(value);

    if (value) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelectUser = user => {
    setSearchValue(user.name);
    setShowDropdown(false);
    onSelectUser(user);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    if (!defaultValue) return
    if (defaultValue.name === searchValue) return

    setSearchValue(defaultValue.name)

  }, [defaultValue])

  return (
    <Box my={2} position="relative"  >
      <InputGroup>
        <Input
          type="text"
          placeholder="Search for a user"
          value={searchValue}
          onChange={handleInputChange}
        />
        {showDropdown && (
          <List
            ref={ref}
            spacing={1}
            mt={2}
            w={'100%'}
            maxW={'300px'}
            maxHeight={200}
            overflowY="auto"
            boxShadow="lg"
            bg="white"
            pos={'absolute'}
            top={'40px'}
          >
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <ListItem
                  display={'flex'}
                  alignItems={'center'}
                  w={'100%'}
                  key={user.id}
                  gap={2}
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{ background: 'gray.100' }}
                  onClick={() => handleSelectUser(user)}
                >
                  <Avatar size={'xs'} src={filteredUsers.src} name={filteredUsers.name} />
                  <Flex flexDir={'column'}>
                  <Text ml={1}>{user.name}</Text>
                    <Text ml={1}>{user.email}</Text>
                  </Flex>

                </ListItem>
              ))
            ) : (
              <ListItem px={3} py={2} textAlign="center" color="gray.500">
                No results found.
              </ListItem>
            )}
          </List>
        )}
      </InputGroup>
    </Box>
  );
};
