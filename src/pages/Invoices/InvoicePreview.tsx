"use client"
import { Card, CardContent } from "@/components/ui/card"


function formatClientAddress(invoiceData) {
  const client = invoiceData.client;
  if (!client) {
    return "No client selected!";
  }

  const billing = client.billing_address.address;
  // if there's no billing object or no line1, treat as "no address"
  if (!billing?.line1) {
    return "No address";
  }

  // build up the street lines
  const line1 = billing.line1;
  const line2 = billing.line2 ? `, ${billing.line2}` : "";
  const street = `${line1}${line2}`;

  // city/state/zip with sensible defaults
  const city  = billing.city        || "Unknown";
  const state = billing.state       || "Unknown";
  const zip   = billing.postal_code || "Unknown";
  const cityStateZip = `${city}, ${state} ${zip}`;

  // final multi‐line block (you can join with '\n' or '<br>' as needed)
  return {
    street,
    cityStateZip
  }
}
export function InvoicePreview({ invoiceData, billingAddress }

) {

  console.log({invoiceData})
  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate totals from line items if not provided directly
  const calculateSubtotal = () => {
    if (invoiceData.subtotal) return invoiceData.subtotal;
    
    if (invoiceData.line_items && invoiceData.line_items.length > 0) {
      return invoiceData.line_items.reduce((sum, item) => {
        // Using the correct field names: unit_amount and quantity
        const unitAmount = typeof item.unit_amount === 'string' ? parseFloat(item.unit_amount) : (item.unit_amount || 0);
        const quantity = typeof item.quantity === 'string' ? parseInt(item.quantity) : (item.quantity || 0);
        return sum + (unitAmount * quantity);
      }, 0);
    }
    
    return 0;
  };

  const subtotal = calculateSubtotal();
  
  // Calculate tax based on settings or default to 10%
  const calculateTax = () => {
    if (invoiceData.tax) return invoiceData.tax;
    
    const taxRate = invoiceData.settings?.tax_percent || 10;
    return subtotal * (taxRate / 100);
  };
  
  const tax = calculateTax();
  
  // Calculate discount if available
  const discount = invoiceData.discount || 0;
  
  // Calculate total
  const calculateTotal = () => {
    if (invoiceData.total) return invoiceData.total;
    return subtotal + tax - discount;
  };
  
  const total = calculateTotal();

  // Format line_items directly without remapping fields
  const getLineItems = () => {
    if (!invoiceData.line_items || invoiceData.line_items.length === 0) {
      return [
        {
          description: "No items added",
          quantity: 0,
          unit_amount: 0,
          total: 0
        }
      ];
    }

    return invoiceData.line_items.map(item => {
      // Calculate the total for display
      const quantity = typeof item.quantity === 'string' ? parseInt(item.quantity) : (item.quantity || 0);
      const unitAmount = typeof item.unit_amount === 'string' ? parseFloat(item.unit_amount) : (item.unit_amount || 0);
      return {
        ...item,
        total: quantity * unitAmount
      };
    });
  };

  const lineItems = getLineItems();

  // Get client details
  const clientName = invoiceData.client?.name || "No client selected!";
  const clientEmail = invoiceData.client?.email || "";
 const { street, cityStateZip } = formatClientAddress(invoiceData)
  // Get company details from settings or fallback to defaults
  const companyName =  billingAddress?.company_name  || 'No Company Name';
  const companyAddress = billingAddress?.line1 || "No address";
  const companyAddress2 = billingAddress?.line2 ? `, ${billingAddress.line2}` : companyAddress;
  const city = billingAddress?.city ||  'Unknown';
  const state = billingAddress?.state || "Unknown";
  const zip = billingAddress?.postal_code || "Unknown";
  const companyCity =  `${city}, ${state} ${zip}`;
  const companyPhone = invoiceData.settings?.company_phone || "No phone";

  // Get invoice number, using prefix if available
  const invoiceNumber = 
    (invoiceData.settings?.invoice_prefix || "INV-") + 
    (invoiceData.invoice_number || "12345");

  // Format dates or use placeholders
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  const dateIssued = formatDate(invoiceData.date_issued) || "May 7, 2025";
  
  // Calculate due date based on settings if not directly provided
  const calculateDueDate = () => {
    if (invoiceData.due_date) return formatDate(invoiceData.due_date);
    
    const daysToAdd = invoiceData.settings?.payment_terms || 14;
    if (invoiceData.date_issued) {
      const dueDate = new Date(invoiceData.date_issued);
      dueDate.setDate(dueDate.getDate() + daysToAdd);
      return formatDate(dueDate);
    }
    
    return "May 21, 2025"; // Default fallback
  };
  
  const dueDate = calculateDueDate();

  return (
    <div className="h-full">
      <Card className="border shadow-sm h-[calc(100%-3rem)] overflow-auto">
        <CardContent className="p-4 sm:p-6 md:p-8">
          {/* Header section */}
          <div className="flex justify-between items-start mb-4 sm:mb-6 md:mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{invoiceData.title || "Invoice"}</h1>
              <p className="text-gray-600 text-xs sm:text-sm">Invoice Number #{invoiceNumber}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-600 rounded flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5 sm:gap-1">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm"></div>
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm"></div>
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm"></div>
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Billing information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Billed By:</h3>
              <p className="text-sm sm:text-base font-medium">{companyName}</p>
              
              <p className="text-xs sm:text-sm text-gray-600">{companyAddress2} 
            
                 </p>
               <p className="text-xs sm:text-sm text-gray-600">{companyCity}</p>
            </div>
            <div className="mt-3 sm:mt-0">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Billed To:</h3>
              <p className="text-sm sm:text-base font-medium">{clientName}</p>
              <p className="text-xs sm:text-sm text-gray-600">{clientEmail}</p>
              <p className="text-xs sm:text-sm text-gray-600">{street}</p>
              <p className="text-xs sm:text-sm text-gray-600">{cityStateZip}</p>
            </div>
          </div>

          {/* Date information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Date Issued:</h3>
              <p className="text-sm sm:text-base font-medium">{dateIssued}</p>
            </div>
            <div className="mt-3 sm:mt-0">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Due Date:</h3>
              <p className="text-sm sm:text-base font-medium">{dueDate}</p>
            </div>
          </div>

          {/* Invoice details */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 sm:mb-4">Invoice Details</h3>
            <div className="overflow-x-auto sm:mx-0">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1 sm:py-2 text-xs sm:text-sm font-medium">Item/Service</th>
                    <th className="text-center py-1 sm:py-2 text-xs sm:text-sm font-medium">Qty</th>
                    <th className="text-right py-1 sm:py-2 text-xs sm:text-sm font-medium">Unit Price</th>
                    <th className="text-right py-1 sm:py-2 text-xs sm:text-sm font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 sm:py-3 text-xs sm:text-sm">{item.description || item.name || "Unnamed Item"}</td>
                      <td className="py-2 sm:py-3 text-xs sm:text-sm text-center">{item.quantity}</td>
                      <td className="py-2 sm:py-3 text-xs sm:text-sm text-right">{formatCurrency(item.unit_amount)}</td>
                      <td className="py-2 sm:py-3 text-xs sm:text-sm text-right">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals section */}
          <div className="flex justify-end mb-4 sm:mb-6 md:mb-8">
            <div className="w-full sm:w-1/2 md:w-1/3">
              <div className="flex justify-between py-1 sm:py-2 text-xs sm:text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between py-1 sm:py-2 text-xs sm:text-sm">
                <span className="text-gray-600">Tax ({invoiceData.settings?.tax_percent || 10}%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between py-1 sm:py-2 text-xs sm:text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between py-1 sm:py-2 text-sm sm:text-base font-medium border-t mt-1 sm:mt-2 pt-1 sm:pt-2">
                <span>Grand Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Notes section */}
          <div className="border-t pt-3 sm:pt-4 md:pt-6 mt-3 sm:mt-4 md:mt-6">
            <h3 className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">Notes</h3>
            {invoiceData.memo ? (
              <p className="text-xs sm:text-sm text-gray-600">{invoiceData.memo}</p>
            ) : (
              <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-sm text-gray-600 space-y-0.5 sm:space-y-1">
                <li>Payment is due by {dueDate}.</li>
                <li>Please include the invoice number in the payment reference to ensure accurate processing.</li>
              </ul>
            )}
          </div>

          {/* Footer */}
          {/* <div className="mt-4 sm:mt-6 md:mt-8 pt-3 sm:pt-4 md:pt-6 border-t">
            <p className="text-sm sm:text-base font-medium">{companyName}</p>
            <p className="text-xs sm:text-sm text-gray-600">{companyPhone}</p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  )
}