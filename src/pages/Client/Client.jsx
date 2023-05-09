import { Box, Button, Divider, Flex, Text, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Layout } from '../Dashboard/Layout';
import { InviteForm } from './InviteForm';

export const Client = () => {
    const [clients, setClients] = useState([]);
    const { isOpen, onToggle } = useDisclosure()
   
    return (
        <Layout>
           <Box p={4} >
            <Box py={3}>
                <Flex alignItems={'center'}  justifyContent={'space-between'} >
                    <Text>Client</Text>
                    <Button onClick={onToggle} mb={3} >Invite</Button>
                </Flex>
                <Divider  />
             </Box>
            </Box>
            <InviteForm  isOpen={isOpen}  onClose={onToggle} />
        </Layout>

  )
}
