import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getOrCreateUser } from '../lib/auth';
import { handleFirebaseError } from '../utils/firebase';
import useSignupContext from '../context/SignupContext';

export const useSignup = () => {

    const { personalInfoStep, businessDetailsStep, step, setStep } = useSignupContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (step === 1) setIsLoading(false);
    }, [step]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const signup = async () => {
        if (email && password) {
            setIsLoading(true);
            setError('');

            try {
                const { user } = await createUserWithEmailAndPassword(auth, email, password);
                await getOrCreateUser(user, {
                    ...personalInfoStep,
                    ...businessDetailsStep,
                    isProfileCompleted: false,
                    uid: user.uid,
                    portals: [],
                    email
                });

                setStep(step + 1);
                setIsLoading(false);
            } catch (err) {
                console.log(err)
                setIsLoading(false);
                handleFirebaseError(err.code, setError);
            }
        } else {
            setError('Please fill all the information.');
        }
    };



    return {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        error,
        handleChange,
        signup,
    };
};
