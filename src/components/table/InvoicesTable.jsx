import React, { useState } from 'react'
import { returnStyleBasedOnStatus } from './../../utils/statusStyles'
import { calculateTotal } from '../../utils/invoices'
import SectionHeader from '../SectionHeader'
import { useNavigate } from 'react-router-dom'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ArrowDownOnSquareIcon, CheckBadgeIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import axiosInstance from '../../api/axiosConfig'
import { toast } from 'react-toastify'
import AlertDialog from '../Modal/AlertDialog'
import { supabase } from '../../lib/supabase'
const InvoiceTable = ({
    invoices = [],
    stripe_connect_account_id
}) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isVoidOpen, setIsVoidOpen] = useState(false);

    const handleInvoiceFinalized = async (invoice) => {
        const { line_items, settings, id, memo, clients } = invoice;
        const { customer_id } = clients;

        const invoiceFinalizedPromise = axiosInstance.post('/stripe/connect/invoice', {
            line_items,
            customer_id,
            settings,
            memo,
            invoice_id: id,
            stripe_connect_account_id

        })

        const { data } = await toast.promise(invoiceFinalizedPromise, {
            pending: 'Finalizing invoice',
            success: 'Invoice finalized',
            error: 'Invoice finalizing failed!'
        })


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
            const deleteInvoicePromise = supabase.from('invoices').delete().eq('id', id)
            await toast.promise(deleteInvoicePromise, {
                pending: 'Deleting invoice',
                success: 'Invoice deleted',
                error: 'Invoice deleting failed!'
            })
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
            })

            await toast.promise(voidInvoicePromise, {
                pending: 'Voiding invoice',
                success: 'Invoice voided',
                error: 'Invoice voiding failed!'
            })
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

    return (
        <div  >
            <SectionHeader
                heading="Invoices"
                description="Here you can see all the invoices you have sent to your clients. You can also edit or finalize them."
                buttonText="Create new invoice"
                onClick={() => navigate('add')}
            />

            <div className="-mx-4 mt-8 sm:-mx-0">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                Recipents
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
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {invoices.map((invoice) => {
                            const client = invoice?.client
                            return (
                                <tr key={invoice.email}>
                                    <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                                        {invoice.name}
                                        <div className="mt-1 text-gray-500">{client?.email}</div>

                                        <dl className="font-normal lg:hidden">
                                            <div className='flex items-center mt-2 ' >
                                                <dt className="sr-only">Title</dt>
                                                <p className='text-sm text-gray-500 font-semibold '>Total: &nbsp;</p>

                                                <dd className="font-normal  truncate text-green-500">{calculateTotal(invoice?.line_items)}$</dd>
                                            </div>
                                            <dt className="sr-only sm:hidden">Invoice ID</dt>
                                            <div className=' sm:hidden'>
                                                <p className='mt-2 text-sm text-gray-500 font-semibold'>Invoice id:</p>
                                                <dd className=" truncate text-gray-500">{invoice.invoice_number}</dd>
                                            </div>

                                        </dl>
                                    </td>
                                    <td className="hidden px-3 py-4 text-sm text-green-500 lg:table-cell font-normal ">{calculateTotal(invoice.line_items)}$</td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{invoice.invoice_number}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        <span className={`inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium  ${returnStyleBasedOnStatus(invoice.status)}`}>
                                            {invoice.status}
                                        </span>

                                    </td>
                                    <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                        {
                                            invoice.status !== 'void' && (
                                                <Menu as="div" className="relative flex-none">
                                            <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                                                <span className="sr-only">Open options</span>
                                                <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
                                            </MenuButton>
                                            <MenuItems
                                                transition
                                                className="absolute space-y-1 right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                            >
                                                        {
                                                            invoice.status === 'draft' && (

                                                <MenuItem>
                                                                    <button onClick={() => navigate(`edit?id=${invoice.id}`)} className="w-full text-left flex items-center px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50">

                                                        <PencilIcon className="h-5 w-5 text-blue-500 mr-2" />
                                                        Edit<span className="sr-only">, {/* {project.name} */}</span>
                                                    </button>
                                                                </MenuItem>)
                                                        }
                                                        {
                                                            invoice.status === 'draft' && (
                                                                <MenuItem>

                                                                    <button onClick={() => handleDeleteInvoice(invoice)} className=" flex items-center w-full text-left  px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50">
                                                                        <TrashIcon className="h-5 text-red-500 w-5 mr-2" />
                                                                        Delete<span className="sr-only">, {/* {project.name} */}</span>
                                                                    </button>
                                                                </MenuItem>
                                                            )
                                                        }

                                                        {
                                                            invoice.status === 'draft' && (

                                                <MenuItem>
                                                    <button onClick={() => handleInvoiceFinalized(invoice)} className="w-full text-left flex items-center px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50">

                                                        <CheckBadgeIcon className="h-5 w-5 text-green-500 mr-2" />
                                                        Finalised<span className="sr-only">, {/* {project.name} */}</span>
                                                    </button>
                                                                </MenuItem>)
                                                        }
                                                        {
                                                            invoice.status === 'open' && (
                                                                <MenuItem>
                                                                    {/* Void button */}
                                                                    <button onClick={() => handleVoidInvoice(invoice)} className="w-full text-left flex items-center px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50">
                                                                        <XMarkIcon className="h-5 w-5 text-red-500 mr-2" />
                                                                        Void<span className="sr-only">, {/* {project.name} */}</span>
                                                                    </button>
                                                                </MenuItem>

                                                            )
                                                        }
                                                        {
                                                            invoice.status === 'paid' && (
                                                                <MenuItem>
                                                                    {/* download invoice button */}
                                                                    <button className="w-full text-left flex items-center px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50">
                                                                        <ArrowDownOnSquareIcon className="h-5 w-5 text-blue-500 mr-2" />
                                                                        Download
                                                                    </button>
                                                                </MenuItem>
                                                            )
                                                        }




                                            </MenuItems>
                                        </Menu>
                                            )
                                        }

                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <AlertDialog
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={onConfirm}
                title="Delete Invoice"
                message="Are you sure you want to delete this invoice?"
                confirmButtonText="Delete"
                confirmButtonColor="bg-red-500"

            />
            <AlertDialog
                isOpen={isVoidOpen}
                onClose={onVoidClose}
                onConfirm={onVoidConfirm}
                title="Void Invoice"
                message="Are you sure you want to void this invoice?"
                confirmButtonText="Void"
                confirmButtonColor="bg-red-500"

            />
        </div>

    )
}

export default InvoiceTable