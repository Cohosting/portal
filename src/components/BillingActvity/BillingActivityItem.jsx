import { useNavigate } from 'react-router-dom';
import { calculateTotal } from '../../utils/invoices';
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

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const capitalized = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};

const BillingActivityItem = ({ invoice, colorSettings }) => {
    const IconComponent = statusesIcons[invoice.status.toLowerCase()] || 'clock'
    const navigate = useNavigate();

    return (
        <tr>
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
                  </div>
              </div>
              <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
              <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
          </td>
          <td className="hidden py-5 pr-6 sm:table-cell">
              <div className="text-sm leading-6 text-gray-900">{invoice.title || 'Demo title'}</div>
              <div className="mt-1 text-xs leading-5 text-gray-500">{invoice.description || 'Demo description '}</div>
          </td>
          <td className="py-5 text-right">
              <div className="flex justify-end">
                  <button
                      className="text-sm font-bold leading-6"
                      style={{
                          color: colorSettings?.sidebarBgColor,
                      }}
                      onClick={() => navigate(`/portal/billings/${invoice.id}`)}
                  >
                      View<span className="hidden sm:inline"> transaction</span>
                      <span className="sr-only">
                          , invoice #{invoice.invoice_number}, {invoice.client}
                      </span>
                  </button>
              </div>
              <div className="mt-1 text-xs leading-5 text-gray-500">
                  Invoice <span className="text-gray-900">#{invoice.invoice_number}</span>
              </div>
          </td>
      </tr>
    );
};

export default BillingActivityItem;
