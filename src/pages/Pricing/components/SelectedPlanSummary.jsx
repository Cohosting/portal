import React from "react";
import FeatureList from "./FeatureList";

const SelectedPlanSummary = ({ tier, frequency, handleChangePlan }) => {
    return (
        <div className=" p-6 rounded-lg  ">
            <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-900">Plan Summary</h2>
                <button className="ml-4 text-blue-500 hover:underline" onClick={handleChangePlan} >Change Plan</button>

            </div>
            <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-800">Selected Plan: {tier.name} - ({frequency})</h3>

                <FeatureList features={tier.features} />
            </div>
        </div>
    );
};

export default SelectedPlanSummary;
