import { useContext, useState } from "react";
import AuthProvider from "../../../context/signupContext";
import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react";
import CustomForm from "../../../components/CustomForm";
import CustomSelect from "../../../components/CustomSelect";
import { foundOn } from "../../../utils/config";
import { boxStyle } from "../Signup";

export const QuestionsSelection1 = ({ isLargerThan450 }) => {
    const [credentials, setCredentials] = useState({
      name: '',
      foundOn: '',
      companyName: '',
      portalURL: '',
    });
    const { step, setStep } = useContext(AuthProvider);
  
    const handleChange = e => {
      setCredentials({
        ...credentials,
        [e.id]: e.value,
      });
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
          <CustomForm
            value={'name'}
            type="text"
            errorMessage={'Full Name'}
            handleChange={handleChange}
            label={'Full Name'}
          />
  
          <CustomSelect
            options={foundOn}
            value={'foundOn'}
            label={'How did you find us?'}
            handleChange={handleChange}
            errorMessage={'How you found'}
          />
  
          <Divider />
  
          <CustomForm
            value={'companyName'}
            type="text"
            errorMessage={'Company Name'}
            handleChange={handleChange}
            label={'Company Name'}
          />
  
          <CustomForm
            value={'portalURL'}
            type="text"
            errorMessage={'Portal URL'}
            handleChange={handleChange}
            label={'Portal URL'}
            sx={{ alignSelf: 'center' }}
          />
  
          <Button
            width={'100%'}
            color={'#fff'}
            isDisabled={Object.values(credentials).includes('')}
            marginTop={'2.3rem'}
            height={'3rem'}
            borderRadius={'4px'}
            sx={{}}
            background={'#212B36'}
            onClick={() => {
              !Object.values(credentials).includes('') && setStep(step + 1);
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