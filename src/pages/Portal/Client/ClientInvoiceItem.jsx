import React from 'react';
import { Box, Heading, Text, Button, Flex, Tag, StatNumber, StatHelpText, Stat, StatLabel } from '@chakra-ui/react';
import { formattedMonthTime } from '../../../utils';
import { MdEdit } from "react-icons/md";

const isPendingOrPaid = (value) => {
  console.log(value)
  let newVal = value.toLowerCase()
  if(newVal === 'finalized') {
    return {
      bg: '#fff9f5',
      color: '#a56237'

    }
  } else if(newVal === 'paid') {
    return {
      bg: '#f1fef4',
      color: '#648c71'
    }


  }
}

export const ClientInvoiceItem = ({ invoice, handleRedirectPayment, children, status }) => {

  const total = invoice.lineItems.reduce((acc, item) => {
    const itemTotal = (item.unit_amount) * Number(item.quantity);
    return acc + itemTotal;
  }, 0);
  
  return (
    <>
    <Box my={2}  p={4} borderBottom={'1px solid'} borderColor={'gray.300'}>
        <Text>{invoice.memo}</Text>
    {invoice.lineItems.map(item => (

        <Flex  my={2} pr={'12px'} fontFamily={'monospace'} alignItems={'center'} justifyContent={'space-between'} >
          <Text>
          {item.description && item.description + ' ' + `(${item.unit_amount}$ x ${item.quantity})`}
          </Text>
        <Text fontSize={'15px'} fontWeight={400} >${(item.unit_amount) * Number(item.quantity)}</Text>
        </Flex>
      ))}

    <Flex alignItems={'center'} justifyContent={'space-between'} >
   
   <Box>
       <Text color={'purple'} >Invoice no.</Text>
       <Text>{invoice.invoiceNumber}</Text>
   </Box>
   <Box>
       <Text>
              <Tag sx={isPendingOrPaid(invoice.status)} fontSize={'12px'} textAlign={'center'} size={'md'}>{invoice.status === 'finalized' ? 'pending' : invoice.status === 'paid' ? 'paid' : 'draft'}</Tag>
       </Text>
   </Box>

   <Box>
   <Stat justifyContent={'flex-end'} fontFamily={'monospace'} size={'sm'}>
    <StatLabel> <strong>
    Total
      </strong> </StatLabel>
<StatNumber>${total}</StatNumber>
<StatHelpText>{formattedMonthTime(invoice.createdOn)}</StatHelpText>
</Stat>
   </Box>
 </Flex>
        {children}
      </Box>

    </>

  );
};
