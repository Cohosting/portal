// portalService.js
import { supabase } from '../lib/supabase';
import axiosInstance from '../api/axiosConfig';

//Fetch portal data by either ID or URL.
export const fetchPortalDataByIdOrUrl = async (
  identifier,
  identifierType = 'id'
) => {
  console.log('getting refetched');
  if (identifierType === 'url' && identifier === 'dashboard') {
    return {
      id: 'dashboard',
      name: 'Dashboard',
      portal_apps: [],
    };
  }
  const column = identifierType === 'url' ? 'portal_url' : 'id';
  console.log(`Fetching portal data by ${column}: ${identifier}`);

  const query = supabase
    .from('portals')
    .select(
      `
      *,
      portal_apps(*)

    `
    )
    .eq(column, identifier)
    .single();

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }
  console.log({
    data,
  });
  return data;
};
export const fetchTeamMemberData = async (portalId, userEmail) => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('portal_id', portalId)
    .eq('email', userEmail)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
export const updateTeamMemberStatus = async (memberId, status) => {
  const { error } = await supabase
    .from('teamMembers')
    .update({ status })
    .eq('id', memberId);

  if (error) {
    throw new Error(error.message);
  }
};

export const createCustomer = async (uid, email) => {
  const response = await axiosInstance.post('/customers', {
    userId: uid,
    email,
  });

  return response.data;
};

export const updateCustomerInPortal = async (portalId, customerId) => {
  const { error } = await supabase
    .from('portals')
    .update({ customer_id: customerId })
    .eq('id', portalId);
};

export const redirectToStripeCheckoutSession = async invoice => {
  const res = await fetch(
    `${import.meta.env.VITE_NODE_URL}/connect/create-connect-checkout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId: invoice.client.customerId,
        stripeConnectAccountId: 'acct_1N8TK0QEKRwEVaAN',
        line_items: invoice.lineItems,
      }),
    }
  );
  const { session } = await res.json();
  window.location.href = session.url;
};

export const fetchFinalizedInvoicesByDomain = async (isValid, id) => {
  try {
    let query = supabase.from('invoices').select('*, clients(*)');

    query = query.eq('portal_id', id);

    let { data: invoices, error } = await query;
    if (error) throw error;

    return invoices.map(invoice => {
      const { clients, ...rest } = invoice;
      return {
        ...rest,
        client: clients,
      };
    });
  } catch (err) {
    console.log('Error getting invoices', err);
  }
};

export const createStripeBillingSessionAndReturn = async customerId => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_NODE_URL}/connect/create-connect-billing-session`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          stripeConnectAccountId: 'acct_1N8TK0QEKRwEVaAN',
        }),
      }
    );
    const { session } = await res.json();

    return session;
  } catch (err) {
    console.log('Error creating billing session', err);
    throw err;
  }
};

export const fetchPortalClients = async portal_id => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('portal_id', portal_id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
