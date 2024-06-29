import React, { useContext, } from 'react'
import SignupForm from './SignupForm';
import SignupSteps from './SignupSteps';
import { AuthBox, Layout } from './Layout';
import useSignupContext from '../../context/SignupContext';

export const boxStyle = {
  flexDirection: 'column',
  boxShadow: '0px 0px 24px rgba(0, 0, 0, 0.07)',
  padding: '24px 28px 28px 40px',
  border: '1px solid #EFF1F4',
};


/**
 * The Signup component orchestrates the signup process, controlling the flow
 * of the signup steps and rendering the appropriate components based on the
 * current step. It utilizes the SignupContext for managing the state of the
 * signup process.
 */
export const Signup = () => {
  const { step, setStep } = useSignupContext()

  // Function to render the current step's component

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        // The initial signup form
        return <SignupForm />;
      default:
        // Handles subsequent signup steps and onboarding questions
        return <SignupSteps step={step} setStep={setStep} />;
    }
  };

  return (

    <Layout>
      <AuthBox>
        {renderCurrentStep()}
      </AuthBox>
    </Layout>


  );
};
