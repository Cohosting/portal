import React from 'react'

const PaymentFailed = ({
    handleRetryPayment,
    invoice
}) => {
    return (
        <div className="flex flex-col items-center justify-center mt-4 py-2">
            <svg
                className="mb-3 h-8 w-8 text-red-500"
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
                    d="M4 12a8 8 0 0116 0h-4a4 4 0 00-8 0H4z"
                ></path>
            </svg>
            <div className="flex items-center justify-center space-x-4 text-center">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Payment Failed
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Unfortunately, your payment could not be processed. Please
                        try again or use a different payment method.
                    </p>

                </div>
            </div>
            <div className="mt-6">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Payment Failed
                </span>
            </div>
            <div className="mt-4">
                <p className="text-sm text-gray-500">
                    If you need assistance, please{' '}
                    <a href="mailto:support@yourcompany.com" className="text-blue-500 underline">
                        contact support
                    </a>
                    .
                </p>
            </div>
            <div className="mt-6">
                <button
                    onClick={handleRetryPayment}
                    className="btn-indigo"
                >
                    Try Again
                </button>
            </div>
        </div>
    )
}

export default PaymentFailed
