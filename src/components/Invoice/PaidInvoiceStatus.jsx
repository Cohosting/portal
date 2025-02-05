
const PaidInvoiceStatus = ({ invoice }) => (
    <div className="flex flex-col items-center justify-center mt-4 py-2">
        <svg
            className="mb-3 h-8 w-8 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M10 14l2-2 4 4M9 11l3 3 6-6"
            ></path>
        </svg>
        <div className="flex items-center justify-center space-x-4 text-center">
            <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Payment Successful
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                    Your payment has been successfully processed.
                </p>

            </div>
        </div>
        <div className="mt-6">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Paid
            </span>

        </div>
        <p className="mt-2 text-sm text-gray-600">Transection ID: {invoice.payment_intent}</p>

        <div className="mt-4">
            <p className="text-sm text-gray-500">
                If you have any questions, please{' '}
                <a href="mailto:support@yourcompany.com" className="text-blue-500 underline">
                    contact support
                </a>
                .
            </p>
        </div>
    </div>
);


export default PaidInvoiceStatus;