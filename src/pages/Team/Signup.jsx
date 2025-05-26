import { Box, Button, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { InviteAuthWrapper } from './utils';
import { Input } from './../../components/internal/Input';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { getOrCreateUser } from '../../lib/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { isValidEmail } from '../../utils/validationUtils';

export const Signup = ({ portal, inviteData }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [signupCredentials, setSignupCredentials] = useState({
    email: '',
    password: '',
  });

  const handleSignup = async e => {
    e.preventDefault();

    const { email, password } = signupCredentials;

    if (email.trim() === '') {
      setError('Please enter an email.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    if (password.trim() === '') {
      setError('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userRef = doc(db, 'users', user.uid);
      const teamMemberDocRef = doc(db, 'teamMembers', inviteData.id);
      const seatsCollectionRef = collection(db, 'seats');

      const batch = writeBatch(db);
      let newObject = { ...signupCredentials };
      delete newObject.password;

      batch.set(userRef, {
        ...signupCredentials,
        isProfileCompleted: true,
        portals: [portal.id],
      });

      batch.update(teamMemberDocRef, {
        status: 'active',
        inviteExpired: true,
        uid: user.uid,
      });
  
      const seatId = inviteData.seatId;
      const seatRef = doc(seatsCollectionRef, seatId);
      batch.update(seatRef, {
        userId: user.uid,
      });

      await batch.commit();
      setIsLoading(false);
      navigate('/');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already in use.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email format.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        default:
          setError('An unknown error occurred. Please try again.');
      }
    }
  };

  const handleChange = e => {
    setSignupCredentials(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    setSignupCredentials(prevState => ({
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
            defaultValue={signupCredentials.email}
            onChange={handleChange}
          />
          <Input
            name="password"
            label={'Password'}
            type="password"
            placeholder="Password"
            value={signupCredentials.password}
            onChange={handleChange}
          />
        </VStack>

        {error && (
          <Box
            color="red.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="sm"
            mt={3}
          >
            {error}
          </Box>
        )}
        <Button
          isLoading={isLoading}
          bg={'black'}
          color={'white'}
          w={'100%'}
          onClick={handleSignup}
          mt={3}
        >
          Signup
        </Button>
      </InviteAuthWrapper>
    </Box>
  );
};
 