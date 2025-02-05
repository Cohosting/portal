import React from 'react'
import { SubdomainCheck } from '../../../../components/SubdomainCheck'
import Layout from '../Layout/Layout'
import CostBreakdown from '../../../../components/Invoice/CostBreakdown';
import { useParams } from 'react-router-dom';
import InvoiceStatusRenderer from '../../../../components/Invoice/InvoiceStatusRenderer';
import { getCustomerId, getStripeConnectAccountId } from '../../../../utils/invoice/invoiceUtils';
import { useInvoiceDetails } from '../../../../hooks/invoice/useInvoiceDetails';
import InvoiceAttachments from '../../../../components/Invoice/InvoiceAttachments';


const formatAddress = (address = {}) => {
    const { addressLine1, addressLine2, city, stateProvince, zipPostalCode } = address || {}
    const formattedAddress = [
        addressLine1,
        addressLine2,
        `${city}, ${stateProvince} ${zipPostalCode}`
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
    const { domain, invoice, isLoading } = useInvoiceDetails(id);
    const stripeConnectAccountId = getStripeConnectAccountId(domain);
    const customerId = getCustomerId(invoice);
    return (
        <SubdomainCheck domain={domain.name} isValid={domain.existsInDb} isLoading={isLoading}>
            <Layout>
                {/* Invoice */}
                <div className=" px-4 py-8   sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
                    <h2 className="text-base font-semibold leading-6 text-gray-900">Invoice</h2>
                    <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                        <div className="sm:pr-4">
                            <dt className="inline text-gray-500">Issued on</dt>{' '}
                            <dd className="inline text-gray-700">
                                <time dateTime="2023-23-01">January 23, 2023</time>
                            </dd>
                        </div>
                        <div className="mt-2 sm:mt-0 sm:pl-4">
                            <dt className="inline text-gray-500">Due on</dt>{' '}
                            <dd className="inline text-gray-700">
                                <time dateTime="2023-31-01">January 31, 2023</time>
                            </dd>
                        </div>
                        <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">

                            <ContactInfo
                                label="From"
                                companyName={invoice?.portal?.brand_settings?.brandName}
                                address={formatAddress(invoice?.portal?.billing_address)}
                            />
                        </div>
                        <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">

                            <ContactInfo
                                label="To"
                                companyName="Tuple, Inc"
                                address="886 Walter Street New York, NY 12345"
                            />
                        </div>
                    </dl>

                    <CostBreakdown invoice={invoice} />
                    <InvoiceStatusRenderer
                        invoice={invoice}
                        stripeConnectAccountId={stripeConnectAccountId}
                        customerId={customerId}
                    />
                    {

                        invoice?.attachments && <InvoiceAttachments attachments={invoice.attachments} />
                    }


                </div>
            </Layout>
        </SubdomainCheck>
    )
}

export default InvoiceDetails