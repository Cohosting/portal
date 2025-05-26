import { Check } from "lucide-react";
import { classNames } from "../../../utils/statusStyles";

const FeatureList = ({ features, featured }) => {
    return (
        <ul
            className={classNames(
                featured ? 'text-gray-300' : 'text-gray-600',
                'mt-4 space-y-3 text-sm leading-6 sm:mt-6',
            )}
        >
            {features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                    <Check
                        aria-hidden="true"
                        className={classNames(featured ? 'text-indigo-400' : 'text-indigo-600', 'h-6 w-5 flex-none')}
                    />
                    {feature}
                </li>
            ))}
        </ul>
    );
}

export default FeatureList;