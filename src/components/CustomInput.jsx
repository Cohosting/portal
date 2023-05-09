import { Box, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react'
import React from 'react'

export const CustomInput = ({
  isInvalid,
  label,
  value,
  name,
  handleChange,
  formLabel,
  ...otherProps
}) => {
  const inputStyle = {
    border: '1px solid #eee',
    _invalid: { borderColor: '#FC8181', boxShadow: 'none' },
  };
  return (
    <FormControl
     isInvalid={isInvalid()}
    display={'flex'}
    flexDirection="column"
    height="105px"
  >
    {
      formLabel ? formLabel  :  (
        <FormLabel  m="0" fontSize={'13px'}>
      {label}
    </FormLabel>
      )
    }
    
    <Input
      type="email"
      value={value}
      height={'3rem'}
      sx={{
         ...inputStyle,
        _hover: !isInvalid() && {
          border: '1px solid #eee',
        },
        _focus: !isInvalid() ?   {
              border: '1px solid rgb(33, 43, 54)',
              boxShadow: 'none',
            } : {
              border: '1px solid #FC8181',
              boxShadow: 'none',
            },
          
      }}
      onChange={e => {
        handleChange(e, name)
      }}
      {...otherProps}
    />
    {isInvalid() && (
      <FormErrorMessage alignSelf={'end'} fontSize={'13px'}>
        Email is required.
      </FormErrorMessage>
    )}
  </FormControl>
  )
}
