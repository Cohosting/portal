// lineItemProcessor.js

// Function to process individual line items
export function processLineItem(line) {
  const metaType = line.price?.metadata?.type;
  const qty = line.quantity ?? 1;
  const amount = line.amount ?? 0;
  const isSeat = metaType === "seats" || metaType === "seat";
  const isBase = metaType === "base_plan";

  const creditedItems =
    line.parent?.subscription_item_details?.proration_details?.credited_items;

  const isTrueProration =
    line.proration === true &&
    Array.isArray(creditedItems?.invoice_line_items) &&
    creditedItems.invoice_line_items.length > 0;

  console.log({
    metaType,
    qty,
    amount,
    isSeat,
    isBase,
    isTrueProration
  });

  // Determine line item type
  const type = (() => {
    if (isSeat && isTrueProration && amount < 0) return "Seat Removed (Prorated)";
    if (isSeat && isTrueProration && amount > 0) return "Seat Added (Prorated)";
    if (isBase && isTrueProration && amount < 0) return "Plan Downgrade (Prorated)";
    if (isBase && isTrueProration && amount > 0) return "Plan Upgrade (Prorated)";
    if (isSeat && !isTrueProration && qty > 0) return "Seat Charge";
    if (isSeat && !isTrueProration && qty === 0 && amount === 0) return "Seat Removed";
    if (isBase && !isTrueProration) return "Subscription";
    return isTrueProration ? "Prorated Adjustment" : "Charge";
  })();

  const nickname =
    line.price?.nickname ||
    line.plan?.nickname ||
    line.description ||
    "Plan";

  const unitAmount = line.unit_amount ?? line.price?.unit_amount ?? 0;
  const pricePerUnit = (unitAmount / 100).toFixed(2);

  return {
    type,
    nickname,
    quantity: qty,
    unitAmount: unitAmount,
    amount: amount,
    pricePerUnit,
    isProration: isTrueProration,
    originalDescription: line.description
  };
}

// Function to filter out zero-state line items
export function shouldIncludeLineItem(line) {
  // Filter out zero-state line items (qty=0, amount=0, not a proration)
  // These represent current state, not actual billing actions
  const qty = line.quantity ?? 1;
  const amount = line.amount ?? 0;
  const isProration = line.proration === true;
  
  // Keep line items that have actual billing impact
  return !(qty === 0 && amount === 0 && !isProration);
}

// Function to process all line items for an invoice
export function processInvoiceLineItems(lines) {
  if (!Array.isArray(lines) || lines.length === 0) {
    return [];
  }

  return lines
    .filter(shouldIncludeLineItem)
    .map(processLineItem);
}