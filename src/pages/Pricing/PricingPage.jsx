import { useState } from "react";
import PricingHeader from "./components/PricingHeader";
import FrequencyToggle from "./components/FrequencyToggle";
import PricingTierGrid from "./components/PricingTierGrid";
import SelectedPlanSummary from "./components/SelectedPlanSummary";
import CheckoutForm from "./components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getPrice } from "../../utils/prices";
const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLIC_KEY
);

const PricingPage = ({ shouldShowSubscription, setShouldShowSubscription }) => {
    const [frequency, setFrequency] = useState('monthly');
    const [selectedTier, setSelectedTier] = useState(null);
    const {
        price,
        priceId
    } = getPrice(frequency, selectedTier);

    return (
        <div className="bg-white pt-10 pb-24 sm:pb-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <PricingHeader />
                {!selectedTier ? (
                    <>
                        <FrequencyToggle frequency={frequency} setFrequency={setFrequency} />
                        <PricingTierGrid
                            frequency={frequency}
                            onSelectTier={setSelectedTier}
                        />
                    </>
                ) : (
                    <>
                        <SelectedPlanSummary handleChangePlan={() => setSelectedTier(null)} tier={selectedTier} frequency={frequency} />
                        <Elements stripe={stripePromise} options={{
                            mode: 'subscription',
                            amount: price * 100,
                            currency: 'usd',
                            payment_method_types: ['card'],
                        }} >

                                <CheckoutForm setShouldShowSubscription={setShouldShowSubscription} isYearly={
                                frequency === 'yearly'
                            } priceId={priceId} tier={selectedTier} frequency={frequency} />
                                {!shouldShowSubscription && (
                                    <p className="my-2 text-green-500">Please wait everthing is getting proccessed...</p>
                                )}
                        </Elements>
                    </>
                )}
            </div>
        </div>
    );
}

export default PricingPage;