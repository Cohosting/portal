import React from 'react'
import { returnStyleBasedOnStatus } from './../../utils/statusStyles'
import { calculateTotal } from '../../utils/invoices'
import SectionHeader from '../SectionHeader'
import { useNavigate } from 'react-router-dom'
const InvoiceTable = ({
    invoices = []
}) => {
    const navigate = useNavigate()
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
                                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                            Edit<span className="sr-only">, {invoice.name}</span>
                                        </a>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default InvoiceTable