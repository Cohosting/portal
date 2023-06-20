import { Box, Button } from '@chakra-ui/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { useSubdomain } from '../../../hooks/useSubdomain';
import { ClientAuthContext } from '../../../context/clientAuthContext';
import { ClientInvoiceItem } from './ClientInvoiceItem';

export const ClientBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const { subdomain } = useSubdomain();
  const { clientUser } = useContext(ClientAuthContext);
  useEffect(() => {
    if (!subdomain || !clientUser) return;
    // fetch invoices

    (async () => {
      const q = query(
        collection(db, 'portals'),
        where('portalURL', '==', subdomain)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(el => el.data())[0];
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
    })();
  }, [subdomain, clientUser]);

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
