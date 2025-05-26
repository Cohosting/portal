import { Box, Button, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { InviteAuthWrapper } from './utils';
import { Input } from '../../components/internal/Input';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { isValidEmail } from '../../utils/validationUtils';

export const Login = ({ inviteData, portal }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => {
    setLoginCredentials(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    const { email, password } = loginCredentials;

    // Validate email and password
    if (email.trim() === '' || password === '') {
      setError('Please enter your email and password.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const batch = writeBatch(db); // Initialize the batch
      const seatsCollectionRef = collection(db, 'seats');

      const userDocRef = doc(db, 'users', user.uid);
      batch.update(userDocRef, {
        portals: arrayUnion(portal.id),
      });

      const teamMemberDocRef = doc(db, 'teamMembers', inviteData.id);
      batch.update(teamMemberDocRef, {
        uid: user.uid,
        status: 'active',
        inviteExpired: true,
      });
      const seatId = inviteData.seatId;
      const seatRef = doc(seatsCollectionRef, seatId);
      batch.update(seatRef, {
        userId: user.uid,
      });
      // Commit the batch
      await batch.commit();

      setIsLoading(false);
      navigate('/');
    } catch (err) {
      console.log(`Error logging in: ${err}`);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already in use.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email format.');
          break;
        case 'auth/user-not-found':
          setError('Wrong email or password');
          break;
        default:
          setError('An unknown error occurred. Please try again.');
      }

      setIsLoading(false);
    }
  };

  useEffect(() => {
    setLoginCredentials(prevState => ({
      ...prevState,
      email: inviteData?.email,
    }));
  }, []);

  return (
    <Box>
      <InviteAuthWrapper>
        <VStack>
          <Input
            isReadOnly={true}
            name="email"
            label={'Email'}
            type="email"
            placeholder="Email"
            defaultValue={loginCredentials.email}
            onChange={handleChange}
          />
          <Input
            name="password"
            label={'Password'}
            type="password"
            placeholder="Password"
            value={loginCredentials.password}
            onChange={handleChange}
          />
        </VStack>
        {error && (
          <Box color={'red.500'} fontWeight={'bold'} mt={3}>
            {error}
          </Box>
        )}
        <Button
          isLoading={isLoading}
          bg={'black'}
          color={'white'}
          w={'100%'}
          onClick={handleLogin}
          mt={3}
        >
          Login
        </Button>
      </InviteAuthWrapper>
    </Box>
  );
};
