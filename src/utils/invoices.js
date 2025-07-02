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

  if (settings?.card) {
    payment_methods.push("card");
  }

  if (settings?.ach_debit) {
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
      DateTime.fromISO(b?.created_at).toMillis() -
      DateTime.fromISO(a?.created_at).toMillis()
    );
  });

  const formattedData = [];
  const today = DateTime.local().startOf("day");
  const yesterday = today.minus({ days: 1 });

  let currentDate = startDate
    ? DateTime.fromISO(startDate).startOf("day")
    : DateTime.fromISO(sortedInvoices[0].created_at).startOf("day");

  const lastDate = endDate
    ? DateTime.fromISO(endDate).startOf("day")
    : DateTime.fromISO(
        sortedInvoices[sortedInvoices.length - 1].created_at
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
      DateTime.fromISO(invoice.created_at)
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

 
// Helper function to determine overall invoice type
export function determineInvoiceType(processedLines) {
  if (!processedLines || processedLines.length === 0) {
    return "No Items";
  }

  // Separate main items and prorations
  const mainItems = processedLines.filter(line => !line.isProration);
  const prorationItems = processedLines.filter(line => line.isProration);
  
  // Check for specific proration patterns
  const hasSeatAddedProrated = prorationItems.some(item => item.type === "Seat Added (Prorated)");
  const hasSeatRemovedProrated = prorationItems.some(item => item.type === "Seat Removed (Prorated)");
  const hasPlanProrated = prorationItems.some(item => 
    item.type === "Plan Upgrade (Prorated)" || item.type === "Plan Downgrade (Prorated)"
  );

  // Check for main item patterns
  const hasSubscription = mainItems.some(item => item.type === "Subscription");
  const hasSeatCharge = mainItems.some(item => item.type === "Seat Charge");
  const hasSeatRemoved = mainItems.some(item => item.type === "Seat Removed");

  // Priority order: most specific to least specific
  
  // Pure proration cases
  if (mainItems.length === 0 && prorationItems.length > 0) {
    if (hasSeatAddedProrated && hasSeatRemovedProrated) return "Seat Changes - Prorated";
    if (hasSeatAddedProrated) return "Seat Added - Prorated";
    if (hasSeatRemovedProrated) return "Seat Removed - Prorated";
    if (hasPlanProrated) return "Plan Change - Prorated";
    return "Adjustment";
  }

  // Mixed cases (subscription + adjustments)
  if (hasSubscription) {
    if (hasSeatAddedProrated || hasSeatRemovedProrated || hasPlanProrated) {
      return "Subscription - Prorated";
    }
    if (hasSeatCharge) {
      return "Subscription";
    }
    return "Subscription";
  }

  // Seat-only cases
  if (hasSeatCharge) {
    if (hasSeatAddedProrated || hasSeatRemovedProrated) {
      return "Seat Added - Prorated";
    }
    return "Seat Added";
  }

  if (hasSeatRemoved) {
    return "Seat Removed";
  }

  // Fallback
  return "Adjustment";
}

// Helper function to group line items intelligently
export function groupLineItems(lines) {
  const mainItems = [];
  const prorationAdjustments = [];

  lines.forEach(line => {
    if (line.isProration) {
      prorationAdjustments.push(line);
    } else {
      mainItems.push(line);
    }
  });

  return { mainItems, prorationAdjustments };
}

// Helper function to create a combined description
export function createCombinedDescription(mainItems, prorationAdjustments) {
  if (mainItems.length === 0 && prorationAdjustments.length === 0) {
    return "No items";
  }

  // Handle pure proration cases (no main items, only adjustments)
  if (mainItems.length === 0 && prorationAdjustments.length > 0) {
    const totalProrationAmount = prorationAdjustments.reduce((sum, item) => sum + item.amount, 0);
    const prorationAmountFormatted = Math.abs(totalProrationAmount / 100).toFixed(2);
    
    if (totalProrationAmount < 0) {
      return `$${prorationAmountFormatted} credit applied`;
    } else if (totalProrationAmount > 0) {
      return `$${prorationAmountFormatted} prorated charge`;
    }
    return "Mid-cycle adjustment";
  }

  let description = "";

  // Handle main items
  if (mainItems.length > 0) {
    const mainDescriptions = mainItems.map(item => {
      if (item.type === "Subscription") {
        return `${item.quantity} × ${item.nickname} (at $${item.pricePerUnit}/month)`;
      } else if (item.type === "Seat Charge") {
        return `${item.quantity} × ${item.nickname} (at $${item.pricePerUnit}/month)`;
      } else if (item.type === "Seat Removed") {
        return `Seat removed from ${item.nickname}`;
      } else {
        return `${item.quantity} × ${item.nickname}`;
      }
    });
    description = mainDescriptions.join(", ");
  }

  // Handle proration adjustments (mixed with main items)
  if (prorationAdjustments.length > 0) {
    const totalProrationAmount = prorationAdjustments.reduce((sum, item) => sum + item.amount, 0);
    const prorationAmountFormatted = Math.abs(totalProrationAmount / 100).toFixed(2);
    
    if (totalProrationAmount < 0) {
      // Credit/refund
      description += ` ($${prorationAmountFormatted} credit applied)`;
    } else if (totalProrationAmount > 0) {
      // Additional charge
      description += ` (+$${prorationAmountFormatted} prorated)`;
    }
  }

  return description || "Billing adjustment";
}