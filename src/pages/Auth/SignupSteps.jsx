// Main SignupSteps Component
import { PersonalInfoStep, BusinessDetailsStep } from './SignupSteps/index';
import { useSelector } from 'react-redux';
import { Check } from 'lucide-react';

/**
 * Component to manage and display the different steps in the signup process.
 * It dynamically renders the current step's component based on the `step` prop.
 */
const SignupSteps = ({ isLargerThan450, step, setStep }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            {/* Logo Header */}
            <div className="w-full max-w-md flex items-center justify-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                        <span className="text-white font-semibold">H</span>
                    </div>
                    <span className="font-medium text-gray-800">HueHQ</span>
                </div>
            </div>
            
            {/* Card Container - Only show for steps 2 & 3 (original steps in your code) */}
            {step < 4 && (
                <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    {/* Logo Placeholder */}
                    <div className="flex justify-center mb-6">
                        <div className="h-8 w-32 bg-gray-100 rounded-md flex items-center justify-center">
                            <span className="text-sm text-gray-500">Your Company</span>
                        </div>
                    </div>
                    
                    {/* Heading - This comes from your Header component now */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Finish creating your account</h1>
                        <p className="text-sm text-gray-500">
                            {step === 2 ? 
                                "First things first, tell us a bit about yourself" : 
                                "First things first, tell us a bit about your business"}
                        </p>
                    </div>
                    
                    {/* Step Indicator - Only show 2 steps */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                                1
                            </div>
                            <div className={`w-24 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                            <div className={`w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center font-medium`}>
                                2
                            </div>
                        </div>
                    </div>
                    
                    {/* Render the step content using your existing components */}
                    {step === 2 && <PersonalInfoStep isLargerThan450={isLargerThan450} />}
                    {step === 3 && <BusinessDetailsStep isLargerThan450={isLargerThan450} />}
                </div>
            )}
            
            {/* Step 4 - Success Message (Completely separate from previous card) */}
            {step === 4 && (
                <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Check className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">You're all set!</h2>
                    <p className="text-gray-500 mb-6">Your account has been created successfully.</p>
                    <button 
                        className="w-full bg-black text-white rounded-md py-2 px-4 shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        onClick={() => window.location.href = '/'}
                    >
                        Go to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default SignupSteps;