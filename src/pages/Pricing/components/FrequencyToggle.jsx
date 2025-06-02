import { Radio, RadioGroup } from "@headlessui/react";

const FrequencyToggle = ({ frequency, setFrequency }) => {
    const frequencies = [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
    ];

    return (
        <div className="mt-8 flex justify-center">
            <fieldset aria-label="Payment frequency">
                <RadioGroup
                    value={frequency}
                    onChange={setFrequency}
                    className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-300 bg-white"
                >
                    {frequencies.map((option) => (
                        <Radio
                            key={option.value}
                            value={option.value}
                            className="cursor-pointer rounded-full px-3 py-1 text-black data-[checked]:bg-black data-[checked]:text-white transition-colors duration-150"
                        >
                            {option.label}
                        </Radio>
                    ))}
                </RadioGroup>
            </fieldset>
        </div>
    );
}

export default FrequencyToggle;
