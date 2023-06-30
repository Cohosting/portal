import { Box, Button } from '@chakra-ui/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { useSubdomain } from '../../../hooks/useSubdomain';
import { ClientAuthContext } from '../../../context/clientAuthContext';
import { ClientInvoiceItem } from './ClientInvoiceItem';
import { isSubdomain } from '../../../utils';

export const ClientBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { domain, isValid, isLoading } = useSubdomain();
  const { clientUser } = useContext(ClientAuthContext);
  useEffect(() => {
    if (!clientUser || isLoading) return;
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!domain || !clientUser)
          throw new Error('Domain or client user is not specified.');

        const q = query(
          collection(db, 'portals'),
          isValid && !domain.includes('.')
            ? where('portalURL', '==', domain)
            : where('customDomain', '==', domain)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(el => el.data())[0];

        if (!data) throw new Error('No data found for the provided domain.');

        const portalId = data.id;

        const invoiceQuery = query(
          collection(db, 'invoices'),
          where('portalId', '==', portalId),
          where('customerId', '==', clientUser.customerId),
          where('status', '==', 'finalized')
        );
        const invoicesSnapshot = await getDocs(invoiceQuery);
        const invoiceForPortal = invoicesSnapshot.docs.map(el => el.data());
        setInvoices(invoiceForPortal);
      } catch (error) {
        console.error(error);
        setError(`Failed to fetch data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [domain, clientUser, isLoading]);

  const handleRedirectPayment = invoice => {
    const { hosted_invoice_url } = invoice;
    // Redirect them to stripe invoice hosted page
    window.location.href = hosted_invoice_url;
  };

  console.log(invoices);

  return (
    <Box>
      <h1>Client Billing</h1>

      <Box>
        <h2>Invoices</h2>
        <Box>
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            <>
              {invoices?.map(invoice => (
                <ClientInvoiceItem
                  invoice={invoice}
                  handleRedirectPayment={handleRedirectPayment}
                />
              ))}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
