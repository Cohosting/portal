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
  colorSettings = {}
}) => {
  const { label, description } = generateLabelAndDescriptionForBankOrCard(paymentMethod);

  const showError =
    lastPaymentError?.payment_method?.id === paymentMethod.id;

  const errorCode = getPaymentMethodErrorCode(error || lastPaymentError);

  return (
    <div 
      className={`
        flex items-center justify-between p-4 cursor-pointer transition-all duration-200
        border-l-4 shadow-sm
        ${isSelected 
          ? `bg-gradient-to-r from-gray-50 to-white border-l-${colorSettings.sidebarBgColor || 'indigo-600'} shadow-md` 
          : 'bg-gradient-to-r from-white to-gray-25 border-l-gray-200 hover:from-gray-25 hover:to-gray-50 hover:border-l-gray-300 hover:shadow-md'
        }
      `}
      style={{
        borderLeftColor: isSelected ? colorSettings.sidebarBgColor || '#4F46E5' : '#D1D5DB',
      }}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-3 flex-1">
        <AppRadio
          handleClick={onSelect}
          isChecked={isSelected}
          colorSettings={colorSettings}
        />
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">
              {label}
            </span>
            {paymentMethod.is_default && (
              <span className="text-xs text-gray-500 font-normal">• Default</span>
            )}
          </div>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {showError && (
        <div className="ml-4">
          <PaymentMethodError paymentError={{ code: errorCode }} />
        </div>
      )}
    </div>
  );
};

export default PaymentMethodItem;