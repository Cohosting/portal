import { tiers } from './constant';

export const determinePlanChangeType = (
  currentPlan,
  newPlan,
  currentBillingCycle,
  newBillingCycle
) => {
  // Helper function to get the plan tier by ID
  const getPlanById = id => tiers.find(tier => tier.id === id);

  const currentTier = getPlanById(currentPlan);
  const newTier = getPlanById(newPlan);

  // If it's the same tier, compare the billing cycles
  if (currentTier.id === newTier.id) {
    if (newBillingCycle === 'yearly' && currentBillingCycle === 'monthly') {
      return 'upgrade';
    } else if (
      newBillingCycle === 'monthly' &&
      currentBillingCycle === 'yearly'
    ) {
      return 'downgrade';
    }
  }

  // Determine if it's an upgrade/downgrade based on the plan tier
  if (newTier.id > currentTier.id) {
    return 'upgrade';
  } else if (newTier.id < currentTier.id) {
    return 'downgrade';
  }

  // If no change is detected, return 'no_change'
  return 'no_change';
};

export const determineUpgradedPlanName = nextPhase => {
  if (!nextPhase || !nextPhase.items || nextPhase.items.length === 0) {
    return 'Unknown';
  }

  const basePlanItem = nextPhase.items.find(
    item => item.metadata.type === 'base_plan'
  );
  if (!basePlanItem) {
    return 'Unknown';
  }

  const matchingTier = tiers.find(
    tier =>
      tier.monthly.priceId === basePlanItem.price_id ||
      tier.yearly.priceId === basePlanItem.price_id
  );

  if (matchingTier) {
    const interval = basePlanItem.recurring.interval;
    const capitalizedInterval =
      interval.charAt(0).toUpperCase() + interval.slice(1);
    return `${matchingTier.name} - (${capitalizedInterval})`;
  }

  return 'Custom';
};

export const getCurrentPlan = subscription => {
  if (!subscription) {
    return null;
  }

  tiers.forEach(tier => {
    if (tier.monthly.priceId === subscription.price_id) {
      return {
        ...tier,
        interval: 'monthly',
      };
    }

    if (tier.yearly.priceId === subscription.price_id) {
      return {
        ...tier,
        interval: 'yearly',
      };
    }
  });
};
