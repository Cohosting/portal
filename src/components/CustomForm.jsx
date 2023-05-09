import {
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Text,
  } from '@chakra-ui/react';
  import React, { useContext, useState } from 'react';
  import { FaCheckCircle } from 'react-icons/fa';
  import AuthProvider from '../context/signupContext';
  
  const inputStyle = {
    border: '1px solid #eee',
    _invalid: { borderColor: '#FC8181', boxShadow: 'none' },
  };
  
  const CustomForm = ({ value, type, errorMessage, handleChange, label, sx }) => {
    const [text, setText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
  
    const { userCredentials, setUserCredentials } = useContext(AuthProvider);
  
    const handleError = () => {
      let isError = true;
      if (value === 'email') {
        isError = text !== '' && text.includes('@') ? false : true;
        return isError;
      }
      isError = text === '' ? true : false;
      return isError;
    };
  
    return (
      <FormControl
        isInvalid={handleError(value)}
        display={'flex'}
        flexDirection="column"
        height="105px"
      >
        {value === 'portalURL' && (
          <>
            <FormLabel>
              Portal URL -{' '}
              <Text as="span" fontSize={'13px'} color="#6B6F76">
                You can connect a custom domain later
              </Text>
            </FormLabel>
            <Flex align="center">
              <Input
                type="text"
                height={'3rem'}
                width={'70%'}
                textAlign={'right'}
                placeholder=""
                id={value}
                sx={{
                  ...inputStyle,
                  _hover: !handleError() && {
                    border: '1px solid #eee',
                  },
                  _focus: !handleError()
                    ? {
                        border: '1px solid rgb(33, 43, 54)',
                        boxShadow: 'none',
                      }
                    : {
                        border: '1px solid #FC8181',
                        boxShadow: 'none',
                      },
                }}
                value={
                  isFocused
                    ? userCredentials.portalURL
                    : userCredentials.companyName
                }
                onFocus={e => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={e => {
                  handleError();
                  setIsFocused(true);
                  setText(e.target.value);
                  handleChange(e.target);
                  setUserCredentials({
                    ...userCredentials,
                    portalURL: e.target.value,
                  });
                }}
              />
              <Text as={'span'}>.copilot.app</Text>
              <Button isLoading={false}>
                <FaCheckCircle color="green" fontSize={'1.2rem'} />
              </Button>
            </Flex>
          </>
        )}
  
        {value !== 'portalURL' && (
          <>
            <FormLabel fontSize={'13px'}>{label}</FormLabel>
            <Input
              type={type}
              // value={value}
              id={value}
              height={'3rem'}
              sx={{
                ...inputStyle,
                _hover: !handleError(value) && {
                  border: '1px solid #eee',
                },
                _focus: !handleError(value)
                  ? {
                      border: '1px solid rgb(33, 43, 54)',
                      boxShadow: 'none',
                    }
                  : {
                      border: '1px solid #FC8181',
                      boxShadow: 'none',
                    },
              }}
              value={userCredentials[value]}
              onChange={e => {
                handleError();
                setText(e.target.value);
                setUserCredentials({
                  ...userCredentials,
                  [e.target.id]: e.target.value,
                });
  
                handleChange(e.target);
              }}
            />
          </>
        )}
  
        {handleError() && (
          <FormErrorMessage alignSelf={'end'} sx={{ ...sx }}>
            {errorMessage} is required.
          </FormErrorMessage>
        )}
      </FormControl>
    );
  };
  
  export default CustomForm;
  