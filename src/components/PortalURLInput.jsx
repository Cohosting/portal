import React, { useCallback } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';

import { handleError } from '../utils/validationUtils';
import { setPersonalInfoStep } from '../store/slices/authSlice';
import { validatePortalURL } from '../store/thunk/authThunks';

import _ from 'lodash'
import InputField from './InputField';
const isValidSubdomain = value => {
    // Regex for valid subdomain:
    // - Starts and ends with alphanumeric characters
    // - Can contain hyphens, but not at the start or end
    // - Length between 1 and 63 characters
    const subdomainRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
    return subdomainRegex.test(value);
};
const PortalURLInput = ({ value, handleChange, setStopGoForward }) => {
    const dispatch = useDispatch();
    const { portalURLValidation, personalInfoStep } = useSelector((state) => state.auth);

    const debounceValidateURL = useCallback(_.debounce((url) => {
        dispatch(validatePortalURL(url));
    }, 500), [dispatch]);

    const handleURLChange = (url) => {

        if (!isValidSubdomain(url)) {
            console.log(``)
            return;
        }

        console.log(`Valid`)

        console.log(`valid subdomain: ${url}`)
        setStopGoForward(true);
        handleChange(url);

        debounceValidateURL(url);

    };

    return (
        <>
            <div className="flex items-end">
                <InputField
                    name={'portalURL'}
                    value={personalInfoStep.portalURL}
                    type="text"
                    errorMessage={'Portal URL'}
                    handleChange={(e) => handleURLChange(e.target.value)}
                    label={(
                        <div>
                            Portal URL - <span className="text-xs text-gray-500">You can connect a custom domain later</span>
                        </div>
                    )}
                    className="border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent invalid:border-red-300 invalid:ring-red-300"
                />
                <span className="text-sm text-gray-500 mr-2">.copilot.app</span>
                <button
                    className="ml-3 w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center"
                    disabled={portalURLValidation.isChecking}
                >
                    {portalURLValidation.isChecking ? (
                        <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600"></span>
                    ) : portalURLValidation.isAvailable ? (
                        <FaCheckCircle className="text-green-500 text-xl" />
                    ) : (
                        <AiOutlineCloseCircle className="text-red-500 text-xl" />
                    )}
                </button>
            </div>
        </>
    );
};

export default PortalURLInput;