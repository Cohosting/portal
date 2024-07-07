import queryString from 'query-string';
import { generateInvoiceNumber } from '../utils';
import { supabase } from '../lib/supabase';

export const createInvoice = async (invoiceState, portal) => {
  const invoice_number = generateInvoiceNumber();

  try {
    const { data, error } = await supabase.from('invoices').insert([
      {
        ...invoiceState,
        status: 'draft',
        invoice_number,
        portal_id: portal.id,
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
  // Assuming invoiceId is passed correctly and you don't need to parse it from the URL anymore
  // const id = queryString.parse(window.location.search).id; // Not needed if invoiceId is used

  console.log({
    invoiceId,
    invoiceData,
  });
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
  // Firebase logic to fetch invoice data
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
