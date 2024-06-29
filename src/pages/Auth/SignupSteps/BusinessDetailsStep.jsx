import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useContext, useState } from "react";
import CustomSelect from "../../../components/CustomSelect";
import { clients, industries, sizes, types } from "../../../utils/constant";
import { boxStyle } from "../Signup";
import { AuthContext } from '../../../context/authContext';
import { useNavigate } from 'react-router-dom';
import useSignupContext from "../../../context/SignupContext";
import { initializeOrganizationSetup } from "../../../utils/signupUtils";

const BusinessDetailsStep = ({ isLargerThan450 }) => {
  const navigate = useNavigate();
  const { personalInfoStep, businessDetailsStep } = useSignupContext()
  const { user } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
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

  const setupOrganizationAndNavigate = async () => {
    try {
      setIsLoading(true);
      await initializeOrganizationSetup(user, personalInfoStep, businessDetailsStep);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
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
          name={'industry'}
          options={industries}
          value={'industry'}
          label={'Which industry are you in?'}
          errorMessage={'Industry'}
          handleChange={handleChange}
        />
        <CustomSelect
          name={'companySize'}
          options={sizes}
          value={'companySize'}
          label={'How large is your company?'}
          errorMessage={'Company size'}
          handleChange={handleChange}
        />
        <CustomSelect
          options={clients}
          name={'clients'}
          value={'clients'}
          label={'How many clients do you have?'}
          errorMessage={'Clients count'}
          handleChange={handleChange}
        />
        <CustomSelect
          options={types}
          value={'typeOfService'}
          name={'typeOfService'}
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
            setupOrganizationAndNavigate();
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

export default BusinessDetailsStep;