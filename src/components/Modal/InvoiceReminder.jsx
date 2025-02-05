import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Dialog, DialogBackdrop, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { MagnifyingGlass, Mailbox, Spinner } from '@phosphor-icons/react'
import { useSelector } from 'react-redux'
import useOpenInvoice from '../../hooks/react-query/useOpenInvoice'
import { sendInvoiceReminder, sendInvoiceReminderInBatch } from '../../services/invoiceService'
import moment from 'moment'
import { toast } from 'react-toastify'

import { XMarkIcon } from '@heroicons/react/20/solid'

const InvoiceReminder = ({ isOpen, setIsOpen, portal }) => {
    const { currentSelectedPortal } = useSelector(state => state.auth)
    const { data: openInvoices, isLoading } = useOpenInvoice(currentSelectedPortal)
    const [sendingStates, setSendingStates] = useState({})
    const [selectedInvoices, setSelectedInvoices] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredInvoices, setFilteredInvoices] = useState([])
    const [isBatchSending, setIsBatchSending] = useState(false)
    const modalRef = useRef(null)

    const sendReminder = async (invoice) => {
        let invoiceId = invoice.id
        if (isBatchSending) return
        setSendingStates(prev => ({ ...prev, [invoiceId]: true }))
        // Simulate API call
        await sendInvoiceReminder({
            ...invoice,
            brand_settings: portal.brand_settings,
        }, invoice.client.email)
        setSendingStates(prev => ({ ...prev, [invoiceId]: false }))
        // Toast functionality would need to be implemented separately
        console.log(`Reminder sent for invoice #${invoiceId}`)
    }

    const sendBatchReminders = async () => {
        setIsBatchSending(true)
        let invoices = openInvoices.filter(invoice => selectedInvoices.includes(invoice.id)).map(invoice => ({
            ...invoice,
            brand_settings: portal.brand_settings
        }))

        try {
            await sendInvoiceReminderInBatch(invoices)
            // Toast functionality would need to be implemented separately
            toast.success('Batch reminders sent successfully')

        } catch (error) {
            console.error('Error sending batch reminders:', error)
            // Toast functionality would need to be implemented separately
            toast.error('Error sending batch reminders')
        } finally {
            setIsBatchSending(false)
            setSelectedInvoices([]);
            setIsOpen(false)


        }


    }

    const toggleInvoiceSelection = (invoiceId) => {
        if (isBatchSending) return
        setSelectedInvoices(prev =>
            prev.includes(invoiceId)
                ? prev.filter(id => id !== invoiceId)
                : [...prev, invoiceId]
        )
    }

    useEffect(() => {
        if (openInvoices?.length > 0) {
            const filteredInvoices = openInvoices.filter(invoice =>
                invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                invoice.amount.toString().includes(searchTerm)
            );
            setFilteredInvoices(filteredInvoices);
        }
    }, [openInvoices, searchTerm])

    useEffect(() => {
        const handleClickOutside = (event) => {
            console.log(modalRef.current, event.target)
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                console.log('handle click')
                if (!isBatchSending) {
                    setIsOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsOpen, isBatchSending]);


    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-[100] overflow-y-auto"
                onClose={() => !isBatchSending && setIsOpen(false)}
            >
                <div className="min-h-screen px-4 text-center">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
                    </TransitionChild>

                    <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        {isLoading ? (
                            <div className='flex items-center justify-center'>
                                <Spinner className='w-8 h-8 animate-spin' />
                            </div>
                        ) : (
                            <div ref={modalRef} className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative">
                                {isBatchSending && (
                                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                                        <div className="text-center">
                                            <Spinner className="w-8 h-8 animate-spin mx-auto mb-2" />
                                            <p className="text-sm font-medium text-gray-700">Sending Batch Reminders...</p>
                                        </div>
                                    </div>
                                )}
                                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                    Send Invoice Reminders
                                </DialogTitle>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Review and send reminders for outstanding invoices.
                                    </p>
                                </div>
                                <XMarkIcon
                                    onClick={() => !isBatchSending && setIsOpen(false)}
                                    className="absolute top-4 right-4 h-8 w-8 text-gray-400 cursor-pointer"
                                />

                                <div className="mt-4 space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <MagnifyingGlass className="w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search invoices..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            disabled={isBatchSending}
                                        />
                                    </div>

                                    <div className="h-96 overflow-y-auto pr-4 space-y-4">
                                        {filteredInvoices.map((invoice) => {

                                            const reminderTime = moment(invoice.reminded_at);
                                            let displayTime;

                                            if (reminderTime.isSame(moment(), 'day')) {
                                                // If the reminder is today
                                                displayTime = `Today at ${reminderTime.format('h:mm A')}`;
                                            } else if (reminderTime.isSame(moment().subtract(1, 'day'), 'day')) {
                                                // If the reminder was yesterday
                                                displayTime = `Yesterday at ${reminderTime.format('h:mm A')}`;
                                            } else {
                                                // For all other days
                                                displayTime = reminderTime.format('MMMM Do YYYY, h:mm A');
                                            }

                                            return (
                                                <div
                                                    key={invoice.id}
                                                    className={`flex flex-col rounded-lg border p-4 ${isBatchSending ? 'opacity-50' : ''}`}
                                                >
                                                    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4 }`}>
                                                        <div className="flex items-center space-x-4 w-full sm:w-auto">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedInvoices.includes(invoice.id)}
                                                                onChange={() => toggleInvoiceSelection(invoice.id)}
                                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                                disabled={isBatchSending}
                                                            />
                                                            <div className="space-y-1">
                                                                <div className="flex items-center space-x-2">
                                                                    <h4 className="text-sm font-semibold">{invoice.client.name}</h4>
                                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-500">${invoice.amount.toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end space-y-2">
                                                            <button
                                                                onClick={() => sendReminder(invoice)}
                                                                disabled={sendingStates[invoice.id] || isBatchSending}
                                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {sendingStates[invoice.id] && !isBatchSending ? (
                                                                    <>
                                                                        <Spinner className="mr-2 h-4 w-4 animate-spin" />
                                                                        Sending...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Mailbox className="mr-2 h-4 w-4" />
                                                                        Send Reminder
                                                                    </>
                                                                )}
                                                            </button>

                                                        </div>

                                                    </div>
                                                    {/* Reminded At - placed just below the button */}
                                                    {invoice.reminded_at && (
                                                        <p className="text-xs mt-1 text-gray-400">
                                                            Last reminded: {displayTime}
                                                        </p>
                                                    )}
                                                </div>
                                            )
                                        })}
                                        {filteredInvoices.length === 0 && (
                                            <div className="flex items-center justify-center h-full">
                                                <p className="text-sm text-gray-500">No invoices found.</p>
                                            </div>
                                        )}
                                    </div>
                                    {selectedInvoices.length > 0 && (
                                        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t space-y-2 sm:space-y-0">
                                            <p className="text-sm text-gray-500">
                                                {selectedInvoices.length} invoice(s) selected
                                            </p>
                                            <button
                                                onClick={sendBatchReminders}
                                                disabled={isBatchSending}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Send Batch Reminders
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}

export default InvoiceReminder;