import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
} from '@chakra-ui/react';
import React from 'react';

const inputStyle = {
  border: '1px solid #eee',
  _invalid: { borderColor: '#FC8181', boxShadow: 'none' },
};

export const Input = ({ value, errorMessage, label, sx, ...props }) => {
  return (
    <FormControl isInvalid={props.isInvalid}>
      <FormLabel fontSize={'13px'}>{label}</FormLabel>
      <ChakraInput
        isReadOnly={props.isReadOnly}
        {...props}
        height={'3rem'}
        sx={{
          ...inputStyle,
          _hover: !props.isInvalid && {
            border: '1px solid #eee',
          },
          _focus: !props.isInvalid
            ? {
                border: '1px solid rgb(33, 43, 54)',
                boxShadow: 'none',
              }
            : {
                border: '1px solid #FC8181',
                boxShadow: 'none',
              },
          ...sx,
        }}
      />
      {props.isInvalid && (
        <FormErrorMessage alignSelf={'end'} sx={{ ...sx }}>
          {errorMessage} is required.
        </FormErrorMessage>
      )}
    </FormControl>
  );
};
