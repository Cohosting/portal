import React from 'react';
import useSubscriptionBillingHistory from '../../../hooks/react-query/useSubscriptionBillingHistory';
import { Download } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const statusStyles = {
        paid: "text-green-600 bg-green-100",
        pending: "text-yellow-600 bg-yellow-100",
        failed: "text-red-600 bg-red-100",
        refunded: "text-blue-600 bg-blue-100",
        default: "text-gray-600 bg-gray-100"
    };

    const style = statusStyles[status.toLowerCase()] || statusStyles.default;

    return (
        <span className={`${style} py-1 px-3 rounded-full text-xs`}>
            {status}
        </span>
    );
};

const BillingHistory = ({ subscription }) => {
    const { data: invoices, isLoading } = useSubscriptionBillingHistory(subscription?.stripe_subscription_id);

    return (
        <div className="py-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Billing History</h2>
            <p className="text-sm text-gray-500 mb-6">See and download invoices</p>

            <div className="overflow-x-auto shadow-sm border rounded-lg">
                <table className="min-w-full bg-white text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="py-3 px-4 text-left font-medium">Invoice</th>
                            <th className="py-3 px-4 text-left font-medium hidden md:table-cell">Date</th>
                            <th className="py-3 px-4 text-left font-medium hidden sm:table-cell">Status</th>
                            <th className="py-3 px-4 text-right font-medium">Amount</th>
                            <th className="py-3 px-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan="5" className="text-center py-4">
                                    Loading...
                                </td>
                            </tr>
                        )}
                        {!isLoading && invoices.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-4">
                                    No invoices found
                                </td>
                            </tr>
                        )}
                        {invoices?.map((invoice) => (
                            <tr key={invoice.invoiceId} className="border-t hover:bg-gray-50 transition">
                                <td className="py-4 px-4">
                                    <div className="flex flex-col space-y-3 md:space-y-0">
                                        <div className="text-gray-700 font-medium">{invoice.invoiceNumber}</div>
                                        <div className="text-gray-500 text-xs md:hidden">Date: {invoice.date}</div>
                                        <div className="sm:hidden">
                                            Status: <StatusBadge status={invoice.status} />
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4 hidden md:table-cell text-gray-600">{invoice.date}</td>
                                <td className="py-4 px-4 hidden sm:table-cell">
                                    <StatusBadge status={invoice.status} />
                                </td>
                                <td className="py-4 px-4 text-right text-gray-700 font-medium">${invoice.amount}</td>
                                <td className="py-4 px-4 text-right">
                                    <button onClick={() => window.open(invoice.pdfUrl, '_blank')} className="text-blue-500 hover:text-blue-600 transition">
                                        <Download size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BillingHistory;