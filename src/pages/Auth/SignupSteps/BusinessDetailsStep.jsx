import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomSelect from "../../../components/CustomSelect";
import { clients, industries, sizes, types } from "../../../utils/constant";
import { boxStyle } from "../Signup";
import { useNavigate } from 'react-router-dom';
import { setBusinessDetailsStep } from "../../../store/slices/authSlice";
import { initializeOrganizationSetup } from "../../../utils/signupUtils";

const BusinessDetailsStep = ({ isLargerThan450 }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { personalInfoStep, businessDetailsStep, user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    dispatch(setBusinessDetailsStep({
      ...businessDetailsStep,
      [e.target.name]: e.target.value,
    }));
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
          This information lets us customize your experience
        </Text>
      </Box>
      <Flex sx={{ ...boxStyle, minWidth: isLargerThan450 ? '460px' : '100%' }}>
        <CustomSelect
          name={'industry'}
          options={industries}
          value={businessDetailsStep.industry}
          label={'Which industry are you in?'}
          errorMessage={'Industry'}
          handleChange={handleChange}
        />
        <CustomSelect
          name={'companySize'}
          options={sizes}
          value={businessDetailsStep.companySize}
          label={'How large is your company?'}
          errorMessage={'Company size'}
          handleChange={handleChange}
        />
        <CustomSelect
          options={clients}
          name={'clients'}
          value={businessDetailsStep.clients}
          label={'How many clients do you have?'}
          errorMessage={'Clients count'}
          handleChange={handleChange}
        />
        <CustomSelect
          options={types}
          name={'typeOfService'}
          value={businessDetailsStep.typeOfService}
          label={'Do you serve companies, individuals, or a mix of both?'}
          errorMessage={'Client type'}
          handleChange={handleChange}
        />
        {error && <Text color={'red'}>{error}</Text>}

        <Button
          isLoading={isLoading}
          width={'100%'}
          color={'#fff'}
          isDisabled={Object.values(businessDetailsStep).includes('')}
          marginTop={'2.3rem'}
          height={'3rem'}
          borderRadius={'4px'}
          background={'#212B36'}
          onClick={setupOrganizationAndNavigate}
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
