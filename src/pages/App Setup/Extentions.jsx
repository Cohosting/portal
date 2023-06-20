import React, { useEffect, useContext, useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { PortalContext } from '../../context/portalContext';
import { db } from '../../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExtentionContentViewer } from './ExtentionContentViewer';
import { HiDotsHorizontal } from 'react-icons/hi';
import { AiOutlineEdit } from 'react-icons/ai';
import queryString from 'query-string';

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

const isConnected = (extention, memberId) => {
  if (extention.settings.setupType === 'automatic') return true;
  if (extention.settings.setupType === 'manual') {
    const clientSettings = extention.settings.clientsSettings.find(
      client => client.clientId === memberId
    );
    if (clientSettings) return true;
  }
  return false;
};

export const Extentions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [extention, setExtention] = useState(null);
  const [extentionId, setExtentionId] = useState(null);
  const [portalMembers, setPortalMembers] = useState([]);
  const [currentSelectedMember, setCurrentSelectedMember] = useState(null);
  const { portal } = useContext(PortalContext);
  const { isOpen, onToggle } = useDisclosure();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!portal) return;

    const getPortalMembers = async () => {
      const members = await getDocs(
        query(
          collection(db, 'portalMembers'),
          where('portalId', '==', portal.id)
        )
      );
      const data = members.docs.map(doc => doc.data());
      setPortalMembers(data);
      setCurrentSelectedMember(data[0].id);
    };
    getPortalMembers();

    return () => {};
  }, [portal]);

  useEffect(() => {
    if (!extentionId) return;
    setIsLoading(true);

    const getExtention = async () => {
      const extention = await getDoc(doc(db, 'apps', extentionId));
      setExtention(extention.data());
      setIsLoading(false);
    };
    getExtention();

    return () => {};
  }, [extentionId]);
  useEffect(() => {
    const id = queryString.parse(location.search).id;
    setExtentionId(id);
    return () => {};
  }, [location]);

  if (!extention) return <Layout>Loading...</Layout>;
  return (
    <Layout>
      <Flex h={'inherit'}>
        {isLoading ? (
          <Flex w={'100%'} justifyContent={'center'}>
            <Spinner my={'40px'} />
          </Flex>
        ) : (
          <>
            <Box width="400px">
              <Flex p={4} borderBottom={'1px solid gray'}>
                {extention.name}
              </Flex>

              <Box>
                {portalMembers.map(member => (
                  <MemberItem
                    isConnected={isConnected(extention, member.id)}
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
                    portalMembers.find(
                      member => member.id === currentSelectedMember
                    )?.name
                  }
                </Text>
                {(extention.settings.setupType === 'automatic' ||
                  isConnected(extention, currentSelectedMember)) && (
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
                          if (extention.settings.setupType === 'automatic') {
                            navigate(
                              `/module-management/setup?extentionId=${extentionId}`
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
              <ExtentionContentViewer
                isConnected={isConnected(extention, currentSelectedMember)}
                clientId={currentSelectedMember}
                extention={extention}
                isOpen={isOpen}
                onToggle={onToggle}
              />
            </Box>
          </>
        )}
      </Flex>
    </Layout>
  );
};
