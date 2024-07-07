import React, { useContext, useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import { SearchDropdown } from '../../components/UI/searchDropdown';

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
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { useRealtimePortalClients } from '../../hooks/useRealtimePortalClients';
import useInvoice from '../../hooks/useInvoice';

export const InvoiceForm = () => {
  const { user } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(user?.portals);
  const { mode } = useParams();
  const clientsData = useRealtimePortalClients(user, portal);

  const { invoiceState, setInvoiceState, saveInvoice, updateInvoice } = useInvoice({
    settings: {
      card: portal?.settings?.card,
      achDebit: portal?.settings?.ach_debit,
    }

  })


  const handleSelectUser = user => {
    setInvoiceState(prevState => ({ ...prevState, client: user, client_id: user.id }));
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
                updateInvoice()
              } else {
                saveInvoice()

              }
            }} isLoading={invoiceState.isLoading}>
              {mode === 'edit' ? 'update' : 'create'}
            </Button>
          </Box>
        </Flex>
        <Text mt={'20px'} mb={'10px'}>
          Select client from dropdown
        </Text>
        <SearchDropdown defaultValue={invoiceState.client} users={clientsData} onSelectUser={handleSelectUser} />
        <ItemsComponent defaultValue={invoiceState.line_items} onUpdateItems={val => setInvoiceState({
          ...invoiceState,
          line_items: val,

        })} />
        <Box mt={'20px'}>
          <Text>Memo</Text>
          <Textarea value={invoiceState.memo} onChange={(e) => setInvoiceState({
            ...invoiceState,
            memo: e.target.value,

          })} />
        </Box>

        <UploadAttachmentComponent
          setAttachments={val => {
            setInvoiceState({
              ...invoiceState,
              attachments: val,
            });
          }}
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
                      setInvoiceState({
                        ...invoiceState,
                        settings: {
                          ...invoiceState.settings,
                          achDebit: !invoiceState.settings.achDebit,
                        },
                      })
                  }
                  colorScheme="green"
                    isChecked={invoiceState.settings.achDebit}
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
                      // setSettings({ ...settings, card: !settings.card })
                      setInvoiceState({
                        ...invoiceState,
                        settings: {
                          ...invoiceState.settings,
                          card: !invoiceState.settings.card,
                        },
                      })
                  }
                  colorScheme="green"
                    isChecked={invoiceState.settings.card}
                />
              </Flex>
            </Box>
          )}
        </Box>
      </Box>
    </Layout>
  );
};
