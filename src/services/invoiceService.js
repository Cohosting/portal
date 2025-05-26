import { generateInvoiceNumber } from '../utils';
import { supabase } from '../lib/supabase';
import axiosInstance from '../api/axiosConfig';

import moment from 'moment-timezone';
import { calculateTotal } from '../utils/invoices';

export const createInvoice = async (invoiceState, portal) => {
  let { client, isLoading, ...rest } = invoiceState;
  const invoice_number = generateInvoiceNumber();

  console.log(`Invoice State: ${invoiceState}`);
  try {
    const now = moment().tz('UTC');

    const created_at = now.toISOString();
    const { data, error } = await supabase.from('invoices').insert([
      {
        ...rest,
        status: 'draft',
        invoice_number,
        portal_id: portal.id,
        created_at,
        amount: calculateTotal(invoiceState.line_items),
      },
    ]);

    if (error) throw error;
    let title = `Draft created for Invoice ${invoice_number.slice(-4)} for ${
      client.name
    }`;
    const { error: recentError } = await supabase
      .from('recent_activities')
      .insert([
        {
          title,
          portal_id: portal.id,
          additional_data: {
            invoice_number: invoice_number,
          },
        },
      ]);
    if (recentError) throw recentError;
    // Optionally, handle the response data, e.g., to get the ID of the inserted row
    console.log(data);
    // console.log('Invoice created with ID:', data[0].id);
  } catch (err) {
    console.log(`Error creating invoice: ${err.message}`);
    throw err
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
      .select(
        '*, clients(*), portal: portal_id(billing_address, brand_settings, stripe_connect_account_id )'
      ) // Adjust 'clients(*)' based on your actual relationship and table names
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

export const getOpenInvoices = async portalId => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, client: client_id(*)')
    .eq('portal_id', portalId)
    .eq('status', 'open');
  if (error) {
    console.error('Error fetching open invoices:', error);
    return [];
  }
  return data;
};

export const sendInvoiceReminder = async (invoiceData, email) => {
  try {
    const { data } = await axiosInstance.post(`/email/send`, {
      to: email,
      subject: 'Invoice Reminder!',
      htmlContent: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd;">
        <h2 style="color: #333;">Invoice Reminder</h2>
        <p>Dear ${invoiceData.client.name},</p>
        <p>This is a friendly reminder that your invoice <strong>#${invoiceData.invoice_number}</strong>.</p>
        <p>Please make your payment at your earliest convenience.</p>
        <p><strong>Amount Due:</strong> $${invoiceData.amount}</p>
        <p>If you have already made the payment, please disregard this email.</p>
        <p>Thank you for your prompt attention to this matter!</p>
        <p>Best regards,</p>
        <p>${invoiceData.brand_settings.brandName}</p>
    </div>
</body>`,
    });
    const { error } = await supabase
      .from('invoices')
      .update({
        reminded_at: new Date().toISOString(),
      })
      .eq('id', invoiceData.id);

    if (error) {
      console.error('Error updating invoice:', error);
      // return { success: false, invoice: invoiceData, error };
    }
    return { success: true, invoice: invoiceData }; // Return success and invoice data
  } catch (error) {
    console.error(
      'Error sending email for invoice:',
      invoiceData.invoice_number,
      error
    );
    return { success: false, invoice: invoiceData, error }; // Return failure with error
  }
};

export const sendInvoiceReminderInBatch = async invoiceDataArray => {
  const promises = invoiceDataArray.map(invoice =>
    sendInvoiceReminder(invoice, invoice.client.email)
  );

  // Use Promise.allSettled to track which ones failed and which succeeded
  const results = await Promise.allSettled(promises);

  const failed = results.filter(
    result => result.status === 'rejected' || !result.value.success
  );
  const succeeded = results.filter(
    result => result.status === 'fulfilled' && result.value.success
  );

  // Log success and failure
  console.log(`${succeeded.length} emails sent successfully.`);
  console.error(`${failed.length} emails failed to send.`);

  // Optionally, return the details of successes and failures
  return { succeeded, failed };
};