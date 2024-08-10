import { generateInvoiceNumber } from '../utils';
import { supabase } from '../lib/supabase';
import axiosInstance from '../api/axiosConfig';

import { formatISO, toDate } from 'date-fns';
import moment from 'moment-timezone';

export const createInvoice = async (invoiceState, portal) => {
  const invoice_number = generateInvoiceNumber();

  try {
    const now = moment().tz('UTC');

    const created = now.toISOString();
    console.log({ created });
    const { data, error } = await supabase.from('invoices').insert([
      {
        ...invoiceState,
        status: 'draft',
        invoice_number,
        portal_id: portal.id,
        created,
      },
    ]);

    if (error) throw error;

    // Optionally, handle the response data, e.g., to get the ID of the inserted row
    console.log(data);
    // console.log('Invoice created with ID:', data[0].id);
  } catch (err) {
    console.log(`Error creating invoice: ${err.message}`);
  }
};

export const updateClientInvoice = async (invoiceId, invoiceData) => {
  try {
    const { error } = await supabase
      .from('invoices')
      .update({
        ...invoiceData,
      })
      .match({ id: invoiceId }); // Use the invoiceId directly

    if (error) throw error;

    // Assuming navigate and setIsLoading are available in this context
  } catch (err) {
    console.error(err);
  }
};
export const fetchInvoiceData = async invoiceId => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, clients(*)') // Adjust 'clients(*)' based on your actual relationship and table names
      .eq('id', invoiceId)
      .single();

    if (error) {
      throw error;
    }

    const { clients, ...rest } = data;
    if (data) {
      return {
        ...rest,
        client: clients,
      };
    } else {
      console.log('No such invoice found');
    }
  } catch (error) {
    console.error('Error fetching invoice:', error);
  }
};

export const payInvoice = async (
  invoiceId,
  paymentMethodId,
  stripe_connect_account_id
) => {
  try {
    const { data } = await axiosInstance.post(
      `/stripe/connect/invoice/${invoiceId}/pay`,
      {
        payment_method_id: paymentMethodId,
        stripe_connect_account_id,
      }
    );
  } catch (error) {
    console.error('Error paying invoice:', error);
    throw error;
  }
};
export const fetchInvoices = async filters => {
  try {
    console.log('Fetching invoices with filters:', filters);
    const { startDate, endDate, status, searchInvoiceId, portalId, clientId } =
      filters;
    let query = supabase.from('invoices').select('*');

    // Convert the dates to ISO 8601 format if they are provided
    const formattedStartDate = startDate
      ? moment(startDate).startOf('day').toISOString()
      : null;
    const formattedEndDate = endDate
      ? moment(endDate).endOf('day').toISOString()
      : null;

    // Apply date range filtering if both startDate and endDate are provided
    if (formattedStartDate && formattedEndDate) {
      console.log(
        `Filtering by date range: ${formattedStartDate} to ${formattedEndDate}`
      );
      query = query
        .gte('created', formattedStartDate)
        .lte('created', formattedEndDate);
    }

    // Rest of your filtering logic remains the same
    // if (status && status !== 'all') {
    //   console.log(`Filtering by status: ${status}`);
    //   query = query.eq('status', status);
    // }

    if (searchInvoiceId) {
      console.log(`Filtering by invoice ID: ${searchInvoiceId}`);
      query = query.ilike('invoice_number', `%${searchInvoiceId}%`);
    }

    console.log(
      `Filtering by portal ID: ${portalId} and client ID: ${clientId}`
    );
    query = query.eq('portal_id', portalId).eq('client_id', clientId);

    console.log('Executing query:', query);
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching invoices:', error);
      return { success: false, message: 'Error fetching invoices', error };
    }
    console.log('Fetched data:', data);

    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, message: 'Unexpected error occurred', error: err };
  }
};

export const fetchInvoiceCounts = async (portal_id, client_id) => {
  const { data, error } = await supabase.rpc('get_invoice_counts', {
    portal_id,
    client_id,
  });
  if (error) {
    console.error('Error fetching invoice counts:', error);
    return;
  }

  const { all_count, open_count, paid_count, processing_count } = data[0];
  console.log(data[0]);
  return [
    { name: 'All', count: all_count },
    { name: 'Open', count: open_count },
    { name: 'Paid', count: paid_count },
    { name: 'Processing', count: processing_count },
  ];
};
