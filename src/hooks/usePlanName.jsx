import { useEffect, useState } from 'react';

export const usePlanName = (prices, priceId) => {
  const [planName, setPlanName] = useState('');

  useEffect(() => {
    const filteredPrice = prices.filter(el => el.priceId === priceId)[0];
    if (filteredPrice) {
      setPlanName(filteredPrice.title);
    }
  }, [prices, priceId]);

  return planName;
};
