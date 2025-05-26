// CommonBoxContainer.jsx
import React from 'react';
import { Flex } from '@chakra-ui/react';

const CommonBoxContainer = ({ children, isActive, onClick }) => {
    return (
        <Flex
            onClick={onClick}
            cursor={'pointer'}
            borderRadius={'4px'}
            bg={isActive ? 'rgb(239, 241, 244)' : 'transparent'}
            _hover={{
                bg: 'rgb(239, 241, 244)',
                transition: '0.2s',
            }}
            alignItems={'center'}
            p={'4px 8px'}
        >
            {children}
        </Flex>
    );
};

export default CommonBoxContainer;