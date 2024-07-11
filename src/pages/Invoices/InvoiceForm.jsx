import React, { useContext, useEffect, useState } from 'react';
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
import { UploadAttachmentComponent } from '../../components/UI/uploadAttachment';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { useRealtimePortalClients } from '../../hooks/useRealtimePortalClients';
import useInvoice from '../../hooks/useInvoice';
import Example from '../../components/Example';
import Breadcrumb from '../../components/Breadcrumb';
import Select from '../../components/Select';
import InvoicePaymentSettings from '../../components/InvoicePaymentSettings';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import InvoiceLineItemsTable from '../../components/table/InvoiceLineItemsTable';

export const InvoiceForm = () => {
  const { user } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(user?.portals);
  const { mode } = useParams();
  const clientsData = useRealtimePortalClients(user, portal);

  const { invoiceState, setInvoiceState, saveInvoice, isClientError, updateInvoice } = useInvoice({
    settings: {
      card: portal?.settings?.card,
      ach_debit: portal?.settings?.ach_debit,
    }

  })


  const handleSelectUser = user => {
    setInvoiceState(prevState => ({ ...prevState, client: user, client_id: user.id }));
  };


  const handleSettingUpdate = (key, value) => {
    setInvoiceState(prevState => ({ ...prevState, settings: { ...prevState.settings, [key]: value } }));
  }


  console.log(invoiceState)
  return (
    <Layout hideMobileNav={true}>

      <Box py={5}    >

        <div className="lg:w-[calc(100%-288px)] z-10 w-full px-5 items-center justify-between fixed top-0 py-4 border-b border-gray-200 bg-white  ">
          <div className='flex  items-center  '>
            <Breadcrumb
              pages={[
                {
                  name: 'Invoices', href: '#', current: false, settings: {
                    breakPointStyle: 'lg-m:block hidden ',
                  }
                },
                { name: 'New Invoices', href: '#', current: true, },

              ]}
            />
            <div className='flex ml-auto  items-center text-sm '>
              <button className='w-16 h-6.5'>Cancel</button>
              <button className=' btn-indigo   px-20    ml-2 text-[12px]' onClick={saveInvoice} >
                {/* Mode and loading indicator */}
                {
                  mode === 'edit' ? (invoiceState.isLoading ? 'loading...' : 'Update') : (invoiceState.isLoading ? 'loading...' : 'Create')
                }

              </button>
            </div>
          </div>

        </div>
        <div className='pt-0 pb-100px  w-[800px] max-w-full mx-auto lg:mt-[70px] px-5'>


          {/*       <Flex alignItems={'center'} justifyContent={'space-between'}>
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
        </Flex> */}

          {/* <SearchDropdown defaultValue={invoiceState.client} users={clientsData} onSelectUser={handleSelectUser} /> */}
          <Select
            list={clientsData}
            placeholder={'Select Client'}
            selected={invoiceState.client}
            setSelected={handleSelectUser}
            label="Select Client"
            renderItem={(client) => <p className='block truncate font-normal group-data-[selected]:font-semibold'>{client?.name}</p>}
          />
          {isClientError && <p className='text-sm mt-1 font-semibold text-red-500 ' >Please select a client</p>}
          <InvoiceLineItemsTable lineItems={invoiceState.line_items} setLineItems={(val) => {

            setInvoiceState({
              ...invoiceState,
              line_items: val,
            });
          }} />
          {/* <ItemsComponent defaultValue={invoiceState.line_items} onUpdateItems={val => setInvoiceState({
          ...invoiceState,
          line_items: val,

        })} /> */}

          <div>
            <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
              Add your comment
            </label>
            <div className="mt-2">
              <textarea
                id="comment"
                name="comment"
                rows={4}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={''}
                value={invoiceState.memo} onChange={(e) => setInvoiceState({
                  ...invoiceState,
                  memo: e.target.value,

                })}
              />
            </div>
          </div>

        <UploadAttachmentComponent
          setAttachments={val => {
            setInvoiceState({
              ...invoiceState,
              attachments: val,
            });
          }}
          /> 


          <Disclosure  >
            <DisclosureButton className="py-2 group flex items-center space-x-2">
              <p className='text-[14px] font-semibold'>Advance Settings</p>
              <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />

            </DisclosureButton>
            <DisclosurePanel transition className="  text-gray-500 origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0">
              <InvoicePaymentSettings handleSettingUpdate={handleSettingUpdate} settings={invoiceState?.settings} />

            </DisclosurePanel>
          </Disclosure>
        </div>


      </Box>
    </Layout>

  );
};
