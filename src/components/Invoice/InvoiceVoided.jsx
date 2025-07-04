

const InvoiceVoided = ({ invoice }) => {
    return (
        <div className="bg-red-50 border border-red-200 mx-4 sm:mx-6 mt-6 rounded-lg p-4 mb-4">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                        Invoice {invoice.invoice_number} has been voided.
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                        This invoice is no longer valid and cannot be collected.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default InvoiceVoided