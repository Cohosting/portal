import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
 import { useNavigate } from 'react-router-dom';

/**
 * SetPassword - A reusable component for setting/resetting passwords
 * 
 * @param {Object} props
 * @param {string} props.title - Title for the form
 * @param {string} props.description - Optional description text
 * @param {string} props.buttonText - Text for the submit button
 * @param {boolean} props.isLoading - Loading state for the button
 * @param {string} props.error - Error message to display
 * @param {function} props.onSubmit - Function to call on form submission, receives passwords object
 * @param {Object} props.buttonStyle - Optional styling for the button
 * @param {function} props.onCancel - Optional function to call if the user wants to cancel
 */
export const SetPassword = ({
  title  ,
  description,
  buttonText = "Set password",
  isLoading = false,
  error,
  onSubmit,
   onCancel,
  brandSettings = {
    loginFormTextColor: 'rgb(79, 70, 229)',
    loginButtonColor : 'rgb(79, 70, 229)',
    loginButtonTextColor: 'white',

  }
}) => {
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: '',
  });
  const [passwordsVisible, setPasswordsVisible] = useState({
    password: false,
    confirmPassword: false,
  });
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate()

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
    navigate('/login')
  }

  return (
    <div className="space-y-6" style={{ color: brandSettings.loginFormTextColor }}>
      <div>
        <h2 className="text-2xl font-bold leading-9 tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm leading-6">
            {description}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className=" "   >
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
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
              className="w-full pr-10 bg-white text-black"
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

        <div className="space-y-2  my-4 mb-7">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
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
              className="w-full pr-10 bg-white text-black"
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
          <p className="text-sm text-red-500">
            {validationError || error}
          </p>
        )}

        <div className="flex flex-col gap-3 mt-4">
          <Button
            type="submit"
            className="w-full text-white"
            style={{
              background: brandSettings.loginButtonColor,
              color: brandSettings.loginButtonTextColor
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : buttonText}
          </Button>
                <Button
                  type="button"
                  variant="link"
                  className="flex items-center text-sm gap-2 p-0"
                  onClick={handleBackToLogin}
                >
                  <ArrowLeft size={16} />
                  Back to sign in
                </Button>
          
 
        </div>
      </form>
    </div>
  );
}