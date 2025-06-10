import React, { useEffect, useState, useRef } from 'react';
import { Search, SendHorizonal, Loader2, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import useOpenInvoice from '../../hooks/react-query/useOpenInvoice';
import { sendInvoiceReminder, sendInvoiceReminderInBatch } from '../../services/invoiceService';
import { toast } from 'react-toastify';
import { DateTime } from 'luxon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

const InvoiceReminder = ({ isOpen, setIsOpen, portal }) => {
    const { currentSelectedPortal } = useSelector(state => state.auth);
    const { data: openInvoices, isLoading } = useOpenInvoice(currentSelectedPortal);
    const [sendingStates, setSendingStates] = useState({});
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [isBatchSending, setIsBatchSending] = useState(false);

    const sendReminder = async (invoice) => {
        const invoiceId = invoice.id;
        if (isBatchSending) return;
        setSendingStates(prev => ({ ...prev, [invoiceId]: true }));
        await sendInvoiceReminder(
            {
                ...invoice,
                brand_settings: portal.brand_settings,
            },
            invoice.client.email
        );
        setSendingStates(prev => ({ ...prev, [invoiceId]: false }));
        console.log(`Reminder sent for invoice #${invoiceId}`);
    };

    const sendBatchReminders = async () => {
        setIsBatchSending(true);
        const invoices = openInvoices
            .filter(invoice => selectedInvoices.includes(invoice.id))
            .map(invoice => ({
                ...invoice,
                brand_settings: portal.brand_settings
            }));
        try {
            await sendInvoiceReminderInBatch(invoices);
            toast.success('Batch reminders sent successfully');
        } catch (error) {
            console.error('Error sending batch reminders:', error);
            toast.error('Error sending batch reminders');
        } finally {
            setIsBatchSending(false);
            setSelectedInvoices([]);
            setIsOpen(false);
        }
    };

    const toggleInvoiceSelection = (invoiceId) => {
        if (isBatchSending) return;
        setSelectedInvoices(prev =>
            prev.includes(invoiceId)
                ? prev.filter(id => id !== invoiceId)
                : [...prev, invoiceId]
        );
    };

    useEffect(() => {
        if (openInvoices?.length > 0) {
            const filtered = openInvoices.filter(invoice =>
                invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                invoice.amount.toString().includes(searchTerm)
            );
            setFilteredInvoices(filtered);
        }
    }, [openInvoices, searchTerm]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isBatchSending && setIsOpen(open)}>
            <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-hidden">
                {isBatchSending && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700">Sending Batch Reminders...</p>
                        </div>
                    </div>
                )}
                
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Send Invoice Reminders
                    </DialogTitle>
                    <p className="text-sm text-gray-600">
                        Review and send reminders for outstanding invoices.
                    </p>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search invoices..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                disabled={isBatchSending}
                            />
                        </div>

                        <div className="h-96 overflow-y-auto pr-2 space-y-3">
                            {filteredInvoices.map((invoice) => {
                                const reminderTime = DateTime.fromISO(invoice.reminded_at);
                                const now = DateTime.local();
                                let displayTime;
                                if (reminderTime.hasSame(now, 'day')) {
                                    displayTime = `Today at ${reminderTime.toFormat('h:mm a')}`;
                                } else if (reminderTime.hasSame(now.minus({ days: 1 }), 'day')) {
                                    displayTime = `Yesterday at ${reminderTime.toFormat('h:mm a')}`;
                                } else {
                                    displayTime = reminderTime.toFormat('MMMM dd yyyy, h:mm a');
                                }

                                return (
                                    <div
                                        key={invoice.id}
                                        className={`border rounded-lg p-4 space-y-3 ${isBatchSending ? 'opacity-50' : ''}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-3">
                                                <Checkbox
                                                    checked={selectedInvoices.includes(invoice.id)}
                                                    onCheckedChange={() => toggleInvoiceSelection(invoice.id)}
                                                    disabled={isBatchSending}
                                                    className="mt-1"
                                                />
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="font-semibold text-sm">{invoice.client.name}</h4>
                                                        <Badge 
                                                            variant={invoice.status === 'overdue' ? 'destructive' : 'secondary'}
                                                            className="text-xs"
                                                        >
                                                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-600">${invoice.amount.toFixed(2)}</p>
                                                </div>
                                            </div>
                                            
                                            <Button
                                                onClick={() => sendReminder(invoice)}
                                                disabled={sendingStates[invoice.id] || isBatchSending}
                                                size="sm"
                                                className="bg-black hover:bg-gray-800 text-white"
                                            >
                                                {sendingStates[invoice.id] && !isBatchSending ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <SendHorizonal className="mr-2 h-4 w-4" />
                                                        Send Reminder
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        
                                        {invoice.reminded_at && (
                                            <p className="text-xs text-gray-400 ml-7">
                                                Last reminded: {displayTime}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                            
                            {filteredInvoices.length === 0 && (
                                <div className="flex items-center justify-center h-32">
                                    <p className="text-sm text-gray-500">No invoices found.</p>
                                </div>
                            )}
                        </div>

                        {selectedInvoices.length > 0 && (
                            <div className="flex justify-between items-center pt-4 border-t">
                                <p className="text-sm text-gray-600">
                                    {selectedInvoices.length} invoice(s) selected
                                </p>
                                <Button
                                    onClick={sendBatchReminders}
                                    disabled={isBatchSending}
                                    className="bg-black hover:bg-gray-800 text-white"
                                >
                                    Send Batch Reminders
                                </Button>
                            </div>
                        )}
                    </div>
                )}
                </DialogContent>
        </Dialog>
    );
};

export default InvoiceReminder;