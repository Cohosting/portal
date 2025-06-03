import { Flex } from '@chakra-ui/react';
export const boxStyle = {
  flexDirection: 'column',
  boxShadow: '0px 0px 24px rgba(0, 0, 0, 0.07)',
  padding: '24px 28px 28px 40px',
  border: '1px solid #EFF1F4',
};

export const InviteAuthWrapper = ({ children }) => {
  return <Flex sx={{ ...boxStyle, w: '100%' }}>{children}</Flex>;
};
