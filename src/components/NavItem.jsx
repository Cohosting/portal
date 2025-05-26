// NavItem.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommonBoxContainer from './CommonBoxContainer';
import { Flex, Text } from '@chakra-ui/react';

const NavItem = ({ children, icon, url, isActive, onClick }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (onClick) {
            onClick();
        } else if (url) {
            navigate(url);
        }
    };

    return (
        <CommonBoxContainer isActive={isActive} onClick={handleNavigate}>
            <Flex alignItems={'center'} cursor={'pointer'}>
                {icon}
                <Text ml={2} fontSize={'13px'}>
                    {children}
                </Text>
            </Flex>
        </CommonBoxContainer>
    );
};

export default NavItem;