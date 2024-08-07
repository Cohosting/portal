import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Select,
  } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
  
  const CustomSelect = ({
    name,
    value,
    options,
    label,
    errorMessage,
    handleChange,
  }) => {

    const [text, setText] = useState('');
  
    const handleError = () => {
      if (!text) return false
      let isError = true;
      isError = text === '' ? true : false;
      return isError;
    };
  
    return (
      <FormControl
        isInvalid={handleError(value)}
        display={'flex'}
        flexDirection="column"
        height="105px"
        fontSize={'13px'}
      >
        <FormLabel fontSize={'14px'}>{label}</FormLabel>
        <Select
          name={name}
          background={'white'}
          placeholder=""
          sx={{
            border: '1px solid #eee',
            _invalid: { borderColor: '#FC8181', boxShadow: 'none' },
          }}
          id={value}
          onChange={e => {
            setText(e.target.value);
            handleChange(e);

          }}
        >
          {options.map(value => (
            <option style={{ color: 'black', background: 'white' }} value={value}>
              {value}
            </option>
          ))}
        </Select>
        {handleError(value) && (
          <FormErrorMessage alignSelf={'end'}>
            {errorMessage} is required
          </FormErrorMessage>
        )}
      </FormControl>
    );
  };
  
  export default CustomSelect;
  