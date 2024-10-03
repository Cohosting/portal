import React, { useState } from 'react';
import { CreditCardIcon, EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import AlertDialog from '../../../components/Modal/AlertDialog';
import { toast } from 'react-toastify'
import { useQueryClient } from 'react-query';
import { queryKeys } from '../../../hooks/react-query/queryKeys';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

const formatExpirationDate = (month, year) => {
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedYear = year.toString().slice(-2);
    return `${formattedMonth}/${formattedYear}`;
};

const PaymentMethod = ({
    id, card, isDefault, onSetDefault, onDelete, customerId, onRetry, showRetryOptions

}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isSetDefaultAlertOpen, setIsSetDefaultAlertOpen] = useState(false);
    const [isRetryAlertOpen, setIsRetryAlertOpen] = useState(false);
    const [isSetAsDefaultAndRetryAlertOpen, setIsSetAsDefaultAndRetryAlertOpen] = useState(false);
    const [selectedRetryOption, setSelectedRetryOption] = useState(null);
    const { brand, last4, exp_month, exp_year } = card;
    const queryClient = useQueryClient();

    const handleConfirm = async () => {

        try {
            setIsLoading(true);
            await onDelete(id);
            queryClient.invalidateQueries(queryKeys.customerPaymentMethods(customerId))
            toast.success('Payment method deleted successfully');
        } catch (error) {
            console.error('Error deleting payment method:', error);
            toast.error('Error deleting payment method');
        }
        finally {
            setIsLoading(false);
            setIsAlertOpen(false);
        }


    }

    const handleSetDefault = async () => {
        try {
            setIsLoading(true);
            await onSetDefault();
            queryClient.invalidateQueries(queryKeys.customerPaymentMethods(customerId))
            toast.success('Default payment method set successfully');
        } catch (error) {
            console.error('Error setting default payment method:', error);
            toast.error('Error setting default payment method');
        } finally {
            setIsLoading(false);
            setIsSetDefaultAlertOpen(false);
        }

    }

    const handleRetry = async () => {
        try {
            setIsLoading(true);
            await onRetry(id,);
        } catch (error) {
            console.error('Error retrying payment:', error);
            toast.error('Error retrying payment');
        } finally {
            setIsLoading(false);
            setIsRetryAlertOpen(false);
        }
    }

    const handleSetDefaultAndRetry = async () => {
        try {
            setIsLoading(true);
            await onRetry(id, true);
            toast.success('Payment set as default and retried successfully');
        } catch (error) {
            console.error('Error setting as default and retrying payment:', error);
            toast.error('Error setting as default and retrying payment');
        } finally {
            setIsLoading(false);
            setIsSetAsDefaultAndRetryAlertOpen(false);
        }
    }

    return (
        <>

            <div className={`flex items-center justify-between p-4 rounded-lg border ${isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                <div className="flex items-center flex-grow">
                    <CreditCardIcon className="w-6 h-6 text-gray-500" />
                    <div className="ml-4 flex-grow">
                        <div className="flex items-center">
                            <p className="text-sm font-medium">{brand.toUpperCase()} **** {last4}</p>
                            {isDefault && (
                                <span className="ml-2 px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                                    Default
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">Exp: {formatExpirationDate(exp_month, exp_year)}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    {showRetryOptions ? (
                        isDefault ? (
                            <button
                                onClick={() => {
                                    setIsRetryAlertOpen(true);
                                    setSelectedRetryOption(card);
                                }}
                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Retry Payment
                            </button>
                        ) : (
                            <Menu as="div" className="relative inline-block text-left">
                                <MenuButton className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Payment Options
                                </MenuButton>
                                <MenuItems className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="px-1 py-1">

                                        <MenuItem>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => {
                                                        setIsSetAsDefaultAndRetryAlertOpen(true);
                                                        setSelectedRetryOption(card);
                                                    }}
                                                    className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                                >
                                                    Set as default and pay
                                                </button>
                                            )}
                                        </MenuItem>
                                    </div>
                                </MenuItems>
                            </Menu>
                        )
                    ) : !isDefault && (
                        <Menu as="div" className="relative inline-block text-left">
                            <MenuButton className="flex items-center text-gray-400 hover:text-gray-600">
                                <EllipsisVerticalIcon className="h-5 w-5" />
                            </MenuButton>
                            <MenuItems className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="px-1 py-1">
                                    {!isDefault && (
                                        <MenuItem>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => setIsSetDefaultAlertOpen(true)}
                                                    className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                                >
                                                    Set as default
                                                </button>
                                            )}
                                        </MenuItem>
                                    )}
                                    {!isDefault && (
                                        <MenuItem>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => onDelete(id)}
                                                    className={`${active ? 'bg-red-500 text-white' : 'text-gray-900'
                                                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </MenuItem>
                                    )}
                                </div>
                            </MenuItems>
                        </Menu>
                    )}
                </div>
            </div>
            <AlertDialog
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                title="Delete payment method"
                message="Are you sure you want to delete this payment method?"
                confirmButtonText={isLoading ? 'Deleting...' : 'Delete'}
                cancelButtonText="Cancel"
                onConfirm={handleConfirm}
            />
            <AlertDialog
                isOpen={isSetDefaultAlertOpen}
                onClose={() => setIsSetDefaultAlertOpen(false)}
                title="Set this card as default"
                message="Are you sure you want to set this card as default?"
                confirmButtonText={isLoading ? 'Setting...' : 'Set as default'}
                cancelButtonText="Cancel"
                onConfirm={handleSetDefault}
                iconBgColor='bg-blue-100'
                iconColor='text-blue-600'
                confirmButtonColor='bg-blue-600 hover:bg-blue-500'
                icon={<CreditCardIcon className="h-6 w-6 text-blue-600 " />}
            />
            <AlertDialog
                isOpen={isRetryAlertOpen}
                onClose={() => {
                    setIsRetryAlertOpen(false);
                    setSelectedRetryOption(null);
                }}
                title="Retry payment"
                message={`Are you sure you want to retry the payment with the card ending in ${selectedRetryOption?.last4}?`}
                confirmButtonText={isLoading ? 'Retrying...' : 'Retry'}
                cancelButtonText="Cancel"
                onConfirm={handleRetry}
                iconBgColor='bg-blue-100'
                iconColor='text-blue-600'
                confirmButtonColor='bg-blue-600 hover:bg-blue-500'
            />

            <AlertDialog
                isOpen={isSetAsDefaultAndRetryAlertOpen}
                onClose={() => setIsSetAsDefaultAndRetryAlertOpen(false)}
                title="Set as default and retry payment"
                message={`Are you sure you want to set this card as default and retry the payment with the card ending in ${selectedRetryOption?.last4}?`}
                confirmButtonText={isLoading ? 'Setting...' : 'Set as default and retry'}
                cancelButtonText="Cancel"
                onConfirm={handleSetDefaultAndRetry}
                iconBgColor='bg-blue-100'
                iconColor='text-blue-600'
                confirmButtonColor='bg-blue-600 hover:bg-blue-500'
            />
        </>
    );
};

export default PaymentMethod;
