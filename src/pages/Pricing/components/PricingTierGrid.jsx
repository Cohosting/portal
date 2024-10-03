import { tiers } from "../../../utils/constant";
import PricingTier from "./PricingTier";

const PricingTierGrid = ({ frequency, onSelectTier }) => {
    return (
        <div className="mx-auto mt-8 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-12 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
            {tiers.map((tier, tierIdx) => (
                <PricingTier onSelectTier={onSelectTier} key={tier.id} tier={tier} tierIdx={tierIdx} frequency={frequency} />
            ))}
        </div>
    );
}

export default PricingTierGrid;