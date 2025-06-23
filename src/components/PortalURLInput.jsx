import React, { useCallback } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { handleError } from '../utils/validationUtils';
import { setPersonalInfoStep } from '../store/slices/authSlice';
import { validatePortalURL } from '../store/thunk/authThunks';
import { debounce } from '@/utils';
import { useState } from 'react';

// Restricted keywords for subdomain
const RESTRICTED_KEYWORDS = [
  'portal', 'dashboard', 'www', 'admin', 'api', 'app', 'mail', 'email',
  'ftp', 'sftp', 'ssh', 'blog', 'shop', 'store', 'support', 'help',
  'docs', 'documentation', 'test', 'staging', 'dev', 'development',
  'prod', 'production', 'demo', 'beta', 'alpha', 'preview', 'cdn',
  'static', 'assets', 'media', 'files', 'download', 'upload', 'backup',
  'security', 'secure', 'ssl', 'vpn', 'proxy', 'gateway', 'router',
  'server', 'host', 'domain', 'subdomain', 'localhost', 'huehq'
];

const isValidSubdomain = (value) => {
  // Check if empty
  if (!value || value.trim() === '') {
    return { isValid: false, message: "Subdomain cannot be empty." };
  }

  // Check length (must be between 1-63 characters)
  if (value.length < 1 || value.length > 63) {
    return { isValid: false, message: "Subdomain must be between 1-63 characters." };
  }

  // Check for valid subdomain format
  // Must start and end with alphanumeric, can contain hyphens in middle
  const subdomainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
  if (!subdomainRegex.test(value)) {
    return { isValid: false, message: "Subdomain must start and end with a letter or number, and can only contain letters, numbers, and hyphens." };
  }

  // Check for consecutive hyphens
  if (value.includes('--')) {
    return { isValid: false, message: "Subdomain cannot contain consecutive hyphens." };
  }

  // Check for invalid characters (only allow a-z, A-Z, 0-9, and -)
  const invalidChars = value.match(/[^a-zA-Z0-9-]/g);
  if (invalidChars) {
    return { isValid: false, message: `Invalid characters found: ${[...new Set(invalidChars)].join(', ')}` };
  }

  // Check for restricted keywords (case-insensitive, exact match only)
  const lowerValue = value.toLowerCase();
  const restrictedKeyword = RESTRICTED_KEYWORDS.find(keyword => 
    lowerValue === keyword
  );
  
  if (restrictedKeyword) {
    return { isValid: false, message: `"${restrictedKeyword}" is a restricted keyword and cannot be used.` };
  }

  // Check for common inappropriate terms
  const inappropriateTerms = ['test', 'demo', 'example', 'sample', 'temp', 'temporary'];
  const inappropriateTerm = inappropriateTerms.find(term => lowerValue.includes(term));
  if (inappropriateTerm) {
    return { isValid: false, message: `"${inappropriateTerm}" is not recommended for production use.` };
  }

  return { isValid: true, message: "" };
};

const PortalURLInput = ({ value, handleChange, setStopGoForward }) => {
  const dispatch = useDispatch();
  const { portalURLValidation, personalInfoStep } = useSelector((state) => state.auth);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLocallyValid, setIsLocallyValid] = useState(true);

  const debounceValidateURL = useCallback(debounce((url) => {
    dispatch(validatePortalURL(url));
  }, 500), [dispatch]);

  const handleURLChange = (url) => {
    // Trim whitespace and convert to lowercase for consistency
    const cleanUrl = url.trim().toLowerCase();
    
    // Validate subdomain format and restrictions
    const validation = isValidSubdomain(cleanUrl);
    
    if (!validation.isValid) {
      setErrorMessage(validation.message);
      setIsLocallyValid(false);
      setStopGoForward(true);
      handleChange(cleanUrl); // Still update the value for user feedback
      return;
    }

    // Clear local validation errors
    setErrorMessage("");
    setIsLocallyValid(true);
    setStopGoForward(true);
    handleChange(cleanUrl);

    // Check network connectivity
    if (!navigator.onLine) {
      setErrorMessage("You appear to be offline. Portal URL cannot be validated right now.");
      return;
    }

    // Perform remote validation
    debounceValidateURL(cleanUrl);
  };

  // Determine the overall validation state
  const getValidationState = () => {
    if (!isLocallyValid) {
      return 'invalid';
    }
    if (portalURLValidation.isChecking) {
      return 'checking';
    }
    if (portalURLValidation.isAvailable === true) {
      return 'available';
    }
    if (portalURLValidation.isAvailable === false) {
      return 'unavailable';
    }
    return 'neutral';
  };

  const validationState = getValidationState();

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
          className={`block w-full rounded-l-md border shadow-sm py-2 px-3 focus:outline-none focus:ring-2 sm:text-sm ${
            validationState === 'invalid' 
              ? 'border-red-300 focus:ring-red-600 focus:border-red-600' 
              : validationState === 'available'
              ? 'border-green-300 focus:ring-green-600 focus:border-green-600'
              : 'border-gray-300 focus:ring-blue-600 focus:border-blue-600'
          }`}
          placeholder="yourcompany"
          maxLength={63}
          pattern="[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]"
          title="Enter a valid subdomain (letters, numbers, and hyphens only)"
        />
        <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 sm:text-sm">
          .huehq.com
        </span>
        <div className="ml-2">
          <button
            className={`w-10 h-10 rounded-md flex items-center justify-center ${
              validationState === 'available' ? 'bg-green-100' :
              validationState === 'invalid' || validationState === 'unavailable' ? 'bg-red-100' :
              'bg-gray-100'
            }`}
            disabled={portalURLValidation.isChecking}
            type="button"
            title={
              validationState === 'checking' ? 'Checking availability...' :
              validationState === 'available' ? 'Available' :
              validationState === 'unavailable' ? 'Not available' :
              validationState === 'invalid' ? 'Invalid format' :
              'Enter a subdomain to check'
            }
          >
            {validationState === 'checking' ? (
              <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600"></span>
            ) : validationState === 'available' ? (
              <CheckCircle className="text-green-500 w-5 h-5" />
            ) : (validationState === 'invalid' || validationState === 'unavailable') ? (
              <XCircle className="text-red-500 w-5 h-5" />
            ) : null}
          </button>
        </div>
      </div>

      {errorMessage && (
        <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
      )}
      
      {!errorMessage && portalURLValidation.message && (
        <p className={`text-sm mt-2 ${portalURLValidation.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
          {portalURLValidation.message}
        </p>
      )}

      {/* Helper text */}
      <p className="text-xs text-gray-500 mt-1">
        Use only letters, numbers, and hyphens. Cannot start with restricted keywords like "portal", "dashboard", "www", etc.
      </p>
    </div>
  );
};

export default PortalURLInput;