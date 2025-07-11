const InvoiceUncollectible = ({ invoice }) => {
    return (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 mx-4 sm:mx-6 mt-6">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-orange-800">
                        Invoice {invoice.invoice_number} has been marked as uncollectible.
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                        This invoice has been written off as a bad debt.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default InvoiceUncollectible