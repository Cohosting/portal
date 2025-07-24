import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { defaultBrandSettings, deriveColors, getComputedColors } from '@/utils/colorUtils';

/**
 * SetPassword - A reusable component for setting/resetting passwords with full theming support
 * 
 * @param {Object} props
 * @param {string} props.title - Title for the form
 * @param {string} props.description - Optional description text
 * @param {string} props.buttonText - Text for the submit button
 * @param {boolean} props.isLoading - Loading state for the button
 * @param {string} props.error - Error message to display
 * @param {function} props.onSubmit - Function to call on form submission, receives passwords object
 * @param {function} props.onCancel - Optional function to call if the user wants to cancel
 * @param {Object} props.portal - Portal object containing brand settings
 * @param {Object} props.brandSettings - Brand settings override (fallback to portal.brand_settings or defaults)
 */
export const SetPassword = ({
  title = "Set your password",
  description,
  buttonText = "Set password",
  isLoading = false,
  error,
  onSubmit,
  onCancel,
  portal,
  brandSettings: propBrandSettings
}) => {
  const navigate = useNavigate();
  
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: '',
  });
  
  const [passwordsVisible, setPasswordsVisible] = useState({
    password: false,
    confirmPassword: false,
  });
  
  const [validationError, setValidationError] = useState('');

  // Decide where portal data comes from - same logic as ClientLogin
  const brandSettings = propBrandSettings || portal?.brand_settings || defaultBrandSettings;

  // Compute colors based on advanced options toggle - same logic as ClientLogin
  const colors = useMemo(() => {
    return brandSettings.showAdvancedOptions 
      ? getComputedColors(brandSettings) 
      : deriveColors(brandSettings.baseColors);
  }, [brandSettings]);

  const {
    loginButtonColor,
    loginButtonTextColor,
    loginButtonHoverColor,
    loginInputBorderColor,
    loginInputFocusBorderColor,
    loginFormTextColor,
  } = colors;

  // Dynamic styles using CSS variables - same approach as ClientLogin
  const themeStyles = {
    '--input-border-color': loginInputBorderColor || '#d1d5db',
    '--input-focus-border-color': loginInputFocusBorderColor || '#3b82f6',
    '--input-focus-ring-color': loginInputFocusBorderColor || '#3b82f6',
    '--button-bg-color': loginButtonColor || '#1E40AF',
    '--button-text-color': loginButtonTextColor || '#ffffff',
    '--button-hover-color': loginButtonHoverColor || '#1e3a8a',
    '--accent-color': loginButtonColor || '#1E40AF',
    '--form-text-color': loginFormTextColor || '#374151',
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user types
    if (validationError) {
      setValidationError('');
    }
  };

  const togglePasswordVisibility = (field) => {
    setPasswordsVisible(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (passwords.password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }
    
    if (passwords.password !== passwords.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    // Call the provided onSubmit function with the passwords
    onSubmit(passwords);
  };

  const handleBackToLogin = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <style>{`
        .themed-input {
          border-color: var(--input-border-color);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        
        .themed-input:focus {
          border-color: var(--input-focus-border-color) !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          outline: none;
        }
        
        .themed-input:focus-visible {
          ring: 2px solid var(--input-focus-ring-color);
          ring-offset: 2px;
        }
        
        .themed-button {
          background-color: var(--button-bg-color);
          color: var(--button-text-color);
          border: none;
          transition: background-color 0.2s ease;
        }
        
        .themed-button:hover:not(:disabled) {
          background-color: var(--button-hover-color);
        }
        
        .themed-button:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
          outline: none;
        }
        
        .themed-link {
          color: var(--accent-color);
        }
        
        .themed-link:hover {
          opacity: 0.8;
        }
        
        .themed-text {
          color: var(--form-text-color);
        }
        
        .themed-title {
          color: var(--form-text-color);
        }
      `}</style>
      
      <div style={{
        ...themeStyles,
        backgroundColor: brandSettings.baseColors.background
      }} >
        <div className="space-y-6">
          <div>
            <h2 className="themed-title text-2xl font-bold leading-9 tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="themed-text mt-2 text-sm leading-6">
                {description}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="themed-text text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={passwordsVisible.password ? "text" : "password"}
                  value={passwords.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="themed-input w-full pr-10 bg-white text-black"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('password')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  tabIndex={-1}
                >
                  {passwordsVisible.password ? (
                    <EyeOff size={18} className="text-gray-500" />
                  ) : (
                    <Eye size={18} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="themed-text text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={passwordsVisible.confirmPassword ? "text" : "password"}
                  value={passwords.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                  className="themed-input w-full pr-10 bg-white text-black"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  tabIndex={-1}
                >
                  {passwordsVisible.confirmPassword ? (
                    <EyeOff size={18} className="text-gray-500" />
                  ) : (
                    <Eye size={18} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {(validationError || error) && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">
                  {validationError || error}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                type="submit"
                className="themed-button w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : buttonText}
              </Button>
              
              <Button
                type="button"
                variant="link"
                className="themed-link flex items-center text-sm gap-2 p-0 hover:underline"
                onClick={handleBackToLogin}
              >
                <ArrowLeft size={16} />
                Back to sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};