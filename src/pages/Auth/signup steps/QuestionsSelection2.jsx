import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useContext, useState } from "react";
import CustomSelect from "../../../components/CustomSelect";
import { clients, industries, sizes, types } from "../../../utils/config";
import { boxStyle } from "../Signup";
import {
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import AuthContextProvider from '../../../context/signupContext';
import { AuthContext } from '../../../context/authContext';
import { db } from '../../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { defaultAppList } from '../../../utils';
import { omit } from 'lodash';

export const QuestionsSelection2 = ({ isLargerThan450 }) => {
  const navigate = useNavigate();
  const { userCredentials } = useContext(AuthContextProvider);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { user } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    industry: 'Accounting and bookkeeping',
    companySize: 'Just me',
    clients: `I don't have any clients yet`,
    typeOfService: 'Companies',
  });

  const handleChange = e => {
    setCredentials({
      ...credentials,
      [e.id]: e.value,
    });
  };

  const persistOtherData = async () => {
    try {
      setIsLoading(true);

      // Initializations
      const batch = writeBatch(db);
      const ref = doc(db, 'users', user.uid);
      const portalRef = doc(collection(db, 'portals'));
      const memberRef = doc(collection(db, 'teamMembers'));

      // Portal Data Preparation
      const trialStartDate = new Date();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialStartDate.getDate() + 7);
      const portalData = {
        subscriptionType: 'freemium',
        others: omit(userCredentials, ['name', 'email', 'password']),
        portalURL: userCredentials.portalURL,
        createdBy: user.uid,
        settings: {
          achDebit: true,
          card: false,
          autoImport: false,
        },
        apps: defaultAppList,
        id: portalRef.id,
        trialStartDate,
        trialEndDate,
        isSubscribed: false,
        isExpiryCount: true,
      };
      batch.set(portalRef, portalData);

      // Team Member Data Preparation
      const [firstName, lastName] = userCredentials.name.split(' ');
      let memberObject = {
        firstName: firstName || '',
        lastName: lastName || '',
        email: userCredentials.email,
        uid: userCredentials.uid,
        status: 'active',
        role: 'owner',
        portalId: portalRef.id,
        id: memberRef.id,
        createdAt: new Date().toLocaleString(),
      };
      batch.set(memberRef, memberObject);

      // User Document Update
      batch.update(ref, {
        isProfileCompleted: true,
        portals: arrayUnion(portalRef.id),
        name: firstName + ' ' + lastName
      });

      // Creating 5 default seats
      for (let i = 0; i < 5; i++) {
        const seatRef = doc(collection(db, 'seats'));
        const seatData = {
          id: seatRef.id,
          portalId: portalRef.id,
          status: i === 0 ? 'occupied' : 'available', // first seat is 'occupied' by the owner, rest are 'available'
          userId: i === 0 ? userCredentials.uid : null, // first seat's userId is set to the owner's uid
          createdAt: serverTimestamp(),
          seatType: 'free',
        };
        batch.set(seatRef, seatData);
      }

      // Commit batch
      await batch.commit();

      navigate('/');
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  return (
    <Flex
      minW={'100%'}
      alignItems={'center'}
      flexDirection={'column'}
      justify={'center'}
      height={'100vh'}
    >
      <Box my="4rem" textAlign={'center'}>
        <Text fontSize={'24px'} mb=".5rem" fontWeight={'400'}>
          Tell us more about your company
        </Text>
        <Text fontSize={'13px'}>
          This information lets us custimize your experience
        </Text>
      </Box>
      <Flex sx={{ ...boxStyle, minWidth: isLargerThan450 ? '460px' : '100%' }}>
        <CustomSelect
          options={industries}
          value={'industry'}
          label={'Which industry are you in?'}
          errorMessage={'Industry'}
          handleChange={handleChange}
        />
        <CustomSelect
          options={sizes}
          value={'companySize'}
          label={'How large is your company?'}
          errorMessage={'Company size'}
          handleChange={handleChange}
        />
        <CustomSelect
          options={clients}
          value={'clients'}
          label={'How many clients do you have?'}
          errorMessage={'Clients count'}
          handleChange={handleChange}
        />
        <CustomSelect
          options={types}
          value={'typeOfService'}
          label={'Do you companies, individuals, or a mix of both?'}
          errorMessage={'Client type'}
          handleChange={handleChange}
        />
        {error && <Text color={'red'}>{error}</Text>}

        <Button
          isLoading={isLoading}
          width={'100%'}
          color={'#fff'}
          isDisabled={Object.values(credentials).includes('')}
          marginTop={'2.3rem'}
          height={'3rem'}
          borderRadius={'4px'}
          sx={{}}
          background={'#212B36'}
          onClick={() => {
            persistOtherData();
            // setStep(step + 1);
          }}
          border={'1px solid #DFE1E4'}
          _hover={{ background: '#27333F' }}
          _disabled={{ background: '#fff', color: '#90959D' }}
        >
          Launch Portal
        </Button>
      </Flex>
    </Flex>
  );
};