import React from 'react'
import BillingActivityItem from './BillingActivityItem'

const BillingActivityList = ({ 
  invoices, 
  colorSettings, 
  lastInvoiceElementRef, 
  isLoadingMore 
}) => {
    return (
        <table className="w-full text-left">
            <thead className="sr-only">
                <tr>
                    <th>Amount</th>
                    <th className="hidden sm:table-cell">Client</th>
                    <th>More details</th>
                </tr>
            </thead>
            <tbody>
                {invoices.map((invoice, index) => {
                    const isLastInvoice = index === invoices.length - 1;
                    
                    return (
                        <BillingActivityItem 
                            key={invoice.id} 
                            invoice={invoice} 
                            colorSettings={colorSettings}
                            ref={isLastInvoice ? lastInvoiceElementRef : null}
                            isLastItem={isLastInvoice}
                        />
                    );
                })}
            </tbody>
        </table>
    )
}

export default BillingActivityList