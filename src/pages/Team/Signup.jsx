import { Box, Button, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { InviteAuthWrapper } from './utils';
import { Input } from './../../components/UI/Input';
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

/* 

const handleSignup = async e => {
    e.preventDefault();
    if (signupCredentials.email !== '' && signupCredentials.password !== '') {
      setIsLoading(true);
      setError('');

      try {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          signupCredentials.email,
          signupCredentials.password
        );

        // Add a random delay between 500-2000 ms before executing the operation.
        const delay = Math.random() * (2000 - 500) + 500; // Delay in milliseconds

        setTimeout(async () => {
          const batch = writeBatch(db);

          const userRef = doc(db, 'users', user.uid);

          batch.set(userRef, {
            ...signupCredentials,
            isProfileCompleted: true,
            uid: user.uid,
            portals: [portal.id],
          });

          // Update the status of the invitation to accepted
          const teamMemberDocRef = doc(db, 'teamMembers', inviteData.id);
          batch.update(teamMemberDocRef, {
            status: 'active',
            inviteExpired: true,
            uid: user.uid,
          });
          // Try to find available seats (free or paid) for the specific portal
          const seatQuery = query(
            collection(db, 'seats'),
            where('status', '==', 'available'),
            where('portalId', '==', portal.id)
          );
          const seatSnapshot = await getDocs(seatQuery);
          const availableSeats = seatSnapshot.docs.map(doc => doc.data());

          if (availableSeats.length === 0) {
            // If no seats are available at all, create a new paid seat
            const seatRef = doc(collection(db, 'seats'));
            batch.set(seatRef, {
              portalId: portal.id,
              userId: user.uid,
              status: 'occupied',
              seatType: 'paid',
              createdAt: serverTimestamp(),
              id: seatRef.id,
            });
          } else {
            // Randomize the order of available seats
            const randomizedSeats = shuffleArray(availableSeats);

            const selectedSeat = randomizedSeats[0];
            console.log({
              selectedSeat,
              delay,
            });
            // Update the selected seat to occupied
            const seatRef = doc(db, 'seats', selectedSeat.id);
            batch.update(seatRef, {
              portalId: portal.id,
              userId: user.uid,
              status: 'occupied',
            });
          }
          // Here you check if you should start or update a subscription
          const portalRef = doc(db, 'portals', portal.id);
          const portalSnapshot = await getDoc(portalRef);
          const portalData = portalSnapshot.data();

          // Assuming 'addOnSubscription' field exists in the portal document
          if (portalData.addOnSubscription) {
            // if there's already a subscription, you should update it
            // you may call your Stripe API here, make sure you handle errors properly
          } else {
            // if there's no subscription yet, you should start it
            // you may call your Stripe API here, make sure you handle errors properly
          }

          await batch.commit();

          setIsLoading(false);
      
        }, delay);
      } catch (err) {
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
    }
  };
*/
