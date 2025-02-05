import { useState, Fragment } from "react"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useSubscription from "../../../hooks/useSubscription"

const plans = [
    { id: 1, name: 'Starter', interval: 'monthly', price: 89, priceId: 'price_1Ppot2G6ekPTMWCwZM8MR58c' },
    { id: 2, name: 'Starter', interval: 'yearly', price: 828, priceId: 'price_1Ppot2G6ekPTMWCwJP5tlcod' },
    { id: 3, name: 'Pro', interval: 'monthly', price: 199, priceId: 'price_1PpotSG6ekPTMWCw3ulBiPa9' },
    { id: 4, name: 'Pro', interval: 'yearly', price: 1908, priceId: 'price_1PpotxG6ekPTMWCwFjy8Gr8V' },
]



const PlanSelectionModal = ({ currentPlan = { name: 'Pro', interval: 'monthly' }, subscription }) => {
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false);

    const { upgradeSubscription, downgradeSubscription, loading } =
        useSubscription();
    const getPlanChangeType = (planName, planInterval) => {
        if (planName === currentPlan.name && planInterval === currentPlan.interval) return 'current'
        if (planName === 'Pro' && currentPlan.name === 'Starter') return 'upgrade'
        if (planName === currentPlan.name && planInterval === 'yearly' && currentPlan.interval === 'monthly') return 'upgrade'
        if (planName === 'Starter' && currentPlan.name === 'Pro') return 'downgrade'
        if (planName === currentPlan.name && planInterval === 'monthly' && currentPlan.interval === 'yearly') return 'downgrade'
        return ''
    }

    const getBadgeStyle = (changeType) => {
        switch (changeType) {
            case 'current':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900'
            case 'upgrade':
                return 'bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900'
            case 'downgrade':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900'
            default:
                return ''
        }
    }

    const handleConfirmChange = async () => {
        setIsLoading(true)
        try {
            const planChangeType = getPlanChangeType(plans.find(p => p.id === selectedPlan).name, plans.find(p => p.id === selectedPlan).interval)
            let priceId = plans.find(p => p.id === selectedPlan).priceId
            if (planChangeType === 'upgrade') {
                await upgradeSubscription(subscription.stripe_subscription_id, priceId);
            } else if (planChangeType === 'downgrade') {
                await downgradeSubscription(subscription.stripe_subscription_id, priceId);
            } else {
                throw new Error('Invalid plan change type')
            }


            toast.success('Plan changed successfully!')
            setIsOpen(false)
        } catch (error) {
            toast.error('Failed to change plan. Please try again.')
        } finally {
            setIsLoading(false);
            // clear state
            setSelectedPlan(null)
        }
    }

    return (
        <>
            <button
                onClick={() => { setIsOpen(true); setSelectedPlan(null) }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Change Plan
            </button>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[100]" onClose={() => setIsOpen(false)}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <DialogTitle
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Select a Plan
                                    </DialogTitle>
                                    <div className="mt-4 space-y-2">
                                        {plans.map((plan) => {
                                            const changeType = getPlanChangeType(plan.name, plan.interval)
                                            const badgeStyle = getBadgeStyle(changeType)

                                            return (
                                                <div
                                                    key={plan.id}
                                                    className={`p-3 rounded-lg border ${selectedPlan === plan.id ? 'border-indigo-500' : 'border-gray-200'
                                                        } transition-all duration-200 ease-in-out`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center space-x-2">
                                                            <div>
                                                                <h3 className="text-sm font-semibold">{plan.name}</h3>
                                                                <p className="text-xs text-gray-500 capitalize">{plan.interval}</p>
                                                            </div>
                                                            {changeType && (
                                                                <span className={`${badgeStyle} px-2 py-1 rounded-full text-xs font-medium capitalize transition-colors duration-200`}>
                                                                    {changeType}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <p className="text-sm font-bold">${plan.price}/{plan.interval === 'monthly' ? 'mo' : 'yr'}</p>
                                                            <button
                                                                className={`px-3 py-1 text-xs font-medium rounded-md ${selectedPlan === plan.id
                                                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                                    } transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                onClick={() => setSelectedPlan(plan.id)}
                                                                disabled={isLoading}
                                                            >
                                                                {selectedPlan === plan.id ? 'Selected' : 'Select'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="mt-6 flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={() => setIsOpen(false)}
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${(!selectedPlan || isLoading || (selectedPlan === plans.find(p => p.name === currentPlan.name && p.interval === currentPlan.interval)?.id))
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                                }`}
                                            onClick={handleConfirmChange}
                                            disabled={!selectedPlan || isLoading || (selectedPlan === plans.find(p => p.name === currentPlan.name && p.interval === currentPlan.interval)?.id)}
                                        >
                                            {isLoading ? 'Changing...' : 'Confirm Change'}
                                        </button>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <ToastContainer position="bottom-right" autoClose={3000} />
        </>
    )
}

export default PlanSelectionModal;