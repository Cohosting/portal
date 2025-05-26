import React from 'react';

const PlanOption = ({ name, monthly, yearly, description, isCurrentPlan, isSelected, isYearly, onClick }) => {
    const monthlyPrice = monthly.price;
    const yearlyPrice = yearly.price;
    return (
        <div
            className={`flex items-center p-3 rounded-lg border ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} cursor-pointer`}
            onClick={onClick}
        >
            <div className="flex-grow">
                <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="font-medium text-sm">{name}</span>
                    {isCurrentPlan && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Current</span>}
                </div>
                <p className="text-xs text-gray-600 mt-1">{description}</p>
                <div className="mt-2">
                    <span className="font-bold text-sm">${isYearly ? yearlyPrice : monthlyPrice}</span>
                    <span className="text-xs text-gray-600">/{isYearly ? 'year' : 'month'}</span>
                    {isYearly && (
                        <span className="ml-2 text-xs text-green-600">Save ${monthlyPrice * 12 - yearlyPrice}/year</span>
                    )}
                </div>
            </div>
            <input type="radio" checked={isSelected} className="w-4 h-4 text-blue-600" readOnly />
        </div>
    );
}
export default PlanOption;