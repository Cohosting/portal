import React, { useEffect, useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import { useToggle } from 'react-use';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { supabase } from '../../lib/supabase';
import EmptyStateFeedback from '../../components/EmptyStateFeedback';
import { BanknotesIcon, } from '@heroicons/react/24/outline';
import InvoiceTable from '../../components/table/InvoicesTable';
import { Spinner } from '@phosphor-icons/react';

export const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const { currentSelectedPortal } = useSelector(state => state.auth)
  const { data: portal } = usePortalData(currentSelectedPortal)
  const [isOpen, toggleOpen] = useToggle(true);

  // fetch invoices from firebase invoices collection
  useEffect(() => {
    if (!portal) return;

    const fetchInvoices = async () => {

      toggleOpen(true);

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
      toggleOpen(false);
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

  return (
    <Layout headerName='Invoices'>
      {
        isOpen && (
          <div className="flex justify-center items-center h-96">
            <Spinner size={46} />
          </div>
        )

      }
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
      <div className='p-4'>
        {
          invoices.length > 0 && <InvoiceTable portal={portal} invoices={invoices} stripe_connect_account_id={portal.stripe_connect_account_id} />
        }
      </div>
    </Layout>
  );
};
