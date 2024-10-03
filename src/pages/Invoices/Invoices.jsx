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
import EmptyStateFeedback from '../../components/EmptyStateFeedback';
import { BanknotesIcon, SquaresPlusIcon } from '@heroicons/react/24/outline';
import InvoiceTable from '../../components/table/InvoicesTable';




export const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const { user, currentSelectedPortal } = useSelector(state => state.auth)
  const { data: portal } = usePortalData(currentSelectedPortal)
  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: true
  })

  // fetch invoices from firebase invoices collection
  useEffect(() => {
    if (!portal) return;

    const fetchInvoices = async () => {
      onOpen()

      const { data, error } = await supabase
        .from('invoices')
        .select('*, clients(*)')
        .eq('portal_id', portal.id);



      if (error) {
        console.error('Error fetching invoices:', error);
      } else {
        const invoices = data.map(invoice => {
          const { clients, ...rest } = invoice;
          return {
            ...invoice,
            client: clients,
          }
        });

        setInvoices(invoices);
      }
      onClose()
    };

    fetchInvoices();


    const subscription = supabase
      .channel(`invoices:portal_id=eq.${portal.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'invoices',
        filter: `portal_id=eq.${portal.id}`,
      }, () => {
        fetchInvoices();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'invoices',
        filter: `portal_id=eq.${portal.id}`,
      }, () => {
        fetchInvoices();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [portal]);



  console.log(invoices)

  return (
    <Layout headerName='Invoices'>
      {
        !invoices.length && !isOpen && (
          <div className="mt-[100px]">
            <EmptyStateFeedback
              IconComponent={BanknotesIcon}
              title={'Create Your First Invoice'}
              message={
                `It looks like you haven't created any invoices yet. Click the button below to create your first invoice.`
              }
              buttonText={'Create invoice'}

              onButtonClick={() => navigate('/billing/add')}
            />
          </div>
        )
      }
      <Box p={4}>


        {
          invoices.length > 0 && <InvoiceTable invoices={invoices} stripe_connect_account_id={portal.stripe_connect_account_id} />
        }


      </Box>
    </Layout>
  );
};
