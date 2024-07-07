import React, { useContext, useEffect, useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import { Box, Button, Flex, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ClientInvoiceItem } from '../Portal/Client/InvoiceItem';
import { MdEdit, } from 'react-icons/md';
import { AddIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { supabase } from '../../lib/supabase';


const InvoiceItem  = ({invoice, updateInvoiceStatusFirebase}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate()
  return (
    <ClientInvoiceItem invoice={invoice} >
      <Flex alignItems={'center'} >
        {
          invoice.status === 'draft' && (
            <Button isLoading={isOpen} w={'150px'} size={'sm'} colorScheme="blue" onClick={async () => {
              onOpen()
              await updateInvoiceStatusFirebase(invoice);
              onClose()
            }}>
            Finalized
          </Button>
          )
        }

        {
          invoice.status !== 'finalized' && invoice.status !== 'paid' && (
            <Button onClick={() => navigate(`/billing/edit?id=${invoice.id}`)} ml={3} leftIcon={<MdEdit />
            } >edit</Button>

          )
        }

      </Flex>
    </ClientInvoiceItem>
  )
}

export const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const { user } = useSelector(state => state.auth)
  const { data: portal } = usePortalData(user?.portals)
  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: true
  })

  // fetch invoices from firebase invoices collection
  useEffect(() => {
    if (!portal) return;

    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('portal_id', portal.id);

      if (error) {
        console.error('Error fetching invoices:', error);
      } else {
        setInvoices(data);
      }
    };

    fetchInvoices();

    // Optionally, you can use Supabase's real-time functionality to subscribe to changes in the 'invoices' table.
    const subscription = supabase
      .channel(`invoices:portal_id=eq.${portal.id}`)
      .on('*', payload => {
        fetchInvoices(); // Re-fetch invoices whenever there's a change
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [portal]);

  const updateInvoiceStatusFirebase = async invoice => {
    let paymentMethodArray = [];
    if (invoice.settings.achDebit) {
      paymentMethodArray.push('us_bank_account');
    }
    if (invoice.settings.card) {
      paymentMethodArray.push('card');
    }
    const res = await fetch(
      `${process.env.REACT_APP_NODE_URL}/connect/create-connect-invoice`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: invoice.client.customerId,
          stripeConnectAccountId: portal.stripeConnectAccountId,
          line_items: invoice.lineItems,
          payment_settings: {
            payment_method_types: paymentMethodArray,
          },
          invoiceId: invoice.id,
          isFromApp: 'true',
          memo: invoice.memo
        }),
      }
    );
    await res.json();
    const ref = doc(db, 'invoices', invoice.id);

    await updateDoc(ref, {
      status: 'finalized',
    });
  };


  console.log(invoices)
  return (
    <Layout>


      <Box p={4}>

        <Box>
          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Text my={3}>Invoices</Text>

            {invoices.length > 0 && (
              <Button mt={4} onClick={() => navigate('create')}>
                Create Invoice
              </Button>
            )}
          </Flex>

          {!invoices.length && (
            <Flex flexDir={'column'} alignItems={'center'} justifyContent={'center'} >
              <Text> You dont have any invoices. </Text>
              <Button onClick={() => navigate('create')} my={3} >
                <Text >Create one</Text>
                <AddIcon />
              </Button>
            </Flex>
          )}
          {invoices.map(invoice => (

            <InvoiceItem updateInvoiceStatusFirebase={updateInvoiceStatusFirebase} invoice={invoice} />


          ))}
        </Box>


      </Box>




    </Layout>
  );
};
