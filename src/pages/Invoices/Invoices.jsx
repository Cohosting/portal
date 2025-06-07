import React, { useEffect, useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import { useToggle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { usePortalData } from '../../hooks/react-query/usePortalData';
import { supabase } from '../../lib/supabase';

import EmptyStateFeedback from '../../components/EmptyStateFeedback';
import { Banknote, Loader } from 'lucide-react';

import PageHeader from '@/components/internal/PageHeader';
import BillingTable from './InvoiceTable';
import { Button } from '@/components/ui/button';

export const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const { currentSelectedPortal } = useSelector((state) => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);
  const [isOpen, toggleOpen] = useToggle(true);

  useEffect(() => {
    if (!portal) return;

const fetchInvoices = async () => {
  toggleOpen(true);

  const { data, error } = await supabase
    .from('invoices')
    .select('*, clients(*)')
    .eq('portal_id', portal.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invoices:', error);
  } else {
    const mappedInvoices = data.map((invoice) => {
      const { clients, ...rest } = invoice;
      return {
        ...rest,
        client: clients,
      };
    });
    setInvoices(mappedInvoices);
  }

  toggleOpen(false);
};


    fetchInvoices();

    const subscription = supabase
      .channel(`invoices:portal_id=eq.${portal.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'invoices',
          filter: `portal_id=eq.${portal.id}`,
        },
        fetchInvoices
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'invoices',
          filter: `portal_id=eq.${portal.id}`,
        },
        fetchInvoices
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [portal]);

  return (
    <Layout hideMobileNav headerName="Invoices">
    <PageHeader
        title="Billing"
        description="Manage your invoices and payment settings"
        action={
          <Button
             onClick={() => navigate('/billing/new')}
            className="bg-black hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Create Invoice
          </Button>
        }
      />
   
      <div className="p-0">
        {isOpen && !invoices.length &&  (
          <div className="flex justify-center items-center mt-8  ">
            <Loader className='animate-spin'  />
            <p className="ml-2">Loading...</p>
          </div>
        )}

        {!invoices.length && !isOpen && (
          <div className="mt-16">
            <EmptyStateFeedback
              IconComponent={Banknote}
              title="Create Your First Invoice"
              message="It looks like you haven’t created any invoices yet. Click the button below to create your first invoice."
              centered
            />
          </div>
        )}

        {invoices.length > 0 && (
          <BillingTable
            portal={portal}
            invoices={invoices}
            stripe_connect_account_id={portal.stripe_connect_account_id}
          />
        )}
      </div>
    </Layout>
  );
};
