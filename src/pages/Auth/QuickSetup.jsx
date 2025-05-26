
import React, { useContext, useEffect } from 'react'
import AccountSetupCompletion from '../../components/internal/AccountSetupCompletion'
import { useState } from 'react';
import SignupSteps from './SignupSteps';
import { useSelector } from 'react-redux';
import { AuthListenerContext } from './AuthListener';
import { Spinner } from '@phosphor-icons/react';
import { useDispatch } from 'react-redux';
import { setStep } from '../../store/slices/authSlice';
import { Layout } from './Layout';

const QuickSetup = () => {
    const [shouldShowStep, setShouldShowStep] = useState(false);
    const { user, step } = useSelector((state) => state.auth);
    const { isLoading } = useContext(AuthListenerContext);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setStep(2))
    }, [])

    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Spinner className='w-7 h-7 animate-spin' />
            </div>
        )
    }

    if (user && !user?.is_profile_completed && !shouldShowStep) {
        setShouldShowStep(true)
    }

    const handleSetStep = (step) => {
        dispatch(setStep(step))
    }

    const handleSetShouldShowStep = (shouldShowStep) => {
        setShouldShowStep(shouldShowStep)
        dispatch(setStep(2))

    }




    return (
        <>
            {
                !user && <AccountSetupCompletion setShouldShowStep={handleSetShouldShowStep} />
            }
            {
                shouldShowStep && !user?.is_profile_completed && <SignupSteps step={step} setStep={handleSetStep} />
            }
        </>

    )
}

export default QuickSetup