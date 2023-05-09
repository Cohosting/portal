import { Box, Divider, Flex, Text } from '@chakra-ui/react'
import React from 'react';
import {  useNavigate } from "react-router-dom"

import {
    AiOutlineUser,
    AiTwotoneSetting
} from 'react-icons/ai';
import { MdPayment } from 'react-icons/md';




const NavItem = ({children, icon}) => { 
    const navigate = useNavigate();
    let isActive =     window.location.pathname.replace('/', '') === children.toLowerCase() ? true : false;
    const activeStyle = {
        bg: '#fff',
        color: '#000',
        borderRadius: '4px',
        boxShadow: '0px 0px 24px rgba(0, 0, 0, 0.07)',
        p: 2
    }
    return (
        <Flex onClick={() => navigate( `/${children.toLowerCase()}`)} sx={isActive && activeStyle} alignItems={'center'} mb={2} cursor={'pointer'} >
            {icon}
            <Text ml={2}>{children}</Text>
        </Flex>
    )
}

export const Layout = ({
    children, user
}) => {

  return (
    <Flex  height={'100vh'} overflowY={'auto'}>
        <Box bg={'#f8f9fb'} p={'4px'} height={'100%'} w={'200px'} pt={'15px'} >
           <Flex alignItems={'center'} >
                <Box  display={'flex'} alignItems={'center'}  fontSize={'12px'}  bg={'white'} borderRadius={'4px'} p={2} w={'25px'} h={'25px'} >
                    <Text>

                    H
                    </Text>
                </Box>
                <Text ml={2} fontSize={'14px'}>
                    {user?.name || 'Himel'}
                </Text>
           </Flex>
           <Divider my={4} />
           <NavItem icon={<AiOutlineUser />} >Client</NavItem>
            <NavItem icon={<AiTwotoneSetting />} >Settings</NavItem>
            <NavItem icon={<MdPayment />} >Pricing</NavItem>

        </Box>
        <Box p={'10px'} height={'100%'} flex={1}> 
            {children}
        </Box>
    </Flex>
  )
}
