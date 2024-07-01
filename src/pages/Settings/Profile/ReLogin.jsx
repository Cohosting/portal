import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { auth } from '../../../lib/firebase';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useSelector } from 'react-redux';

export const ReLogin = ({
  isPasswordVerificationModalOpen,
  handlePasswordVerificationModalClose,
  callBack,
}) => {
  const [passwordVerification, setPasswordVerification] = React.useState('');
  const [verificationError, setVerificationError] = React.useState('');
  const { user } = useSelector(state => state.auth);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const passwordValidate = async () => {
    const authUser = auth.currentUser;
    setIsSubmitting(true);
    const credential = EmailAuthProvider.credential(
      user.email,
      passwordVerification
    );

    reauthenticateWithCredential(authUser, credential)
      .then(() => {
        // User re-authenticated.
        handlePasswordVerificationModalClose(false);
        setPasswordVerification('');
        setVerificationError('');
        setIsSubmitting(false);
        callBack();
      })
      .catch(error => {
        console.log(`Error getting reauthenticated: ${error}`);
        setIsSubmitting(false);
        if (error.code === 'auth/wrong-password') {
          setVerificationError('Wrong password.');
          return;
        }

        if (error.code === 'auth/too-many-requests') {
          setVerificationError(
            'Too many requests. Please try again in a few minutes.'
          );
          return;
        }
        setVerificationError(error.message);
        // An error ocurred
        // ...
      });
  };

  return (
    <Modal
      isOpen={isPasswordVerificationModalOpen}
      onClose={() => {
        handlePasswordVerificationModalClose(false);
        setPasswordVerification('');
        setVerificationError('');
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Password Verification</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="passwordVerification" mb={4}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={passwordVerification}
              onChange={e => setPasswordVerification(e.target.value)}
            />
          </FormControl>
          {verificationError && (
            <Text color="red.500" mb={4}>
              {verificationError}
            </Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant={'ghost'}
            ml={4}
            onClick={() => handlePasswordVerificationModalClose(false)}
          >
            Cancel
          </Button>

          <Button
            isLoading={isSubmitting}
            bg={'black'}
            color={'white'}
            size={'sm'}
            onClick={passwordValidate}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
