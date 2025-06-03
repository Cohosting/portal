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



    return (
        <div className="max-w-2xl py-6 pt-0 rounded-lg ">

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

            <PlanSelectionModal cancelSubscriptionDowngrade={cancelSubscriptionDowngrade} currentPlan={getCurrentPlan(subscription.price_id)} subscription={subscription} />

        </div>
    );
};

export default PlanSelector;