import React, { useContext, useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import { useEffect } from 'react';
import { SearchDropdown } from '../../components/UI/searchDropdown';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
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
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { generateInvoiceNumber } from '../../utils';
import { PortalContext } from '../../context/portalContext';
import queryString from 'query-string';

export const InvoiceForm = () => {
  const [clients, setClients] = useState([]);
  const { user } = useContext(AuthContext);
  const { portal } = useContext(PortalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [lineItems, setLineItems] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [settings, setSettings] = useState({});
  const [memo, setMemo] = useState('')
  const [invoiceData, setInvoiceData] = useState();
  const { mode } = useParams()

  const [stripeUser, setStripeUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || !portal) return;
    const collecRef = collection(db, 'portalMembers');
    const q = query(collecRef, where('portalId', '==', portal.id));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const clients = querySnapshot.docs.map(doc => doc.data());
      setClients(clients);
    });

    return () => {
      unsubscribe();
    };
  }, [user, portal]);

  const handleSelectUser = user => {
    setStripeUser(user);
  };


  const saveFiretoreInvoice = async () => {
    try {
      setIsLoading(true);
      const ref = doc(collection(db, 'invoices'));
      await setDoc(ref, {
        lineItems,
        memo,
        attachments: attachments,
        status: 'draft',
        createdBy: user.uid,
        createdOn: new Date(),
        client: stripeUser,
        id: ref.id,
        invoiceNumber: generateInvoiceNumber(),
        settings: {
          achDebit: settings.achDebit,
          card: settings.card
        },
        portalId: portal.id,
        customerId: stripeUser.customerId,
        email: stripeUser.email,
        userId: user.id,
      });
      setIsLoading(false);

      setTimeout(() => {
        navigate('/billing');
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

  useEffect(() => {
    if (mode === 'edit') {

      (async () => {
        const id = queryString.parse(window.location.search).id;
        const ref = doc(db, 'invoices', id);
        const snapshot = await getDoc(ref);
        const data = snapshot.data();
        setInvoiceData(data);
        setStripeUser(data.client);
        setAttachments(data.attachments);
        setLineItems(data.lineItems);
        setMemo(data.memo)



      })();


    }
  }, [])


  const updateInvoiceDB = async () => {

    const id = queryString.parse(window.location.search).id;
    setIsLoading(true);
    try {

      const ref = doc(db, 'invoices', id);
      await updateDoc(ref, {
        lineItems,
        attachments,
        client: stripeUser,
        customerId: stripeUser.customerId,
        email: stripeUser.email,
        settings,
        memo
      })
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);

  };


  return (
    <Layout>
      <Box p={5}   >
        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <h1>Invoice Form</h1>
          <Box>
            <Button variant={'ghost'}>Cancel</Button>
            <Button onClick={() => {

              if (mode === 'edit') {
                updateInvoiceDB()
              } else {
                saveFiretoreInvoice()

              }
            }} isLoading={isLoading}>
              {mode === 'edit' ? 'update' : 'create'}
            </Button>
          </Box>
        </Flex>
        <Text mt={'20px'} mb={'10px'}>
          Select client from dropdown
        </Text>
        <SearchDropdown defaultValue={stripeUser} users={clients} onSelectUser={handleSelectUser} />
        <ItemsComponent defaultValue={lineItems} onUpdateItems={val => setLineItems(val)} />
        <Box mt={'20px'}>
          <Text>Memo</Text>
          <Textarea value={memo} onChange={(e) => setMemo(e.target.value)} />
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
