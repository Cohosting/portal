import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { returnStyleBasedOnStatus } from './../../utils/statusStyles';
import { calculateTotal } from '../../utils/invoices';
import axiosInstance from '../../api/axiosConfig';
import { supabase } from '../../lib/supabase';
import AlertDialog from '@/components/Modal/AlertDialog';
import {
  Download,
  BadgeCheck,
  Pencil,
  Trash2,
  X,
  EllipsisVerticalIcon
} from 'lucide-react';
import { Loader } from 'lucide-react';

const InvoiceTable = ({
  invoices = [],
  stripe_connect_account_id,
  portal,
  lastInvoiceElementRef,
  isLoadingMore = false
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoidOpen, setIsVoidOpen] = useState(false);

  const showStripeConnectionToast = () => {
    return toast.custom(
      (t) => (
        <div className="flex items-start gap-3 p-4 bg-white border border-red-200 rounded-lg shadow-lg w-full max-w-md">
          <X className="w-5 h-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <div className="font-medium text-gray-900">Stripe Account Required</div>
            <div className="text-sm text-gray-600 mt-1">
              Connect your Stripe account to finalize invoices
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                className='bg-gray-800 text-white'
                size="sm"
                onClick={() => {
                  navigate('/settings/portal');
                  toast.dismiss(t.id);
                }}
              >
                Go to Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.dismiss(t.id)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        dismissible: true,
      }
    );
  };

  const showClientSyncToast = (clientId, clientName) => {
    return toast.custom(
      (t) => (
        <div className="flex items-start gap-3 p-4 bg-white border border-red-200 rounded-lg shadow-lg w-full max-w-md">
          <X className="w-5 h-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <div className="font-medium text-gray-900">Client Not Synced</div>
            <div className="text-sm text-gray-600 mt-1">
              {clientName} is not synced with your Stripe account
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                className='bg-gray-800 text-white'
                onClick={() => {
                  navigate(`/clients`);
                  toast.dismiss(t.id);
                }}
              >
                Go to Clients
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.dismiss(t.id)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        dismissible: true,
      }
    );
  };

  const handleInvoiceFinalized = async (invoice) => {
    const { line_items, settings, id, memo, client } = invoice;
    const { customer_id } = client;

    // First check if portal has Stripe account connected
    if (!stripe_connect_account_id) {
      showStripeConnectionToast();
      return;
    }

    // Then check if customer is synced with Stripe
    if (!customer_id) {
      showClientSyncToast(client.id, client.name);
      return;
    }

    const invoiceFinalizedPromise = axiosInstance.post('/stripe/connect/invoice', {
      line_items,
      customer_id,
      settings,
      memo,
      invoice_id: id,
      stripe_connect_account_id,
      due_date: invoice.due_date
    });

    const { data } = await toast.promise(invoiceFinalizedPromise, {
      pending: 'Finalizing invoice',
      success: 'Invoice finalized',
      error: 'Invoice finalizing failed!'
    });
  };

  const handleDeleteInvoice = (invoice) => {
    setInvoiceToDelete(invoice);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const onConfirm = async () => {
    setIsLoading(true);
    try {
      const invoice = invoiceToDelete;
      const { id } = invoice;
      const deleteInvoicePromise = supabase.from('invoices').delete().eq('id', id);
      
      await toast.promise(deleteInvoicePromise, {
        pending: 'Deleting invoice',
        success: 'Invoice deleted',
        error: 'Invoice deleting failed!'
      });
      
      setIsLoading(false);
      setInvoiceToDelete(null);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onVoidClose = () => {
    setIsVoidOpen(false);
  };

  const onVoidConfirm = async () => {
    setIsLoading(true);
    try {
      const invoice = invoiceToDelete;
      const { stripe_invoice_id } = invoice;

      const voidInvoicePromise = axiosInstance.post('/stripe/connect/invoice/void', {
        stripe_invoice_id,
        stripe_connect_account_id
      });
      
      let invoiceNumberLast4Digit = invoiceToDelete.invoice_number.slice(-4);
      let clientName = invoiceToDelete.client.name;
      
      await toast.promise(voidInvoicePromise, {
        pending: 'Voiding invoice',
        success: 'Invoice voided',
        error: 'Invoice voiding failed!'
      }).then(async () => {
        const { data, error } = await supabase.from("recent_activities").insert([
          {
            title: `Invoice #${invoiceNumberLast4Digit} from "${clientName}" Voided`,
            additional_data: { stripe_invoice_id, status: "void" },
            portal_id: portal.id,
            client_id: invoice.client.id,
            invoice_id: invoice.id,
          },
        ]);
        
        if (error) {
          console.error('Error inserting recent activity:', error);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsVoidOpen(false);
    }
  };

  const handleVoidInvoice = (invoice) => {
    setIsVoidOpen(true);
    setInvoiceToDelete(invoice);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    return (
      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${returnStyleBasedOnStatus(status)}`}>
        {status}
      </span>
    );
  };

  return (
    <>
      <div className="relative">
        <div className="sm:-mx-0">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="border-b border-gray-200">
              <tr>
                <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">
                  Recipients
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Invoice Number
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {invoices.map((invoice, index) => {
                const client = invoice?.client;
                const isLastInvoice = index === invoices.length - 1;
                const isExternal = invoice.is_external;
                
                return (
                  <tr 
                    key={invoice.id} 
                    className="hover:bg-gray-50"
                    ref={isLastInvoice ? lastInvoiceElementRef : null}
                  >
                    <td className="w-full max-w-0 py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none">
                      {client.name}
                      <div className="mt-1 text-gray-500">{client?.email}</div>
                      
                      {/* Mobile-only information that stacks */}
                      <dl className="font-normal lg:hidden">
                        <div className="flex items-center mt-2">
                          <dt className="sr-only">Amount</dt>
                          <p className="text-sm text-gray-500 font-semibold">Total: &nbsp;</p>
                          <dd className="font-normal truncate text-green-500">{calculateTotal(invoice?.line_items)}$</dd>
                        </div>
                        <dt className="sr-only sm:hidden">Invoice ID</dt>
                        <div className="sm:hidden">
                          <p className="mt-2 text-sm text-gray-500 font-semibold">Invoice id:</p>
                          <dd className="truncate text-gray-500">#{invoice.invoice_number}</dd>
                        </div>
                      </dl>
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-green-500 lg:table-cell font-normal">
                      {calculateTotal(invoice.line_items)}$
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                     {invoice.invoice_number}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      {invoice.status !== 'void' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                            <span className="sr-only">Open options</span>
                            <EllipsisVerticalIcon className="h-5 w-5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32 bg-white p-0">
                            {/* Edit button - show for external invoices regardless of status, or for draft non-external invoices */}
                            {(isExternal || invoice.status === 'draft') && (
                              <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 w-full px-0">
                                <button 
                                  onClick={() => navigate(`edit?id=${invoice.id}`)} 
                                  className="w-full text-left flex items-center px-3 text-sm leading-6 text-gray-900"
                                >
                                  <Pencil className="h-5 w-5 text-blue-500 mr-2" />
                                  Edit
                                </button>
                              </DropdownMenuItem>
                            )}
                            
                            {/* Delete button - only for draft status */}
                            {/* {invoice.status === 'draft' && (
                              <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 w-full px-0">
                                <button 
                                  onClick={() => handleDeleteInvoice(invoice)} 
                                  className="w-full text-left flex items-center px-3 text-sm leading-6 text-gray-900"
                                >
                                  <Trash2 className="h-5 w-5 text-red-500 mr-2" />
                                  Delete
                                </button>
                              </DropdownMenuItem>
                            )}
                             */}
                            {/* Finalize button - only for draft status and non-external invoices */}
                            {invoice.status === 'draft' && !isExternal && (
                              <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 w-full px-0">
                                <button 
                                  onClick={() => handleInvoiceFinalized(invoice)} 
                                  className="w-full text-left flex items-center px-3 text-sm leading-6 text-gray-900"
                                >
                                  <BadgeCheck className="h-5 w-5 text-green-500 mr-2" />
                                  Finalize
                                </button>
                              </DropdownMenuItem>
                            )}
                            
                            {/* Void button - only for open status and non-external invoices */}
                            {invoice.status === 'open' && !isExternal && (
                              <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 w-full px-0">
                                <button 
                                  onClick={() => handleVoidInvoice(invoice)} 
                                  className="w-full text-left flex items-center px-3 text-sm leading-6 text-gray-900"
                                >
                                  <X className="h-5 w-5 text-red-500 mr-2" />
                                  Void
                                </button>
                              </DropdownMenuItem>
                            )}
                            
                            {/* Download button - only for paid status */}
                            {invoice.status === 'paid' && (
                              <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 w-full px-0">
                                <button 
                                  onClick={() => window.open(invoice.invoice_pdf, "_blank", "noopener,noreferrer")} 
                                  className="w-full text-left flex items-center px-3 text-sm leading-6 text-gray-900"
                                >
                                  <Download className="h-5 w-5 text-blue-500 mr-2" />
                                  Download
                                </button>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Loading overlay when fetching more data */}
        {isLoadingMore && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none">
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Loading...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alert Dialog for Delete Confirmation */}
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice?"
        confirmButtonText="Delete"
        confirmButtonColor="bg-red-500"
      />

      {/* Alert Dialog for Void Confirmation */}
      <AlertDialog
        isOpen={isVoidOpen}
        onClose={onVoidClose}
        onConfirm={onVoidConfirm}
        title="Void Invoice"
        message="Are you sure you want to void this invoice?"
        confirmButtonText="Void"
        confirmButtonColor="bg-red-500"
      />
    </>
  );
};

export default InvoiceTable;