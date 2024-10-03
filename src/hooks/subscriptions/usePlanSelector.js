import { useState, useEffect, useCallback } from 'react';
import useSubscription from '../useSubscription';
import { tiers } from '../../utils/constant';
import {
  determinePlanChangeType,
  determineUpgradedPlanName,
} from '../../utils/subscriptionUtils';

const usePlanSelector = subscription => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [upgradedPlanName, setUpgradedPlanName] = useState(null);
  const { upgradeSubscription, downgradeSubscription, loading } =
    useSubscription();

  useEffect(() => {
    if (subscription) {
      const currentPlan = tiers.find(
        tier =>
          tier.monthly?.priceId === subscription.price_id ||
          tier.yearly?.priceId === subscription.price_id
      );

      const upgradedPlanName = determineUpgradedPlanName(
        subscription.next_phase
      );

      setUpgradedPlanName(upgradedPlanName);
      setCurrentPlan({
        ...currentPlan,
        interval:
          currentPlan.yearly?.priceId === subscription.price_id
            ? 'yearly'
            : 'monthly',
      });
      setSelectedPlan(currentPlan);
      setIsYearly(currentPlan.yearly.priceId === subscription.price_id);
    }
  }, [subscription]);

  const handleToggle = useCallback(() => {
    setIsYearly(prev => !prev);
  }, []);

  const handlePlanSelect = useCallback(plan => {
    setSelectedPlan(plan);
  }, []);

  const isPlanChanged = useCallback(() => {
    if (!selectedPlan || !currentPlan) return false;

    const currentIsYearly =
      currentPlan.yearly.priceId === subscription.price_id;

    // Check if the billing cycle has changed
    if (isYearly !== currentIsYearly) return true;

    // Check if the plan type (starter/pro) has changed
    if (selectedPlan.name !== currentPlan.name) return true;

    // If billing cycle is the same, check if the priceId has changed
    if (isYearly) {
      return selectedPlan.yearly.priceId !== currentPlan.yearly.priceId;
    } else {
      return selectedPlan.monthly.priceId !== currentPlan.monthly.priceId;
    }
  }, [selectedPlan, currentPlan, isYearly, subscription]);

  const handlePlanChange = useCallback(async () => {
    let isCurrentPlanYearly =
      currentPlan.yearly.priceId === subscription.price_id;
    let changeType = determinePlanChangeType(
      currentPlan.id,
      selectedPlan.id,
      isCurrentPlanYearly ? 'yearly' : 'monthly',
      isYearly ? 'yearly' : 'monthly'
    );

    let priceId = isYearly
      ? selectedPlan.yearly.priceId
      : selectedPlan.monthly.priceId;

    if (changeType === 'upgrade') {
      await upgradeSubscription(subscription.stripe_subscription_id, priceId);
    } else if (changeType === 'downgrade') {
      await downgradeSubscription(subscription.stripe_subscription_id, priceId);
    }
  }, [
    currentPlan,
    selectedPlan,
    isYearly,
    subscription,
    upgradeSubscription,
    downgradeSubscription,
  ]);

  const resetSelection = useCallback(() => {
    setSelectedPlan(currentPlan);
    setIsYearly(currentPlan.yearly.priceId === subscription.price_id);
  }, [currentPlan, subscription]);

  return {
    isYearly,
    selectedPlan,
    currentPlan,
    loading,
    handleToggle,
    handlePlanSelect,
    isPlanChanged,
    handlePlanChange,
    resetSelection,
    upgradedPlanName,
  };
};

export default usePlanSelector;
