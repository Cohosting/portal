import React from "react";
import PlanOption from "./PlanOption";
import ToggleSwitch from "../../../components/internal/ToggleSwitch";
import { tiers } from "../../../utils/constant";
import usePlanSelector from "../../../hooks/subscriptions/usePlanSelector";
import SubscriptionScheduleInfo from "./SubscriptionScheduleInfo";
import CurrentPlan from "./CurrentPlan";
import useSubscription from "../../../hooks/useSubscription";
import PlanSelectionModal from "./PlanSelectionModal";


const getCurrentPlan = (priceId) => {
    for (const tier of tiers) {
        if (tier.monthly.priceId === priceId) {
            return { name: tier.name, interval: 'monthly' };
        }
        if (tier.yearly.priceId === priceId) {
            return { name: tier.name, interval: 'yearly' };
        }
    }
    return null; // Return null if no matching plan is found
};
const PlanSelector = ({ subscription }) => {

    const {
        isYearly,
        selectedPlan,
        currentPlan,
        upgradedPlanName,
        loading,
        handleToggle,
        handlePlanSelect,
        isPlanChanged,
        handlePlanChange,
        resetSelection
    } = usePlanSelector(subscription);
    const { cancelSubscription, loading: isLoading, reactiveSubscription, cancelSubscriptionDowngrade } = useSubscription(subscription);

    const isCurrentPlan = (tier) => {
        if (isYearly) {
            return tier.yearly.priceId === currentPlan?.yearly.priceId;
        } else {
            return tier.monthly.priceId === currentPlan?.monthly.priceId;
        }
    }

    const isSelectPlan = (tier) => {
        if (isYearly) {
            return tier.yearly.priceId === selectedPlan?.yearly.priceId;
        } else {
            return tier.monthly.priceId === selectedPlan?.monthly.priceId;
        }
    }

    return (
        <div className="max-w-2xl py-6 rounded-lg ">
            <h2 className="text-base font-semibold mb-1">Plan</h2>
            <p className="text-sm text-gray-600 mb-4">Update your plan settings</p>
            <CurrentPlan
                subscription={subscription}
                currentPlan={currentPlan}
                onCancel={() => cancelSubscription(subscription.stripe_subscription_id)}
                isLoading={isLoading}
                onReactivate={() => reactiveSubscription(subscription.stripe_subscription_id)}
            />
            {
                subscription.stripe_subscription_schedule_id && subscription.next_phase && (
                    <SubscriptionScheduleInfo
                        newPlan={upgradedPlanName}
                        effectiveDate={subscription?.next_phase?.start_date} // Unix is
                        isLoading={isLoading}
                        onCancelDowngrade={() => cancelSubscriptionDowngrade(subscription.stripe_subscription_id)}
                    />
                )
            }

            <PlanSelectionModal currentPlan={getCurrentPlan(subscription.price_id)} subscription={subscription} />
            {/* <div className="mb-6">
                <ToggleSwitch isYearly={isYearly} onToggle={handleToggle} />
            </div>


            <div className="space-y-3">
                {tiers.map((tier) => (
                    <PlanOption
                        key={tier.name}
                        name={tier.name}
                        monthly={tier.monthly}
                        yearly={tier.yearly}
                        description={tier.description}
                        isCurrentPlan={isCurrentPlan(tier)}
                        isSelected={isSelectPlan(tier)}
                        isYearly={isYearly}
                        onClick={() => handlePlanSelect(tier)}
                    />
                ))}
            </div> */}

            {/* {isPlanChanged() && (
                <div>
                    <p className="mt-4 text-sm text-yellow-600 bg-yellow-100 p-2 rounded">
                        Note: Switching billing cycle will take effect on your next billing date. Your current plan remains active until then.
                    </p>

                    <div className="mt-6 gap-2 flex items-center pace-x-4">
                        <button onClick={resetSelection} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
                            Cancel
                        </button>
                        <button onClick={handlePlanChange} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            {loading ? 'Saving...' : 'Change Plan'}
                        </button>
                    </div>
                </div>
            )} */}

        </div>
    );
};

export default PlanSelector;