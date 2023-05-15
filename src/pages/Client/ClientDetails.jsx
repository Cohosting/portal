import React, { useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import {
  Box,
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { AiOutlinePlus } from 'react-icons/ai';
import { property } from '../../utils/config';

export const ClientDetails = () => {
  const [customProperties, setCustomProperties] = useState([]);

  const handleCreateCustomProperties = el => {
    setCustomProperties([...customProperties, { ...el, id: Math.random() }]);
  };
  console.log({ customProperties });
  return (
    <Layout>
      <Flex direction={'column'} h={'inherit'}>
        <Flex
          height={'min-content'}
          p={3}
          alignItems={'center'}
          justifyContent={'space-between'}
          borderBottom={'1px solid #eff1f4'}
        >
          <Text>Client Details</Text>
          <Button>New</Button>
        </Flex>
        <Flex flex={1}>
          <Box flex={1} h={'100%'}>
            <Tabs>
              <TabList>
                <Tab>Messages</Tab>
                <Tab>Invoices</Tab>
                <Tab>Files</Tab>
                <Tab>Forms</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <p>This is message!</p>
                </TabPanel>
                <TabPanel>
                  <p>This is invoice!</p>
                </TabPanel>
                <TabPanel>
                  <p>This is files!</p>
                </TabPanel>
                <TabPanel>
                  <p>This is forms!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
          <Box
            height={'100%'}
            w={'400px'}
            boxShadow={'-5px 4px 15px rgba(0, 0, 0, 0.07)'}
            p={2}
          >
            <Text>User details</Text>
            <Flex alignItems={'center'} mt={3}>
              <Image
                w={'50px'}
                h={'50px'}
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                alt="Client-image"
                borderRadius={'8px'}
              />
              <Flex direction={'column'} ml={2}>
                <Text>John Doe</Text>
                <Text>exxamplee@gmail.com</Text>
              </Flex>
            </Flex>
            <Flex flexDir={'column'} mt={3}>
              <Text>Joined</Text>
              <Text>23rd march 2023</Text>
            </Flex>

            <Box>
              <Text py={2} borderBottom={'1px solid gray'}>
                <Menu>
                  {({ isOpen }) => (
                    <>
                      <MenuButton
                        isActive={isOpen}
                        as={Button}
                        rightIcon={<AiOutlinePlus />}
                      >
                        Open
                      </MenuButton>
                      <MenuList>
                        {property.map((el, index) => (
                          <MenuItem
                            onClick={() => handleCreateCustomProperties(el)}
                            icon={el.icon}
                            key={el.id}
                          >
                            {el.title}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </>
                  )}
                </Menu>
              </Text>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};
