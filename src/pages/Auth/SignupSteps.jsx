import { Button } from '@chakra-ui/react';
import { FaChevronLeft } from 'react-icons/fa';
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
            {/* Render a "Back" button if not on the first step */}
            {step !== 1 && (
                <Button
                    color={'#263238'}
                    onClick={() => setStep(step - 1)}
                    justifySelf={'start'}
                    gap=".5rem"
                    align="center"
                    fontSize={'14px'}
                    top="50px"
                    left={'40px'}
                    position={'absolute'}
                    zIndex={100}
                >
                    <FaChevronLeft />
                    Back
                </Button>
            )}

            {/* Call the function to render the current step's component */}
            {renderStepComponent(step, isLargerThan450)}
        </>
    );
};

export default SignupSteps;