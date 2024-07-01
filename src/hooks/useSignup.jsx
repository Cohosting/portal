import { useSelector, useDispatch } from 'react-redux';
import {
    setEmail,
    setPassword,

} from './../store/slices/authSlice';
import { setError } from '../store/slices/authSlice';
import { signupUser } from '../store/thunk/authThunks';

export const useSignup = () => {
    const dispatch = useDispatch();
    const { personalInfoStep, businessDetailsStep, status, error, email, password } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            dispatch(setEmail(value));
        } else if (name === 'password') {
            dispatch(setPassword(value));
        }
    };

    const signup = async () => {
        if (email && password) {
            dispatch(signupUser({ email, password, personalInfoStep, businessDetailsStep }));
        } else {
            dispatch(setError('Please fill all the information.'));
        }
    };

    return {
        email,
        password,
        isLoading: status === 'loading',
        error,
        handleChange,
        signup,
    };
};
