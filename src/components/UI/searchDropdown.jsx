import React, { useState } from 'react';
import {
  Input,
  InputGroup,
  InputRightElement,
  Box,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react';

export const SearchDropdown = ({ users, onSelectUser }) => {
  const [searchValue, setSearchValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

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

  return (
    <Box position="relative" zIndex={2222}>
      <InputGroup>
        <Input
          type="text"
          placeholder="Search for a user"
          value={searchValue}
          onChange={handleInputChange}
        />
        {showDropdown && (
          <List
            zIndex={9999999}
            spacing={1}
            mt={2}
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
                  w={'100%'}
                  key={user.id}
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{ background: 'gray.100' }}
                  onClick={() => handleSelectUser(user)}
                >
                  <Text>{user.name}</Text>
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
