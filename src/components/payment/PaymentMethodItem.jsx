import { generateLabelAndDescriptionForBankOrCard } from "../../utils/invoices";
import { getPaymentMethodErrorCode } from "../../utils/payment_methods/payment_method_utils";
import AppRadio from "../Radio/AppRadio";
import PaymentMethodError from "./ClientPaymentMethods/PaymentMethodError";

const PaymentMethodItem = ({
  paymentMethod,
  isSelected,
  onSelect,
  error,
  lastPaymentError,
}) => {
  const { label, description } = generateLabelAndDescriptionForBankOrCard(paymentMethod);

  const showError =
    lastPaymentError?.payment_method?.id === paymentMethod.id

  const errorCode = getPaymentMethodErrorCode(error || lastPaymentError);

  return (
    <div className="cursor-pointer">
      <AppRadio
        handleClick={onSelect}
        label={label}
        description={description}
        isChecked={isSelected}
      />
      {showError && <PaymentMethodError paymentError={{ code: errorCode }} />}
    </div>
  );
};

export default PaymentMethodItem;