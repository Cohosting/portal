const AppRadio = ({
    label,
    description,
    isChecked,
    handleClick,
    colorSettings = {}
}) => {
    const radioColor = colorSettings.sidebarBgColor || '#4F46E5';
    
    return (
        <div onClick={handleClick} className="cursor-pointer flex items-start pb-4 pt-3.5">
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
                    checked={isChecked}
                    name="account"
                    type="radio"
                    aria-describedby={`account-${description}-description`}
                    className="h-4 w-4 border-gray-300"
                    style={{
                        accentColor: radioColor,
                        '--tw-ring-color': radioColor
                    }}
                />
            </div>
        </div>
    )
}
export default AppRadio;