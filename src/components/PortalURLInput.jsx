import React, { useCallback } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { handleError } from '../utils/validationUtils';
import { setPersonalInfoStep } from '../store/slices/authSlice';
import { validatePortalURL } from '../store/thunk/authThunks';
import { debounce } from '@/utils';
import { useState } from 'react';

const isValidSubdomain = value => {
    const subdomainRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
    return subdomainRegex.test(value);
};

const PortalURLInput = ({ value, handleChange, setStopGoForward }) => {
    const dispatch = useDispatch();
    const { portalURLValidation, personalInfoStep } = useSelector((state) => state.auth);
    const [errorMessage, setErrorMessage] = useState("");
  
    const debounceValidateURL = useCallback(debounce((url) => {
      dispatch(validatePortalURL(url));
    }, 500), [dispatch]);
  
    const handleURLChange = (url) => {
      if (!isValidSubdomain(url)) {
        setErrorMessage("Invalid subdomain format.");
        return;
      }
  
      setStopGoForward(true);
      handleChange(url);
      setErrorMessage(""); // Clear previous errors
  
      if (!navigator.onLine) {
        setErrorMessage("You appear to be offline. Portal URL cannot be validated right now.");
        return;
      }
  
      debounceValidateURL(url);
    };
  
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Portal URL - <span className="text-xs text-gray-500">You can connect a custom domain later</span>
        </label>
  
        <div className="flex items-center">
          <input 
            type="text" 
            value={personalInfoStep.portal_url || ''}
            onChange={(e) => handleURLChange(e.target.value)}
            className="block w-full rounded-l-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
            placeholder="yourcompany"
          />
          <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 sm:text-sm">
            .huehq.com
          </span>
          <div className="ml-2">
            <button
              className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center"
              disabled={portalURLValidation.isChecking}
              type="button"
            >
              {portalURLValidation.isChecking ? (
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600"></span>
              ) : portalURLValidation.isAvailable ? (
                <CheckCircle className="text-green-500 w-5 h-5" />
              ) : (
                <XCircle className="text-red-500 w-5 h-5" />
              )}
            </button>
          </div>
        </div>
  
        {errorMessage && (
          <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
        )}
      </div>
    );
  };
  
export default PortalURLInput;
