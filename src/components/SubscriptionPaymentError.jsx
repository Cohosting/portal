import React from 'react';
import { SetupPaymentMethod } from './internal/SetupPaymentMethod';
import { useToggle } from 'react-use';

const SubscriptionPaymentError = ({ errorCode, errorDetails, }) => {
    const [isOpen, onToggle] = useToggle(false);
    let message;
    let actionButton;

    const onUpdatePayment = () => {
        onToggle();
    }
    if (!errorDetails) return;

    switch (errorDetails.code) {
        case 'insufficient_funds':
            message = (
                <>
                    Uh oh, looks like your payment method doesn't have enough funds. Would you like to update your payment information?
                </>
            );
            actionButton = <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={onUpdatePayment}>Update Payment</button>;
            break;
        case 'invalid_card_number':
            message = 'Something seems off with your card number. Please double-check and try again.';
            break;
        case 'card_declined':
            message = 'Your card was declined. Please try a different card or contact your card issuer for more information.';
            actionButton = <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={onUpdatePayment}>Update Payment</button>;
            break;
        case 'expired_card':
            message = 'Your card has expired. Please use a card with a valid expiration date.';
            break;
        case 'incorrect_cvc':
            message = 'The security code (CVC) you entered is incorrect. Please try again.';
            break;
        case 'lost_or_stolen_card':
            message = 'Your card has been reported lost or stolen. Please use a different card.';
            break;
        case 'processing_error':
            message = 'There was a problem processing your payment. Please try again later or contact support if the issue persists.';
            break;
        default:
            message = 'There was an issue processing your payment. Please try again later.';
    }

    return (
        <div className="my-3 p-4 bg-red-200 rounded-md shadow-md flex flex-col">
            <div className="flex items-center justify-between">
                <div className="text-red-500">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3a1 1 0 002 0V7zm-1 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                </div>
                <h2 className="text-md font-medium">Payment Error</h2>
                <div className="flex-grow"></div>
            </div>
            <div className="text-gray-600 py-4">
                {message}
                &nbsp;
                &nbsp;
                {actionButton}
            </div>
            <SetupPaymentMethod forFailedPayment={true} isOpen={isOpen} handleClose={onToggle} />
        </div>
    );
};

export default SubscriptionPaymentError;