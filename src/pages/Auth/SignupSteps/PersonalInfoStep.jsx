import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react";
import CustomSelect from "../../../components/CustomSelect";
import { foundOn } from "../../../utils/constant";
import { boxStyle } from "../Signup";
import { CustomInput } from "../../../components/CustomInput";
import PortalURLInput from "../../../components/PortalURLInput";
import { useSelector, useDispatch } from "react-redux";
import { setPersonalInfoStep, setStep } from "../../../store/slices/authSlice";

const PersonalInfoStep = ({ isLargerThan450 }) => {
  const dispatch = useDispatch();
  const { personalInfoStep, portalURLValidation, step } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { value, name } = e.target;
    dispatch(setPersonalInfoStep({
      ...personalInfoStep,
      [name]: value,
    }));
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
          Finish creating your account
        </Text>
        <Text fontSize={'13px'}>
          First things first, tell us a bit about yourself
        </Text>
      </Box>
      <Flex sx={{ ...boxStyle, minWidth: isLargerThan450 ? '460px' : '100%' }}>
        <CustomInput
          name={'name'}
          value={personalInfoStep.name}
          type="text"
          errorMessage={'Full Name'}
          handleChange={handleChange}
          label={'Full Name'}
        />

        <CustomSelect
          name={'foundOn'}
          options={foundOn}
          value={personalInfoStep.foundOn}
          label={'How did you find us?'}
          handleChange={handleChange}
          errorMessage={'How you found'}
        />

        <Divider />

        <CustomInput
          name={'companyName'}
          value={personalInfoStep.companyName}
          type="text"
          errorMessage={'Company Name'}
          handleChange={handleChange}
          label={'Company Name'}
        />

        <PortalURLInput
          value={personalInfoStep.portalURL}
          handleChange={(url) => dispatch(setPersonalInfoStep({
            ...personalInfoStep,
            portalURL: url
          }))}
        />
        <Button
          width={'100%'}
          color={'#fff'}
          isDisabled={Object.values(personalInfoStep).includes('') || !portalURLValidation.isAvailable}
          marginTop={'2.3rem'}
          height={'3rem'}
          borderRadius={'4px'}
          sx={{}}
          background={'#212B36'}
          onClick={() => {
            if (!Object.values(personalInfoStep).includes('')) {
              dispatch(setStep(step + 1)); // Assuming step 2 is the next step
            }
          }}
          border={'1px solid #DFE1E4'}
          _hover={{ background: '#27333F' }}
          _disabled={{ background: '#fff', color: '#90959D' }}
        >
          Continue
        </Button>
      </Flex>
    </Flex>
  );
};

export default PersonalInfoStep;
