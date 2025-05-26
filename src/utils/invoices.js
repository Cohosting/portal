import moment from 'moment';

export const calculateTotal = items => {
  if (!items) return 0;
  return items
    .reduce((total, item) => {
      return total + item.quantity * item.unit_amount;
    }, 0)
    .toFixed(2);
};

export const getPaymentMethodsType = settings => {
  let payment_methods = [];

  if (settings.card) {
    payment_methods.push('card');
  }

  if (settings.ach_debit) {
    payment_methods.push('us_bank_account');
  }

  return payment_methods;
};

export const generateLabelAndDescriptionForBankOrCard = paymentMethod => {
  if (paymentMethod.us_bank_account) {
    const us_bank_account = paymentMethod.us_bank_account;
    return {
      label: `${us_bank_account.bank_name} - (${us_bank_account.account_holder_type})`,
      description: '**** **** **** ' + us_bank_account.last4,
    };
  } else if (paymentMethod.card) {
    const card = paymentMethod.card;
    return {
      label: `${card.brand} - ${card.funding}`,
      description: '**** **** **** ' + card.last4,
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
  // Sort invoices by creation date, most recent first
  const sortedInvoices = invoices?.sort((a, b) =>
    moment(b?.created).diff(moment(a?.created))
  );

  const formattedData = [];
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'day').startOf('day');

  let currentDate = startDate
    ? moment(startDate).startOf('day')
    : moment(sortedInvoices[0].created).startOf('day');
  const lastDate = endDate
    ? moment(endDate).startOf('day')
    : moment(sortedInvoices[sortedInvoices.length - 1].created).startOf('day');

  while (currentDate.isSameOrAfter(lastDate)) {
    let dateLabel;
    if (currentDate.isSame(today, 'day')) {
      dateLabel = 'Today';
    } else if (currentDate.isSame(yesterday, 'day')) {
      dateLabel = 'Yesterday';
    } else {
      dateLabel = currentDate.format('dddd, MMMM D');
    }

    const dayInvoices = sortedInvoices.filter(invoice =>
      moment(invoice.created).startOf('day').isSame(currentDate, 'day')
    );

    if (dayInvoices.length > 0 || startDate) {
      formattedData.push({
        date: dateLabel,
        invoices: dayInvoices,
      });
    }

    currentDate.subtract(1, 'day');
  }

  return formattedData;
};
