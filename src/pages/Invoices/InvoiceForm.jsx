import React from 'react';
import { Layout } from '../Dashboard/Layout';


import { UploadAttachmentComponent } from '../../components/UI/uploadAttachment';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { useRealtimePortalClients } from '../../hooks/useRealtimePortalClients';
import Breadcrumb from '../../components/Breadcrumb';
import Select from '../../components/Select';
import InvoicePaymentSettings from '../../components/InvoicePaymentSettings';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import InvoiceLineItemsTable from '../../components/table/InvoiceLineItemsTable';
import useInvoice from '../../hooks/invoice/useInvoice';
import InputField from '../../components/InputField';

export const InvoiceForm = () => {
  const { user, currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);
  const { mode } = useParams();
  const navigate = useNavigate();
  const clientsData = useRealtimePortalClients(user, portal);

  const settings = portal?.settings

  const { invoiceState, setInvoiceState, saveInvoice, isClientError, updateInvoice } = useInvoice({
    settings 

  })


  const handleSelectUser = user => {
    setInvoiceState(prevState => ({ ...prevState, client: user, client_id: user.id }));
  };


  const handleSettingUpdate = (key, value) => {
    setInvoiceState(prevState => ({ ...prevState, settings: { ...prevState.settings, [key]: value } }));
  }


  return (
    <Layout hideMobileNav={true}>

      <div className='py-4' >

        <div className="lg:w-[calc(100%-288px)] z-10 w-full px-5 items-center justify-between fixed top-0 py-4 border-b border-gray-200 bg-white  ">
          <div className='flex  items-center  '>
            <Breadcrumb
              pages={[
                {
                  name: 'Invoices', href: '#', current: false, settings: {
                    breakPointStyle: 'lg-m:block hidden ',
                  },

                },
                { name: 'New Invoices', href: '#', current: true, },

              ]}
            />
            <div className='flex ml-auto  items-center text-sm '>
              <button className='w-16 h-6.5' onClick={() => navigate('/billing')} >Cancel</button>
              <button className=' btn-indigo   px-20    ml-2 text-[12px]' onClick={
                mode === 'edit' ? () => updateInvoice() : saveInvoice
              } >
                {/* Mode and loading indicator */}
                {
                  mode === 'edit' ? (invoiceState.isLoading ? 'loading...' : 'Update') : (invoiceState.isLoading ? 'loading...' : 'Create')
                }

              </button>
            </div>
          </div>

        </div>
        <div className='pt-0 pb-100px  w-[800px] max-w-full mx-auto lg:mt-[70px] px-5'>
          {/* Title and description input */}
          <div className='space-y-3 mb-4'>
            <InputField
              id="title"
              name="title"
              type="text"
              placeholder="Enter title"
              label="Title"
              value={invoiceState.title}
              handleChange={(e) => setInvoiceState({
                ...invoiceState,
                title: e.target.value,
              })}
            />
            <InputField
              id="description"
              name="description"
              type="text"
              placeholder="Enter description"
              label="Description"
              value={invoiceState.description}
              handleChange={(e) => setInvoiceState({
                ...invoiceState,
                description: e.target.value,
              })}
            />
          </div>

          <Select
            list={clientsData}
            placeholder={'Select Client'}
            selected={invoiceState.client}
            setSelected={handleSelectUser}
            label="Select Client"
            renderItem={(client) => (

              <>
                <p className='block truncate font-normal group-data-[selected]:font-semibold'>{client?.name}</p>
                <p className='block truncate text-sm '>{client?.email}</p>
              </>
            )}
          />
          {isClientError && <p className='text-sm mt-1 font-semibold text-red-500 ' >Please select a client</p>}
          <InvoiceLineItemsTable lineItems={invoiceState.line_items} setLineItems={(val) => {

            setInvoiceState({
              ...invoiceState,
              line_items: val,
            });
          }} />

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


      </div>
    </Layout>

  );
};
