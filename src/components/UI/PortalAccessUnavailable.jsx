import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import React from 'react'

let defaultHeading = "Access Unavailable"
let defaultMessage = "Access to this portal is temporarily unavailable. Please contact the portal owner for further information or assistance."

const PortalAccessUnavailable = ({
    heading = defaultHeading,
    message = defaultMessage
}) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center">
                        <ExclamationCircleIcon className="h-6 w-6 text-yellow-500 mr-3" aria-hidden="true" />
                        <h2 className="text-lg font-semibold text-gray-900">{heading}</h2>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                        {message}
                    </p>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                    <p className="text-xs text-gray-500">
                        If you need immediate help, please reach out to our support team.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PortalAccessUnavailable