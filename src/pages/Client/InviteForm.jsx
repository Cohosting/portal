
//create a invite modal  form with email name and account type(client or member) using chakra UI


import { Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

export const InviteForm = ({  isOpen, onClose }) => {
    const [inviteState, setInviteState] = useState({
        email: '',
        name: '',
        accountType: 'client',
      });

      const  handleChange = (e) => {
        setInviteState({
          ...inviteState,
          [e.target.name]: e.target.value,
        });
      };

      


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Modal Title</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <VStack   align='stretch'
  >

        <Box>
            <Text mb={1}>Email</Text>
            <Input name='email' value={inviteState.email} onChange={handleChange}  />
        </Box>
        <Box>
            <Text mb={1}  >Name</Text>
            <Input  name='name' value={inviteState.name} onChange={handleChange} />
        </Box>
        <Box>
            <Text mb={1}>Account type</Text>
            <Select value={inviteState.accountType} name='accountType' placeholder='Select option' onChange={handleChange} >
              <option value='member'>Member</option>
              <option value='client'>Client</option>
            </Select>
        </Box>
        </VStack>

      </ModalBody>

      <ModalFooter>
         <Button variant={'ghost'} >Close</Button>
         <Button>Create</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  )
}
