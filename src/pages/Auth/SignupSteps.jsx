import { PersonalInfoStep, BusinessDetailsStep } from './SignupSteps/index';

/**
 * Component to manage and display the different steps in the signup process.
 * It dynamically renders the current step's component based on the `step` prop.

 */
const SignupSteps = ({ isLargerThan450, step, setStep }) => {

    // Define a function to handle rendering based on the current step
    const renderStepComponent = (step, isLargerThan450) => {
        switch (step) {
            case 2:
                return <PersonalInfoStep isLargerThan450={isLargerThan450} />;
            case 3:
                return <BusinessDetailsStep isLargerThan450={isLargerThan450} />;
            default:
                return null; // Return null or a default component for steps not handled
        }
    };
    return (
        <>

            <div className="mt-10 h-screen sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">

                    {renderStepComponent(step, isLargerThan450)}

                </div>
            </div>

            {/* Call the function to render the current step's component */}
        </>
    );
};

export default SignupSteps;