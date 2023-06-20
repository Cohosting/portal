import React, { useContext, useEffect, useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { AuthContext } from '../../context/authContext';
import { db } from '../../lib/firebase';
import { PortalContext } from '../../context/portalContext';

export const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const { user } = useContext(AuthContext);
  const { portal } = useContext(PortalContext);

  // fetch invoices from firebase invoices collection
  useEffect(() => {
    if (!portal) return;
    const collecRef = collection(db, 'invoices');

    const q = query(collecRef, where('portalId', '==', portal.id));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const invoices = querySnapshot.docs.map(doc => doc.data());
      setInvoices(invoices);
    });

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
      'http://localhost:9000/connect/create-connect-invoice',
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
        }),
      }
    );
    const data = await res.json();
    const ref = doc(db, 'invoices', invoice.id);

    await updateDoc(ref, {
      status: 'finalized',
    });
  };
  return (
    <Layout>
      <Box p={4}>
        {invoices.length > 0 ? (
          <Box>
            <Text my={3}>Invoices</Text>
            {invoices.map(invoice => (
              <Flex
                alignItems={'center'}
                justifyContent={'space-between'}
                border={'1px solid red'}
                p={2}
                my={2}
                borderRadius={'10px'}
              >
                <Box>
                  <Text>Name: {invoice.client.name}</Text>
                  <Text>Email: {invoice.client.email}</Text>
                  <Text>Status: {invoice.status}</Text>
                  <Text>Invoice number: {invoice.invoiceNumber}</Text>
                </Box>
                <Box>
                  {invoice.status === 'draft' && <Button>Edit</Button>}
                  {invoice.status === 'draft' &&
                    invoice.status !== 'finalized' && (
                      <Button
                        ml={2}
                        onClick={() => updateInvoiceStatusFirebase(invoice)}
                      >
                        Finalized
                      </Button>
                    )}
                </Box>
              </Flex>
            ))}
          </Box>
        ) : (
          <Button onClick={() => navigate('create')}>Create Invoice</Button>
        )}
        {invoices.length > 0 && (
          <Button mt={4} onClick={() => navigate('create')}>
            Create Invoice
          </Button>
        )}
      </Box>
    </Layout>
  );
};
