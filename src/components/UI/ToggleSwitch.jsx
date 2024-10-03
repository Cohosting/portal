const ToggleSwitch = ({ isYearly, onToggle }) => (
    <div className="flex items-center">
        <span className={`mr-3 text-sm ${!isYearly ? 'font-medium' : ''}`}>Monthly</span>
        <div
            className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer"
            onClick={onToggle}
        >
            <div
                className={`absolute left-0 w-6 h-6 transition duration-200 ease-in-out transform ${isYearly ? 'translate-x-6 bg-blue-600' : 'translate-x-0 bg-gray-400'
                    } rounded-full`}
            ></div>
            <div className={`w-full h-full rounded-full ${isYearly ? 'bg-blue-200' : 'bg-gray-200'}`}></div>
        </div>
        <span className={`ml-3 text-sm ${isYearly ? 'font-medium' : ''}`}>Yearly</span>
    </div>
);
export default ToggleSwitch;  