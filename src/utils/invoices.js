export const calculateTotal = items => {
  return items.reduce((total, item) => {
    return total + item.quantity * item.unit_amount;
  }, 0);
};
