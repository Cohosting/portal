import { Box, Flex, useMediaQuery } from '@chakra-ui/react';
import React from 'react';




export const AuthBox = ({children})  => {
    const [isLargerThan450] = useMediaQuery('(min-width: 450px)');

    const boxStyle = {
        flexDirection: 'column',
        boxShadow: '0px 0px 24px rgba(0, 0, 0, 0.07)',
        padding: '24px 28px 28px 40px',
        border: '1px solid #EFF1F4',
        minWidth: isLargerThan450 ? '460px' : '100%',
      };
    return (
        <Flex sx={{ ...boxStyle }}>
          {children}
        </Flex>
    )
}

export const Layout = ({ children}) => {
  
  return (
    <Flex justify={'center'} align={'center'} height={'100vh'}>
    <Box
      minW={'100%'}
      display={'flex'}
      alignItems={'center'}
      flexDirection={'column'}
    >
        {children}
  
     </Box>
</Flex>
  )
}
