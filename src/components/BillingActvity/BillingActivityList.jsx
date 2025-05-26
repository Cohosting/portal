import React, { Fragment } from 'react'
import BillingActivityItem from './BillingActivityItem'

const BillingActivityList = ({ groupedInvoices, colorSettings }) => {
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
                {groupedInvoices.map((groupInvoice) => (
                    <Fragment key={groupInvoice.date}>
                        <tr className="text-sm leading-6 text-gray-900">
                            <th scope="colgroup" colSpan={3} className="relative isolate py-2 font-semibold">
                                <time dateTime={groupInvoice.date}>{groupInvoice.date}</time>
                                <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-gray-200 bg-gray-50" />
                                <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-gray-200 bg-gray-50" />
                            </th>
                        </tr>
                        {groupInvoice.invoices.map((invoice) => (
                            <BillingActivityItem colorSettings={colorSettings} key={invoice.id} invoice={invoice} />
                        ))}
                    </Fragment>
                ))}
            </tbody>
        </table>
    )
}

export default BillingActivityList