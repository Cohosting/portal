import { generateInvoiceNumber } from '../utils';
import { supabase } from '../lib/supabase';
import axiosInstance from '../api/axiosConfig';
import { DateTime } from "luxon";
import { calculateTotal } from '../utils/invoices';

export const createInvoice = async (invoiceState, portal) => {
  let { client, isLoading, ...rest } = invoiceState;
  const invoice_number = generateInvoiceNumber();

  try {
    const created_at = DateTime.utc().toISO();

    const { data, error } = await supabase.from("invoices").insert([
      {
        ...rest,
        status: "draft",
        invoice_number,
        portal_id: portal.id,
        created_at,
        amount: calculateTotal(invoiceState.line_items),
      },
    ]).select()

    if (error) throw error;
    

    const title = `Draft created for Invoice ${invoice_number.slice(-4)} for ${
      client.name
    }`;
    const { error: recentError } = await supabase
      .from("recent_activities")
      .insert([
        {
          title,
          portal_id: portal.id,
          additional_data: { invoice_number },
          client_id: client.id,
          invoice_id: data[0].id,
        },
      ]);
    if (recentError) throw recentError;

    console.log(data);
  } catch (err) {
    console.log(`Error creating invoice: ${err.message}`);
    throw err;
  }
};

export const updateClientInvoice = async (invoiceId, invoiceData) => {
  // Build the payload exactly as you want it in the DB
  const payload = {
    ...invoiceData,
  };

  // Ask Supabase to do the update AND return the updated row(s)
  const { data: updatedRows, error } = await supabase
    .from('invoices')
    .update(payload)
    .eq('id', invoiceId)
    .select();    // ← without .select(), you don't get updatedRows back

  if (error) {
    console.error('Supabase update error:', error);
    throw error;
  }

  // If nothing changed (or invoiceId not found), treat that as an error
  if (!Array.isArray(updatedRows) || updatedRows.length === 0) {
    throw new Error('Invoice not found or no changes were saved.');
  }

  // Return the single updated row
  return updatedRows[0];
}
export const fetchInvoiceData = async (invoiceId) => {
  try {
    const { data, error } = await supabase
      .from("invoices")
      .select(
        "*, clients(*), settings, attachments, portal: portal_id(support_address, brand_settings, stripe_connect_account_id), attachments"
      )
      .eq("id", invoiceId)
      .single();

    if (error) throw error;

    const { clients, ...rest } = data;
    return {
      ...rest,
      client: clients,
    };
  } catch (error) {
    console.error("Error fetching invoice:", error);
  }
};

export const payInvoice = async (
  invoiceId,
  paymentMethodId,
  stripe_connect_account_id
) => {
  try {
    await axiosInstance.post(`/stripe/connect/invoice/${invoiceId}/pay`, {
      payment_method_id: paymentMethodId,
      stripe_connect_account_id,
    });
  } catch (error) {
    console.error("Error paying invoice:", error);
    throw error;
  }
};

export const fetchInvoices = async (filters) => {
  try {
    const { startDate, endDate, status, searchInvoiceId, portalId, clientId } =
      filters;
    let query = supabase.from("invoices").select("*");

    const formattedStartDate = startDate
      ? DateTime.fromISO(startDate).startOf("day").toISO()
      : null;
    const formattedEndDate = endDate
      ? DateTime.fromISO(endDate).endOf("day").toISO()
      : null;

    if (formattedStartDate && formattedEndDate) {
      query = query
        .gte("created_at", formattedStartDate)
        .lte("created_at", formattedEndDate);
    }

    if (searchInvoiceId) {
      query = query.ilike("invoice_number", `%${searchInvoiceId}%`);
    }

    // Exclude draft invoices and add sorting
    query = query
      .eq("portal_id", portalId)
      .eq("client_id", clientId)
      .neq("status", "Draft")
      .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching invoices:", error);
      return { success: false, message: "Error fetching invoices", error };
    }

    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, message: "Unexpected error occurred", error: err };
  }
};
export const fetchInvoiceCounts = async (portal_id, client_id) => {
  const { data, error } = await supabase.rpc("get_invoice_counts", {
    portal_id,
    client_id,
  });

  if (error) {
    console.error("Error fetching invoice counts:", error);
    return;
  }

  const { all_count, open_count, paid_count, processing_count } = data[0];
  return [
    { name: "All", count: all_count },
    { name: "Open", count: open_count },
    { name: "Paid", count: paid_count },
    { name: "Processing", count: processing_count },
  ];
};

export const getOpenInvoices = async (portalId) => {
  const { data, error } = await supabase
    .from("invoices")
    .select("*, client: client_id(*)")
    .eq("portal_id", portalId)
    .eq("status", "open");

  if (error) {
    console.error("Error fetching open invoices:", error);
    return [];
  }

  return data;
};

export const sendInvoiceReminder = async (invoiceData, email) => {
  try {
    await axiosInstance.post(`/email/send`, {
      to: email,
      subject: "Invoice Reminder!",
      htmlContent: `
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
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
      .from("invoices")
      .update({ reminded_at: DateTime.utc().toISO() })
      .eq("id", invoiceData.id);

    if (error) console.error("Error updating invoice:", error);

    return { success: true, invoice: invoiceData };
  } catch (error) {
    console.error(
      "Error sending email for invoice:",
      invoiceData.invoice_number,
      error
    );
    return { success: false, invoice: invoiceData, error };
  }
};

export const sendInvoiceReminderInBatch = async (invoiceDataArray) => {
  const results = await Promise.allSettled(
    invoiceDataArray.map((invoice) =>
      sendInvoiceReminder(invoice, invoice.client.email)
    )
  );

  const failed = results.filter(
    (r) => r.status === "rejected" || !r.value.success
  );
  const succeeded = results.filter(
    (r) => r.status === "fulfilled" && r.value.success
  );

  console.log(`${succeeded.length} emails sent successfully.`);
  console.error(`${failed.length} emails failed to send.`);

  return { succeeded, failed };
};
