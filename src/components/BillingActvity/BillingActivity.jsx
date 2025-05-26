import React from 'react'
import BillingActivityList from './BillingActivityList'
import { Spinner } from '@phosphor-icons/react'

const BillingActivity = ({ groupedInvoices, isLoading, colorSettings }) => {

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spinner className=" animate-spin w-12 h-12 text-primary" />
            </div>
        )
    }

    if (!groupedInvoices.length) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-lg text-gray-500">No invoices found</p>
            </div>
        )
    }
    return (
        <div>
            <div className="mt-6 overflow-hidden border-t border-groupedInvoicesray-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                        <BillingActivityList colorSettings={colorSettings} groupedInvoices={groupedInvoices} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BillingActivity