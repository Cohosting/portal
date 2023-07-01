import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  InputGroup,
  InputRightElement,
  Progress,
} from '@chakra-ui/react';
import { Layout } from '../../Dashboard/Layout';
import { AuthContext } from '../../../context/authContext';
import { ActionButtons } from '../../../components/UI/ActionButtons';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { ProfilePicture } from './ProfilePicture';
import { auth, db, storage } from '../../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { signOut, updateEmail, updatePassword } from 'firebase/auth';
import { ReLogin } from './ReLogin';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export const AccountSettingsPage = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageObjectUrl, setImageObjectUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isPasswordVerificationModalOpen, setIsPasswordVerificationModalOpen] =
    useState(false);
  const [verificationError, setVerificationError] = useState('');
  const { user } = useContext(AuthContext);
  const [previousUserInfo, setPreviousUserInfo] = useState(null);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profileImageUrl: '',
  });
  const [hasChanges, setHasChanges] = useState(false);
  const navigate = useNavigate();
  const { firstName, lastName, email, profileImageUrl } = userInfo;

  const handlePasswordModalClose = () => {
    setIsPasswordModalOpen(false);
    setNewPassword('');
    setConfirmNewPassword('');
  };
  const handleChange = e => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = () => {
    setIsPasswordModalOpen(true);

    if (newPassword !== confirmNewPassword) {
      setVerificationError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setVerificationError('Password must be at least 6 characters.');
      return;
    }

    const user = auth.currentUser;
    updatePassword(user, newPassword)
      .then(() => {
        // Update successful.
        console.log('Password updated!');
        setIsPasswordModalOpen(false);
      })
      .catch(error => {
        setIsPasswordModalOpen(false);
        console.log(`Error updating password: ${error}`);
        if (error.code === 'auth/requires-recent-login') {
          setIsPasswordVerificationModalOpen(true);
        }
      });
  };

  const handleProfileUpdate = async () => {
    setIsUpdating(true);
    const ref = doc(db, 'users', user.uid);
  
    try {
      if (previousUserInfo.email !== userInfo.email) {
        await updateEmail(auth.currentUser, userInfo.email);
      }
  
      await updateDoc(ref, {
        email: userInfo.email,
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        profileImageUrl: userInfo.profileImageUrl || '',
      });
  
      setIsUpdating(false);
      console.log('Profile updated successfully!');
    } catch (error) {
      console.log(`Error updating profile: ${error}`);
  
      if (error.code === 'auth/requires-recent-login') {
        setIsPasswordVerificationModalOpen(true);
      }
  
      setIsUpdating(false);
    }
  };
  const handleLogout = () => {
    // Implement your logout logic here
    console.log('Logging out...');
    signOut(auth)
      .then(() => {
        console.log('Logged out successfully.');
        navigate('/login');
      })
      .catch(error => {
        console.log(`Error logging out: ${error}`);
      });
  };

  useEffect(() => {
    if (!user) return;

    let firstName = user?.name?.split(/\s+/)[0] || '';
    let lastName = user?.name?.split(/\s+/)[1] || '';
    let userInfo = {
      firstName,
      lastName,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
    };

    setUserInfo(userInfo);
    setPreviousUserInfo(userInfo);
  }, [user]);

  useEffect(() => {
    if (previousUserInfo !== null) {
      const dataChanged =
        JSON.stringify(userInfo) !== JSON.stringify(previousUserInfo);
      setHasChanges(dataChanged);
    }
  }, [userInfo, previousUserInfo]);

  const handleFileUpload = async (file) => {
    if (file) {
      try {
        const storageRef = ref(storage, file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        uploadTask.on('state_changed', (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        });
        await uploadTask;
  
        const url = await getDownloadURL(uploadTask.snapshot.ref);
  
        setUserInfo({
          ...userInfo,
          profileImageUrl: url,
        });
  
        setSelectedFile('');
        console.log('File uploaded successfully!');
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <Layout>
      <ActionButtons
        isLoading={isUpdating}
        onUpdate={handleProfileUpdate}
        shouldShow={hasChanges}
      />
      <Box p={4} maxW="md" mx="auto">
        <ProfilePicture
          profileImageUrl={selectedFile ? imageObjectUrl : profileImageUrl}
          firstName={firstName}
          lastName={lastName}
        />

        <input
          type="file"
          id="fileInput"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files[0];
            setSelectedFile(file);
            setImageObjectUrl(URL.createObjectURL(file));
            handleFileUpload(e.target.files[0]);
          }}
        />

        <FormControl id="firstName" mb={4}>
          <FormLabel>First Name</FormLabel>
          <Input
            name="firstName"
            value={firstName}
            onChange={handleChange}
            type="text"
            placeholder="Enter your first name"
          />
        </FormControl>

        <FormControl id="lastName" mb={4}>
          <FormLabel>Last Name</FormLabel>
          <Input
            name="lastName"
            value={lastName}
            onChange={handleChange}
            type="text"
            placeholder="Enter your last name"
          />
        </FormControl>

        <FormControl id="email" mb={8}>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            value={email}
            onChange={handleChange}
            type="email"
            placeholder="Enter your email"
          />
        </FormControl>

        <Text fontWeight="bold" mb={4}>
          Security
        </Text>
        <Text mb={8}>
          Configure authentication preferences and personal privacy settings.
        </Text>

        <Button
          variant="outline"
          colorScheme="blue"
          mb={8}
          onClick={() => setIsPasswordModalOpen(true)}
        >
          Change Password
        </Button>

        <Text fontWeight="bold" mb={4}>
          Log out
        </Text>
        <Text mb={8}>
          You will be logged out of this session and will have to log back in.
        </Text>

        <Button colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>

        <Modal isOpen={isPasswordModalOpen} onClose={handlePasswordModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Change Password</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl id="newPassword" mb={4}>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl id="confirmNewPassword" mb={4}>
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() =>
                        setShowConfirmNewPassword(!showConfirmNewPassword)
                      }
                    >
                      {showConfirmNewPassword ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              {verificationError && (
                <Text color="red.500" my={3}>
                  {verificationError}
                </Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                size={'sm'}
                variant={'ghost'}
                ml={4}
                onClick={handlePasswordModalClose}
              >
                Cancel
              </Button>
              <Button
                size={'sm'}
                bg={'black'}
                color={'white'}
                onClick={handlePasswordChange}
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <ReLogin
          isPasswordVerificationModalOpen={isPasswordVerificationModalOpen}
          handlePasswordVerificationModalClose={
            setIsPasswordVerificationModalOpen
          }
          callBack={handleProfileUpdate}
        />
      </Box>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Box
          position="fixed"
          bottom="20px"
          right="20px"
          backgroundColor="rgba(0, 0, 0, 0.7)"
          color="white"
          padding="10px"
          borderRadius="5px"
        >
          Uploading... {uploadProgress}%
          <Progress value={uploadProgress} size="sm" mt={2} />
        </Box>
      )}
    </Layout>
  );
};
