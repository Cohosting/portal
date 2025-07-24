import { getPrice } from "../../../utils/prices";
import { classNames } from "../../../utils/statusStyles";
import FeatureList from "./FeatureList";

const PricingTier = ({ tier, tierIdx, frequency, onSelectTier }) => {
    const {
        price,
        priceId
    } = getPrice(frequency, tier);

    return (
        <div
            onClick={() => onSelectTier(tier)}
            className={classNames(
                tier.featured ? 'relative bg-black shadow-2xl text-white' : 'bg-white text-black border border-gray-200',
                tier.featured ? '' : tierIdx === 0
                    ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none'
                    : 'sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl',
                'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10',
            )}
        >
            <h3 id={tier.id} className="text-base font-semibold leading-7 text-black dark:text-white">
                {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
                <span className={classNames(tier.featured ? 'text-white' : 'text-black', 'text-5xl font-bold tracking-tight')}>
                ${price}
                </span>
                <span className="text-gray-500 text-base">
                    /{frequency === 'monthly' ? 'month' : 'year'}
                </span>
            </p>
            <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-300">
                {tier.description}
            </p>
            <FeatureList features={tier.features} featured={tier.featured} />

            <a
                href={tier.href}
                aria-describedby={tier.id}
                className={classNames(
                    tier.featured
                        ? 'bg-white text-black hover:bg-gray-100'
                        : 'bg-black text-white hover:bg-gray-900',
                    'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold transition-colors duration-200 sm:mt-10'
                )}
            >
                Get started today
            </a>
        </div>
    )
}

export default PricingTier;
