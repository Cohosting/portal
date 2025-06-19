import React from 'react'
import { SubdomainCheck } from '../../../../components/SubdomainCheck'
import Layout from '../Layout/Layout'
import CostBreakdown from '../../../../components/Invoice/CostBreakdown';
import { useParams } from 'react-router-dom';
import InvoiceStatusRenderer from '../../../../components/Invoice/InvoiceStatusRenderer';
import { getCustomerId, getStripeConnectAccountId } from '../../../../utils/invoice/invoiceUtils';
import { useInvoiceDetails } from '../../../../hooks/invoice/useInvoiceDetails';
import InvoiceAttachments from '../../../../components/Invoice/InvoiceAttachments';
import PageHeader from '../components/PageHeader';
import PortalLoadingSkeleton from '../components/PortalLoadingSkeleton';
import { defaultBrandSettings, getComputedColors } from '@/utils/colorUtils';
import { useCallback } from 'react';

const formateDate = (dateString) => {
 
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};


const formatAddress = (address = {}) => {
    const { line1, line2, city, state, postal_code } = address || {}
    const formattedAddress = [
        line1,
        line2,
        `${city}, ${state} ${postal_code}`
    ]
        .filter(Boolean)
        .join(', ');

    return formattedAddress;
};

const ContactInfo = ({
    label, companyName, address
}) => {
    return (
        <>
            <dt className="font-semibold text-gray-900">{label}</dt>
            <dd className="mt-2 text-gray-500">
                <span className="font-medium text-gray-900">{companyName}</span>
                <br />
                {address}
            </dd>
        </>
    )
}


const InvoiceDetails = () => {
    const { id } = useParams();
    const {  invoice, isLoading } = useInvoiceDetails(id);
    const stripeConnectAccountId = invoice?.portal?.stripe_connect_account_id  
    const customerId = getCustomerId(invoice);
    let portal = invoice?.portal || {}
    let brandSettings = portal?.brand_settings || defaultBrandSettings;
    const computedColors = useCallback(getComputedColors(brandSettings), [brandSettings]);
     if(!invoice && isLoading) return (
        <div>
                    <div className="h-[64px] border-b border-gray-200 px-6 flex flex-col justify-center">
          <div className="w-64 h-5 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="w-96 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        </div>
    )
    return (
            <div>
                <PageHeader
                    title="Invoice Details"
                    description="Review detailed information about this invoice, including payment status, due dates, and cost breakdown."
                 />
                {/* Invoice */}
                {/* <div className=" px-4 py-8   sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16"> */}
                <div className='        sm:mx-0 sm:rounded-lg   sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2  xl:pb-20  '>
                     <div className="mt-6  grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                        <div className="sm:pr-4 pl-6">
                            <dt className="inline text-gray-500">Issued on</dt>{' '}
                            <dd className="inline text-gray-700">
                                <time dateTime="2023-23-01">{formateDate(invoice?.created_at)}</time>
                            </dd>
                        </div>
                        <div className="mt-2 sm:mt-0 max-sm:pl-6">
                            <dt className="inline text-gray-500">Due on</dt>{' '}
                            <dd className="inline text-gray-700">
                                <time dateTime="2023-31-01">{formateDate(invoice?.due_date)}</time>
                            </dd>
                        </div>
                        <div className="mt-6 pl-6 border-t border-gray-900/5 pt-6 sm:pr-4">

                            <ContactInfo
                                label="From"
                                companyName={brandSettings?.brandName}
                                address={formatAddress(invoice?.billing_addresses?.from)}
                            />
                        </div>
                        <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 max-sm:pl-6 sm:pt-6">

                            <ContactInfo
                                label="To"
                                companyName={invoice?.client?.name}
                                address={formatAddress(invoice?.billing_addresses?.to)}
                            />
                        </div>
                    </div>

                    <CostBreakdown invoice={invoice} />
                    <InvoiceStatusRenderer
                        invoice={invoice}
                        stripeConnectAccountId={stripeConnectAccountId}
                        customerId={customerId}
                        colorSettings={computedColors} 
                    />
                    {

                        invoice?.attachments && <InvoiceAttachments attachments={invoice.attachments} />
                    }


                </div>
            </div>
    )
}

export default InvoiceDetails