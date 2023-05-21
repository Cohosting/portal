import React, { useContext, useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import { useEffect } from 'react';
import { SearchDropdown } from '../../components/UI/searchDropdown';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AuthContext } from './../../context/authContext';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Spinner,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { ItemsComponent } from '../../components/UI/Items';
import { UploadAttachmentComponent } from '../../components/UI/uploadAttachment';
import { useNavigate } from 'react-router-dom';
import { generateInvoiceNumber } from '../../utils';
import { PortalContext } from '../../context/portalContext';

export const InvoiceForm = () => {
  const [clients, setClients] = useState([]);
  const { user } = useContext(AuthContext);
  const { portal } = useContext(PortalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [lineItems, setLineItems] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [settings, setSettings] = useState({});

  const [stripeUser, setStripeUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) return;
    const collecRef = collection(db, 'portalMembers');
    const q = query(collecRef, where('portalURL', '==', user.portalURL));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const clients = querySnapshot.docs.map(doc => doc.data());
      setClients(clients);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const handleSelectUser = user => {
    setStripeUser(user);
  };

  const handleCreateInvoice = async () => {
    if (!stripeUser.customerId) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:9000/create-connect-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stripeConnectAccountId: user.stripeConnectAccountId,
          line_items: lineItems,
          customerId: stripeUser.customerId,
        }),
      });
      const data = await res.json();
      console.log({
        data,
      });
      setIsLoading(false);
    } catch (err) {
      console.log(`Error creating invoice: ${err}`);
      setIsLoading(false);
    }
  };

  const saveFiretoreInvoice = async () => {
    try {
      setIsLoading(true);
      const ref = doc(collection(db, 'invoices'));
      await setDoc(ref, {
        portalURL: user.portalURL,
        lineItems,
        memo: '',
        attachments: attachments,
        status: 'draft',
        createdBy: user.uid,
        createdOn: new Date(),
        client: stripeUser,
        id: ref.id,
        invoiceNumber: generateInvoiceNumber(),
        settings,
      });
      setIsLoading(false);

      setTimeout(() => {
        navigate('/invoices');
      }, 900);
    } catch (err) {
      console.log(`Error creating invoice: ${err}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!portal) return;
    setSettings(portal.settings);
  }, [portal]);

  console.log({
    stripeUser,
  });
  return (
    <Layout>
      <Box p={5}>
        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <h1>Invoice Form</h1>
          <Box>
            <Button variant={'ghost'}>Cancel</Button>
            <Button onClick={saveFiretoreInvoice} isLoading={isLoading}>
              Create
            </Button>
          </Box>
        </Flex>
        <Text mt={'20px'} mb={'10px'}>
          Select client from dropdown
        </Text>
        <SearchDropdown users={clients} onSelectUser={handleSelectUser} />
        <ItemsComponent onUpdateItems={val => setLineItems(val)} />
        <Box mt={'20px'}>
          <Text>Memo</Text>
          <Textarea />
        </Box>

        <UploadAttachmentComponent
          setAttachments={val => setAttachments(val)}
        />

        <Box mt={4}>
          <Text>Default setting for invoice payment</Text>
          {!portal ? (
            <Spinner />
          ) : (
            <Box>
              <Flex
                py={1}
                borderBottom={'1px solid #dfe9e6'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Text fontSize={'17px'}>Enable ACH Debit payment</Text>
                <Checkbox
                  onChange={() =>
                    setSettings({ ...settings, achDebit: !settings.achDebit })
                  }
                  colorScheme="green"
                  isChecked={settings.achDebit}
                />
              </Flex>
              <Flex
                py={1}
                borderBottom={'1px solid #dfe9e6'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Text fontSize={'17px'}>Card</Text>
                <Checkbox
                  onChange={() =>
                    setSettings({ ...settings, card: !settings.card })
                  }
                  colorScheme="green"
                  isChecked={settings.card}
                />
              </Flex>
            </Box>
          )}
        </Box>
      </Box>
    </Layout>
  );
};
