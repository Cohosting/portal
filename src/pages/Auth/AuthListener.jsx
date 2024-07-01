import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { setError, setIsAuthenticated, setStatus, setStep, setUser } from '../../store/slices/authSlice';
;

const AuthListener = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                onSnapshot(
                    doc(db, 'users', user.uid),
                    (snapshot) => {
                        const userData = { ...snapshot.data() };
                        if (userData.isProfileCompleted === false) {
                            dispatch(setStep(2));
                        }
                        dispatch(setUser(userData));
                        dispatch(setIsAuthenticated(true));
                        dispatch(setStatus('succeeded'));
                    },
                    (error) => {
                        dispatch(setError(error.message));
                        dispatch(setStatus('failed'));
                    }
                );
            } else {
                dispatch(setUser(null));
                dispatch(setIsAuthenticated(false));
                dispatch(setStatus('succeeded'));
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    return <>{children}</>;
};

export default AuthListener;
