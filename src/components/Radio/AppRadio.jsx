

const AppRadio = ({
    label,
    description,
    isChecked,

}) => {

    return (
        <div className="relative flex items-start pb-4 pt-3.5">
            <div className="min-w-0 flex-1 text-sm leading-6">
                <label htmlFor={`account-${label}`} className="font-medium text-gray-900">
                    {label}
                </label>
                <p id={`account-${description}-description`} className="text-gray-500">
                    {description}
                </p>
            </div>
            <div className="ml-3 flex h-6 items-center">
                <input
                    value={isChecked}
                    name="account"
                    type="radio"
                    aria-describedby={`account-${description}-description`}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
            </div>
        </div>
    )
}

export default AppRadio