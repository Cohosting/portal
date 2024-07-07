import React, { useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiDotsHorizontal } from 'react-icons/hi';
import { AiOutlineEdit } from 'react-icons/ai';
import { usePortalClients, usePortalData } from '../../hooks/react-query/usePortalData';
import { useSelector } from 'react-redux';
import { } from '../../hooks/useRealtimePortalClients';
import EmptyStateFeedback from '../../components/EmptyStateFeedback';
import { SquaresPlusIcon } from '@heroicons/react/24/outline';
import { AppView } from './AppView';

const MemberItem = ({
  member,
  setCurrentSelectedMember,
  isActive = false,
  isConnected,
}) => {
  return (
    <Flex
      p={4}
      borderBottom={'1px solid gray'}
      alignItems={'center'}
      justifyContent={'space-between'}
      cursor={'pointer'}
      onClick={() => setCurrentSelectedMember(member.id)}
      sx={{
        ...(isActive && {
          bg: 'gray.100',
          borderLeft: '4px solid blue',
          color: 'blue',
        }),
      }}
    >
      <Flex alignItems={'center'}>
        {!member?.photoURL && (
          <Box w={10} h={10} borderRadius={'50%'} bg={'gray.200'} mr={4}></Box>
        )}

        <Text>{member.name}</Text>
      </Flex>
      <Text>{member?.role}</Text>
      {isConnected && <Text>Connected</Text>}
    </Flex>
  );
};

const isConnected = (app, memberId) => {
  if (app?.settings?.setupType === 'automatic') return true;
  if (app?.settings?.setupType === 'manual') {
    const clientSettings = app?.settings?.clientsSettings.find(
      client => client?.clientId === memberId
    );
    if (clientSettings) return true;
  }
  return false;
};

export const AppConfigurations = () => {
  const { appId } = useParams()

  const [currentSelectedMember, setCurrentSelectedMember] = useState(null);
  const { user } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(user?.portals)
  const { data: clients } = usePortalClients(portal?.id)
  const app = portal?.portal_apps.find(app => app.id === appId)

  // need to fetch portal data from database

  const { isOpen, onToggle } = useDisclosure();


  const navigate = useNavigate();


  // need to fetch clients data from database


  console.log(clients)

  console.log(appId)
  if (!portal?.portal_apps.filter((app) => !app.is_default).length && appId === 'no-apps') return (<Layout>
    <div className='mt-[100px]'>

      <EmptyStateFeedback
        IconComponent={SquaresPlusIcon}
        title={'Add an app to get started'}
        message={
          'You have not added any apps to your portal. Click the button below to add an app.'
        }
        buttonText={'Add an app'}

        onButtonClick={() => navigate('/apps/new')}
      />


    </div>

  </Layout>);
  return (
    <Layout>
      <Flex h={'inherit'}>

        <>
          <Box flex={1} >
            <Flex p={4} borderBottom={'1px solid gray'}>
              {app?.name}
            </Flex>

            <Box>
              {clients?.map(member => (
                <MemberItem
                  isConnected={isConnected(app, member.id)}
                  isActive={currentSelectedMember === member.id}
                  member={member}
                  setCurrentSelectedMember={id =>
                    setCurrentSelectedMember(id)
                  }
                />
              ))}
            </Box>
          </Box>

          <Box bg={'#c6c6c64a'} flex={1} h={'100%'}>
            <Flex
              px={4}
              py={2}
              alignItems={'center'}
              justifyContent={'space-between'}
              borderBottom={'1px solid gray'}
            >
              {/* member name */}
              <Text>
                {
                  clients?.find(
                    client => client.id === currentSelectedMember
                  )?.name
                }
              </Text>
              {(app?.settings?.setupType === 'automatic' ||
                isConnected(app, currentSelectedMember)) && (
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<HiDotsHorizontal />}
                      variant="outline"
                    />
                    <MenuList>
                      <MenuItem
                        onClick={() => {
                          if (app.settings.setupType === 'automatic') {
                            navigate(
                              `/apps/${app.id}/edit`
                            );
                            return;
                          }

                          onToggle();
                        }}
                        icon={<AiOutlineEdit />}
                      >
                        Edit app
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}
            </Flex>
            <AppView
              isConnected={isConnected(app, currentSelectedMember)}
              clientId={currentSelectedMember}
              app={app}
              isOpen={isOpen}
              onToggle={onToggle}
            />
          </Box>
        </>

      </Flex>
    </Layout>
  );
};
