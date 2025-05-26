export const prices = [
  {
    id: 1,
    title: 'Starter',
    price: '$89',
    features: ['5 Team Members +$20/mo additional', '100 clients'],
    priceId: 'price_1NGIMkG6ekPTMWCwswlQQmkS',
    type: 'monthly',
  },

  {
    id: 2,
    title: 'Pro',
    price: '$199',
    features: [
      '5 Team Members +20/mo additional',
      '2000 clients',
      'Custom domain',
      'custom email domain',
    ],
    priceId: 'price_1NGIN1G6ekPTMWCwiNkhZppa',
    type: 'monthly',
  },
  {
    id: 3,
    title: 'Starter Yearly',
    price: '$828',
    features: ['5 Team Members +$20/mo additional', '100 clients'],
    priceId: 'price_1NGIOTG6ekPTMWCwyFKzCYti',
    type: 'yearly',
  },
  {
    id: 4,
    title: 'Pro Yearly',
    price: '$1908',
    features: [
      '5 Team Members +20/mo additional',
      '2000 clients',
      'Custom domain',
      'custom email domain',
    ],
    priceId: 'price_1NGIRnG6ekPTMWCwy0RP4VBL',
    type: 'yearly',
  },
];


export const getPrice = (frequency, tier) => {
  if (!tier) return {};
  return frequency === 'monthly' ? tier.monthly : tier.yearly;
};