import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  Divider,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import {
  collection,
  deleteDoc,
  query,
  onSnapshot,
  doc,
  setDoc,
  where,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
  addDoc,
  runTransaction,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { db } from '../../lib/firebase';
import { Layout } from './../Dashboard/Layout';
import { AddIcon } from '@chakra-ui/icons';
import Table from '../Client/ClientTable';
import { PortalContext } from '../../context/portalContext';
import { sentTeamInviteEmail } from '../../lib/email';
import { AuthContext } from '../../context/authContext';
import { DeleteTeamMember } from './DeleteTeamMember';
import { TeamUsageLimit } from '../../components/UI/TeamUsageLimit';
import { useNavigate } from 'react-router-dom';

const checkIfEmailExists = async (email, portalId) => {
  const q = query(
    collection(db, 'teamMembers'),
    where('portalId', '==', portalId),
    where('email', '==', email)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.length > 0;
};

export const Team = () => {
  const { portal } = useContext(PortalContext);
  const [seats, setSeats] = useState([]);
  const [shouldLimitAddingTeamMembers, setShouldLimitAddingTeamMembers] =
    useState(false); // portalId is used in checkIfEmailExists function [line 130
  const { user } = useContext(AuthContext);
  const [teamMembers, setTeamMembers] = useState([]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteFormData, setInviteFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { firstName, lastName, email } = inviteFormData;
  const [loading, setLoading] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isErrorCreating, setIsErrorCreating] = useState(false);
  const [actionTeamMember, setActionTeamMember] = useState({});
  const [isMemberDeleting, setIsMemberDeleting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const columns = ['Name', 'Status', 'Creation date', 'Email', 'Actions'];
  let sortableColumns = [];

  const openInviteModal = () => {
    setInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setInviteModalOpen(false);
    setInviteFormData({
      firstName: '',
      lastName: '',
      email: '',
    });
    setIsErrorCreating(false);
    setError(null);
  };

  const handleInviteFormChange = e => {
    setInviteFormData(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleInviteFormSubmit = async e => {
    e.preventDefault();

    setIsInviting(true);

    try {
      const { firstName, lastName, email } = inviteFormData;

      const teamMembersCollectionRef = collection(db, 'teamMembers');
      const seatsCollectionRef = collection(db, 'seats');

      const teamMemberDocRef = doc(teamMembersCollectionRef);
      const token = uuidv4();

      // Check if email already exists
      const teamMemberSnapshot = await getDocs(
        query(teamMembersCollectionRef, where('email', '==', email))
      );

      if (!teamMemberSnapshot.empty) {
        throw new Error('Email already exists');
      }

      let seatDocRef;

      // Check if there is any available seat
      if (seats.length > 0) {
        seatDocRef = doc(seatsCollectionRef, seats[0].id); // Assign the first available seat
      } else {
        console.log('Tukiiiii:', 'Seat creation started');
        // Create a new seat
        const newSeatRef = doc(seatsCollectionRef);
        await setDoc(newSeatRef, {
          id: newSeatRef.id,
          status: 'available',
          userId: null,
          portalId: portal.id,
          seatType: 'paid',
          createdAt: serverTimestamp(),
        });
        seatDocRef = doc(db, `seats/${newSeatRef.id}`);
      }

      await runTransaction(db, async transaction => {
        // Check if seat is available
        const seatSnapshot = await transaction.get(seatDocRef);

        if (
          !seatSnapshot.exists() ||
          seatSnapshot.data().status !== 'available'
        ) {
          throw new Error('Seat is not available');
        }

        // Create new team member
        transaction.set(teamMemberDocRef, {
          firstName,
          lastName,
          email,
          status: 'pending',
          id: teamMemberDocRef.id,
          createdAt: new Date().toLocaleString(),
          portalId: portal.id,
          inviteToken: token,
          invitationCreated: serverTimestamp(),
          seatId: seatDocRef.id,
        });

        // Update the seat to occupied and assign to user
        transaction.update(seatDocRef, {
          status: 'occupied',
          teamMemberId: teamMemberDocRef.id,
        });
      });

      // sent email invite
      await sentTeamInviteEmail(email, firstName, portal.companyName, token); // token is used in TeamInvite.jsx [line 120]

      closeInviteModal();
    } catch (err) {
      if (err.message === 'Seat is not available') {
        console.log('seats taken');
      }
      setError(err.message);
    }

    setIsInviting(false);
  };
  const handleDeleteMember = async () => {
    try {
      setIsMemberDeleting(true);
      // Start a new batch
      const batch = writeBatch(db);

      // empty the seat after delete. fetch seats and find the seat with the user id
      const q = query(
        collection(db, 'seats'),
        where('portalId', '==', portal.id),
        where('id', '==', actionTeamMember.seatId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const seatId = querySnapshot.docs[0].id;
        const seatRef = doc(db, 'seats', seatId);
        // Add seat update to batch
        batch.update(seatRef, {
          teamMemberId: '',
          userId: '',
          status: 'available',
        });
      }

      const teamMemberRef = doc(db, 'teamMembers', actionTeamMember.id);
      // Add team member deletion to batch
      batch.delete(teamMemberRef);

      // Commit the batch
      await batch.commit();

      onClose();
      setIsMemberDeleting(false);
    } catch (err) {
      setIsMemberDeleting(false);
      setError(err.message);
      console.log(err);
    }
  };
  useEffect(() => {
    if (!portal) return;
    const unsubscribe = onSnapshot(
      query(collection(db, 'teamMembers'), where('portalId', '==', portal.id)),
      snapshot => {
        const members = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        let data = [];
        members.forEach(el => {
          data.push({
            Name: (
              <Flex alignItems={'center'}>
                <Flex
                  alignItems={'center'}
                  justifyContent={'center'}
                  w={'30px'}
                  h={'30px'}
                  bg={'#7cae7a'}
                  color={'white'}
                  borderRadius={'4px'}
                >
                  {' '}
                  {el.firstName[0]}
                </Flex>
                <Box ml={3}>
                  <Text>{el.firstName}</Text>
                  <Text fontSize={'12px'}>{el.email}</Text>
                </Box>
              </Flex>
            ),
            Email: el.email,
            Status: el.status,
            ['Creation date']: el.createdAt,
            Actions: (
              <>
                {el.role === 'owner' || el.email === user.email ? (
                  ''
                ) : (
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => {
                      onOpen();
                      setActionTeamMember(el);
                    }}
                  >
                    Delete
                  </Button>
                )}
              </>
            ),
          });
        });

        setTeamMembers(data);
      },
      err => {
        setError(err.message);
      }
    );

    return () => unsubscribe();
  }, [portal]);

  useEffect(() => {
    if (!portal) return;

    const seatsCollectionRef = collection(db, 'seats');
    const q = query(
      seatsCollectionRef,
      where('status', '==', 'available'),
      where('portalId', '==', portal.id)
    );

    const unsubscribe = onSnapshot(q, querySnapshot => {
      const seatsData = querySnapshot.docs.map(doc => doc.data());
      console.log({
        available: seatsData,
      });
      setSeats(seatsData);
    });

    return () => unsubscribe();
  }, [portal]);
  useEffect(() => {
    if (!portal) return;
    const fetchSeats = async () => {
      const seatsCollectionRef = collection(db, 'seats');
      const q = query(
        seatsCollectionRef,
        where('status', '==', 'occupied'),
        where('portalId', '==', portal.id)
      );
      const querySnapshot = await getDocs(q);
      const seatsData = querySnapshot.docs.map(doc => doc.data());
      console.log(seatsData);
    };

    fetchSeats();
  }, [portal]);
  return (
    <Layout>
      {portal?.subscriptionType === 'freemium' ? (
        <Box p={3}>
          <Text>No team for free plan</Text>
          <Text my={2}>
            Please subscribed to upper plan for this functioanlity
          </Text>
          <Button onClick={() => navigate('/subscription')}>Upgrade</Button>
        </Box>
      ) : (
        <Box>
          <Flex
            p={'10px 10px'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Text fontSize={'13px'}> Team</Text>
            {!shouldLimitAddingTeamMembers && (
              <Button
                fontSize={'13px'}
                leftIcon={<AddIcon />}
                bg={'black'}
                color={'white'}
                size={'sm'}
                onClick={openInviteModal}
              >
                Invite Member
              </Button>
            )}
          </Flex>

          <TeamUsageLimit
            portal={portal}
            teamMembers={teamMembers}
            setShouldLimitAddingTeamMembers={setShouldLimitAddingTeamMembers}
          />

          <Divider />

          {loading ? (
            <Spinner size="lg" />
          ) : (
            <Box p={'15px'}>
              {error && (
                <Alert status="error" mb={4}>
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              <Table
                columns={columns}
                data={teamMembers}
                sortableColumns={sortableColumns}
              />
            </Box>
          )}

          <Modal isOpen={inviteModalOpen} onClose={closeInviteModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Invite Team Member</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={handleInviteFormSubmit}>
                  <Stack spacing={2}>
                    <Stack direction="row">
                      <Box flex={1} mr={2}>
                        <Text mb={2} fontSize={'15px'}>
                          First Name
                        </Text>
                        <Input
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          value={inviteFormData.firstName}
                          onChange={handleInviteFormChange}
                          required
                        />
                      </Box>
                      <Box flex={1} ml={2}>
                        <Text mb={2} fontSize={'15px'}>
                          Last Name
                        </Text>

                        <Input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          value={inviteFormData.lastName}
                          onChange={handleInviteFormChange}
                          required
                        />
                      </Box>
                    </Stack>
                    <Box>
                      <Text mb={2} fontSize={'15px'}>
                        Email
                      </Text>

                      <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={inviteFormData.email}
                        onChange={handleInviteFormChange}
                        required
                      />

                      {isErrorCreating && (
                        <Text mt={3} fontSize={'14px'} color={'red.300'}>
                          {isErrorCreating}
                        </Text>
                      )}
                    </Box>
                  </Stack>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button
                  isDisabled={
                    firstName === '' || lastName === '' || email === ''
                  }
                  isLoading={isInviting}
                  bg={'black'}
                  color={'white'}
                  _hover={{ bg: '#585858' }}
                  mr={3}
                  onClick={handleInviteFormSubmit}
                >
                  Invite
                </Button>
                <Button onClick={closeInviteModal}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <DeleteTeamMember
            isMemberDeleting={isMemberDeleting}
            isOpen={isOpen}
            onClose={onClose}
            handleDelete={handleDeleteMember}
            teamMemberName={actionTeamMember.firstName}
          />
        </Box>
      )}
    </Layout>
  );
};
