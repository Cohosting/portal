import {
  Box,
  Heading,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { useContext, useEffect, useState } from 'react';
import { Signup } from './Signup';
import { Login } from './Login';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import queryString from 'query-string';

export const AcceptInvitationPage = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [mode, setMode] = useState(null);
  const [inviteData, setInviteData] = useState();
  const [portal, setPortal] = useState(null);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const token = queryString.parse(location.search).token;
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    const checkInvitationToken = async () => {
      try {
        // Check if the invitation token exists in Firestore
        const q = query(
          collection(db, 'teamMembers'),
          where('inviteToken', '==', token)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          // Invitation token does not exist or is invalid
          console.log('Invalid invitation token.');
          // Redirect the user to an error page or display an error message
          return;
        }

        setInviteData(querySnapshot.docs[0].data());

        // Invitation token exists, validate expiration
        const teamMemberData = querySnapshot.docs[0].data();
        const invitationCreated = teamMemberData.invitationCreated.toDate();
        const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const currentTime = new Date();

        if (currentTime - invitationCreated > expirationTime) {
          // Invitation token has expired
          setError('Invitation token has expired.');
          // Redirect the user to an error page or display an error message
          return;
        }

        // Invitation token is valid, proceed with accepting the invitation
        console.log('Valid invitation token.');
        // Perform any necessary operations, such as setting the user's role or marking the invitation as accepted
        // You can access the team member's data using teamMemberData
      } catch (error) {
        console.error('Error checking invitation token:', error);
        // Redirect the user to an error page or display an error message
      }
    };

    checkInvitationToken();
  }, [token, location]);

  useEffect(() => {
    if (!inviteData) return;

    const getPortal = async () => {
      const ref = doc(db, 'portals', inviteData.portalId);
      const snapshot = await getDoc(ref);
      setPortal(snapshot.data());
    };

    getPortal();
  }, [inviteData]);

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'login' ? 'signup' : 'login'));
  };
  const handleToggle = mode => {
    setMode(mode);
    onToggle();
  };

  const handleAcceptInvitation = async () => {
    try {
      // Check if the invitation token exists in Firestore
      const q = query(
        collection(db, 'teamMembers'),
        where('inviteToken', '==', token)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Invitation token does not exist or is invalid
        console.log('Invalid invitation token.');
        // Redirect the user to an error page or display an error message
        return;
      }

      // Invitation token exists, validate expiration
      const teamMemberData = querySnapshot.docs[0].data();

      if (teamMemberData.inviteExpired) {
        setError('Invitation token has expired.');
        return;
      }
      const invitationCreated = teamMemberData.invitationCreated.toDate();
      const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const currentTime = new Date();

      if (currentTime - invitationCreated > expirationTime) {
        // Invitation token has expired
        setError('Invitation token has expired.');
        // Redirect the user to an error page or display an error message
        return;
      }

      // Invitation token is valid, proceed with accepting the invitation
      console.log('Valid invitation token.');
      // also need to save the user for portal reference
      await updateDoc(doc(db, 'users', user.uid), {
        portals: arrayUnion(inviteData.portalId),
      });

      await updateDoc(doc(db, 'teamMembers', inviteData.id), {
        status: 'active',
        inviteExpired: true,
      });
    } catch (err) {
      console.log(err);
    }
  };
  if (!inviteData || !portal)
    return (
      <Flex alignItems={'center'} justifyContent={'center'} p={'50px'}>
        <Spinner />
      </Flex>
    );
  return (
    <Box>
      <Box maxW="400px" mx="auto" mt="10">
        <Heading textAlign="center" mb="6">
          Accept Team Invitation
        </Heading>
        <Box bg="white" p="6" boxShadow="md" borderRadius="md">
          <Text mb="4">
            You have been invited to join{' '}
            <strong>{portal?.others?.companyName}</strong> . Please log in to
            your existing account or sign up to proceed.
          </Text>

          {error && <Text>{error}</Text>}

          {user && user.email === inviteData.email ? (
            <Button>Accept Invitation</Button>
          ) : (
            <Box>
              <Button size="sm" onClick={() => handleToggle('login')}>
                Log In
              </Button>
              <Button ml={3} size="sm" onClick={() => handleToggle('signup')}>
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <Modal size={'2xl'} isOpen={isOpen} onClose={() => handleToggle(null)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{mode === 'login' ? 'Login' : 'Signup'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {mode === 'login' ? (
              <Login portal={portal} inviteData={inviteData} />
            ) : (
              <Signup portal={portal} inviteData={inviteData} />
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={toggleMode} variant={'ghost'}>
              {mode === 'login' ? 'Switch to Signup' : 'Switch to Login'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
