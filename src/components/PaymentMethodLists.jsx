import { useEffect, useState } from "react";
import { AiFillBank } from "react-icons/ai";
import { FaPlus, FaRegCreditCard } from "react-icons/fa";
import { SetupPaymentMethod } from "./internal/SetupPaymentMethod";
import { useSelector } from "react-redux";
import { usePortalData } from "../hooks/react-query/usePortalData";
import { useToggle } from "react-use";

const PaymentMethodList = ({ }) => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isOpen, onToggle] = useToggle(false);

    const { currentSelectedPortal } = useSelector(state => state.auth)
    const { data: portal } = usePortalData(currentSelectedPortal)
    useEffect(() => {
        if (!portal) return;

        const fetchPaymentMethods = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${import.meta.env.VITE_NODE_URL}/api/customers/${portal.customerId}/payment-methods`);
                const data = await response.json();
                console.log({ response })
                setPaymentMethods(data);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentMethods();
    }, [portal]);

    return (
        <div className="flex flex-col gap-4 mx-3">
            <p className="font-bold text-[26px]">All payment methods</p>
            {paymentMethods.map((paymentMethod) => (
                <div
                    key={paymentMethod.id}
                    className="px-4 py-3 rounded-md shadow-md bg-gray-50 hover:bg-gray-100"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="mr-2">
                                {paymentMethod.type === "card" ? (
                                    <FaRegCreditCard className="text-purple-500" />
                                ) : (
                                    <AiFillBank className="text-teal-500" />
                                )}
                            </span>
                            <p className="font-bold">{paymentMethod.type}</p>
                        </div>
                        {paymentMethod.isDefault && (
                            <p className="text-green-500">Default</p>
                        )}
                    </div>
                    <hr className="my-2" />
                    <p>
                        {paymentMethod.maskedNumber}{paymentMethod.type === "card" && ` (${paymentMethod.expDate})`}
                    </p>
                </div>
            ))}
            <button className="bg-blue-600 text-white rounded-full my-2 w-12 h-12 flex items-center justify-center" onClick={onToggle}>
                <FaPlus />
            </button>
            <SetupPaymentMethod
                isOpen={isOpen}
                handleClose={onToggle}
            />

            <button onClick={async () => {
                const res = await fetch(`${import.meta.env.VITE_NODE_URL}/api/customers/portal-session`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        customerId: portal.customerId
                    }),

                });
                const data = await res.json();

                window.location.href = data.url

                console.log(data)
            }} className="bg-green-500 text-white w-min my-3 mt-1 px-4 py-2 rounded">Manage payment method</button>
        </div>
    );
};

export default PaymentMethodList;