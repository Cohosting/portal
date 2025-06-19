import React from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateTotal } from '../../utils/invoices';
import { DateTime } from 'luxon';
import { Button } from '@/components/ui/button';
import {
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    RotateCcw,
} from 'lucide-react';

const statuses = {
    Paid: 'text-green-700 bg-green-50 ring-green-600/20',
    Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
    Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
    Open: 'text-yellow-700 bg-yellow-50 ring-yellow-600/10',
    Processing: 'text-blue-700 bg-blue-50 ring-blue-600/10',
    Draft: 'text-gray-600 bg-gray-50 ring-gray-500/10',
};

const statusesIcons = {
    open: Clock,
    paid: CheckCircle,
    processing: Clock,
    overdue: AlertCircle,
    canceled: XCircle,
    draft: RotateCcw,
};

const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number);
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return DateTime.fromISO(dateString).toFormat('MMM dd, yyyy');
};

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const capitalized = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};

// Helper function to truncate text with ellipsis
const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

  /**
   * A single item in the billing activity table.
   *
   * @param {Object} props
   * @prop {Object} invoice - The invoice object.
   * @prop {Object} colorSettings - The color settings object.
   * @prop {Boolean} isLastItem - Whether this is the last item in the list.
   * @param {Object} ref - The ref object.
   *
   * @returns {ReactElement} The table row element.
   */
const BillingActivityItem = React.forwardRef(({ invoice, colorSettings, isLastItem }, ref) => {
    const IconComponent = statusesIcons[invoice.status.toLowerCase()] || Clock;
    const navigate = useNavigate();
    const {
        primaryButtonColor,
        primaryButtonTextColor,
        primaryButtonHoverColor,
    } = colorSettings;

    return (
        <tr ref={isLastItem ? ref : null}>
            <td className="relative py-5 pr-6">
                <div className="flex gap-x-6">
                    <IconComponent
                        aria-hidden="true"
                        className="hidden h-6 w-5 flex-none text-gray-400 sm:block"
                    />
                    <div className="flex-auto">
                        <div className="flex items-start gap-x-3">
                            <div className="text-sm font-medium leading-6 text-gray-900">
                                ${formatNumber(calculateTotal(invoice.line_items))} USD
                            </div>
                            <div
                                className={classNames(
                                    statuses[capitalized(invoice.status)],
                                    'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
                                )}
                            >
                                {invoice.status}
                            </div>
                        </div>
                        {invoice.tax && (
                            <div className="mt-1 text-xs leading-5 text-gray-500">
                                {invoice?.tax} tax
                            </div>
                        )}
                        <div className="mt-2 flex gap-4 text-xs text-gray-500">
                            <div>
                                <span className="font-medium">Created:</span> {formatDate(invoice.created_at)}
                            </div>
                            <div>
                                <span className="font-medium">Due:</span> {formatDate(invoice.due_date)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
            </td>
            <td className="hidden py-5 pr-6 sm:table-cell">
                <div className="text-sm leading-6 text-gray-900 break-words">
                    {invoice.title || 'Demo title'}
                </div>
                <div className="mt-1 text-xs leading-5 text-gray-500 break-words max-w-xs">
                    {truncateText(invoice.description || 'Demo description', 120)}
                </div>
            </td>
            <td className="py-5 text-right">
                <div className="flex justify-end">
                    <Button
                    style={{
                        backgroundColor: primaryButtonColor,
                        color: primaryButtonTextColor
                    }}
                        onClick={() => navigate(`/portal/billings/${invoice.id}`)}
                        size="sm"
                        className="font-medium"
                    >
                        View<span className="hidden sm:inline"> transaction</span>
                        <span className="sr-only">
                            , invoice {invoice.invoice_number}, {invoice.client}
                        </span>
                    </Button>
                </div>
                <div className="mt-1 text-xs leading-5 text-gray-500">
                    Invoice <span className="text-gray-900">{invoice.invoice_number}</span>
                </div>
            </td>
        </tr>
    );
});

BillingActivityItem.displayName = 'BillingActivityItem';

export default BillingActivityItem;