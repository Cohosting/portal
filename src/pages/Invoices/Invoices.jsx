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
import { ClientInvoiceItem } from '../Portal/Client/ClientInvoiceItem';
import { MdEdit, } from 'react-icons/md';
import { AddIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';


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
    const collecRef = collection(db, 'invoices');
    onOpen()
    const q = query(collecRef, where('portalId', '==', portal.id));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const invoices = querySnapshot.docs.map(doc => doc.data());
      setInvoices(invoices);
    });
    onClose()
    return () => {
      unsubscribe();
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
