import { DateTime } from "luxon";

export const calculateTotal = (items) => {
  if (!items) return 0;
  return items
    .reduce((total, item) => {
      return total + item.quantity * item.unit_amount;
    }, 0)
    .toFixed(2);
};

export const getPaymentMethodsType = (settings) => {
  let payment_methods = [];

  if (settings.card) {
    payment_methods.push("card");
  }

  if (settings.ach_debit) {
    payment_methods.push("us_bank_account");
  }

  return payment_methods;
};

export const generateLabelAndDescriptionForBankOrCard = (paymentMethod) => {
  if (paymentMethod.us_bank_account) {
    const us_bank_account = paymentMethod.us_bank_account;
    return {
      label: `${us_bank_account.bank_name} - (${us_bank_account.account_holder_type})`,
      description: "**** **** **** " + us_bank_account.last4,
    };
  } else if (paymentMethod.card) {
    const card = paymentMethod.card;
    return {
      label: `${card.brand} - ${card.funding}`,
      description: "**** **** **** " + card.last4,
    };
  }
};

export const formatInvoiceDates = (
  invoices = [],
  startDate = null,
  endDate = null
) => {
  if (!invoices.length) {
    return [];
  }

  const sortedInvoices = invoices.sort((a, b) => {
    return (
      DateTime.fromISO(b?.created).toMillis() -
      DateTime.fromISO(a?.created).toMillis()
    );
  });

  const formattedData = [];
  const today = DateTime.local().startOf("day");
  const yesterday = today.minus({ days: 1 });

  let currentDate = startDate
    ? DateTime.fromISO(startDate).startOf("day")
    : DateTime.fromISO(sortedInvoices[0].created).startOf("day");

  const lastDate = endDate
    ? DateTime.fromISO(endDate).startOf("day")
    : DateTime.fromISO(
        sortedInvoices[sortedInvoices.length - 1].created
      ).startOf("day");

  while (currentDate >= lastDate) {
    let dateLabel;
    if (currentDate.hasSame(today, "day")) {
      dateLabel = "Today";
    } else if (currentDate.hasSame(yesterday, "day")) {
      dateLabel = "Yesterday";
    } else {
      dateLabel = currentDate.toFormat("cccc, LLLL d"); // e.g., "Tuesday, May 28"
    }

    const dayInvoices = sortedInvoices.filter((invoice) =>
      DateTime.fromISO(invoice.created)
        .startOf("day")
        .hasSame(currentDate, "day")
    );

    if (dayInvoices.length > 0 || startDate) {
      formattedData.push({
        date: dateLabel,
        invoices: dayInvoices,
      });
    }

    currentDate = currentDate.minus({ days: 1 });
  }

  return formattedData;
};
