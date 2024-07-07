import React from 'react'
import SignupForm from './SignupForm';
import SignupSteps from './SignupSteps';
import { Layout } from './Layout';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setStep } from '../../store/slices/authSlice';




/**
 * The Signup component orchestrates the signup process, controlling the flow
 * of the signup steps and rendering the appropriate components based on the
 * current step. It utilizes the SignupContext for managing the state of the
 * signup process.
 */
export const Signup = () => {
  const step = useSelector((state) => state.auth.step);
  const dispatch = useDispatch();
  // Function to render the current step's component

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        // The initial signup form
        return <SignupForm />;
      default:
        // Handles subsequent signup steps and onboarding questions
        return <SignupSteps step={step} setStep={(newStep) => dispatch(setStep(newStep))} />;
    }
  };

  return (

    <Layout>
      {renderCurrentStep()}
    </Layout>


  );
};
