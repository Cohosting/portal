import React, { useState } from 'react';
import { useClientAuth } from '../../../hooks/useClientAuth';
import { darken } from 'polished';

// Import Auth Layout
 
// Import shadcn components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Import icons for password visibility toggle
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { AuthLayout } from './components/AuthLayout';
import { toast } from 'react-toastify';
import axiosInstance from '@/api/axiosConfig';
import { useNavigate } from 'react-router-dom';
  
export const ClientLogin = ({ portal }) => {
  const navigate = useNavigate();
  const [clientLoginCredentials, setClientLoginCredentials] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [viewMode, setViewMode] = useState('login'); // 'login' or 'forgotPassword'
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [resetError, setResetError] = useState(null);
  
  const { authenticate, clientUser, authenticationError, isLoading } = useClientAuth(portal.id);
  const { email, password } = clientLoginCredentials;

  let {
    sidebarTextColor = 'rgb(79, 70, 229)',
    accentColor = 'rgb(79, 70, 229)',
    sidebarActiveTextColor,
    loginButtonColor,
    loginButtonTextColor,
  } = portal?.brand_settings || {};

  sidebarTextColor = darken(0.4, sidebarTextColor);

  const handleLogin = (e) => {
    e.preventDefault()
   
    
    authenticate(email, password, portal.id);
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsResetting(true);
    setResetError(null);
    
    try {
      const response = await axiosInstance.post('/auth/forgot-password', {
        email: resetEmail,
        portal_id: portal.id,
      });


      
      // Simulate successful submission
      setResetSubmitted(true);
    } catch (err) {
      if (err.response && err.response.data) {
        const message = err.response.data.message;
    
        if (message === 'client not found') {

          setResetSubmitted(true);
        } else {
          toast.error(message || 'Something went wrong.');
        }
      } else {
        toast.error('We encountered an error processing your request. Please try again.');
      }
    } finally {
      setIsResetting(false);
    }
  };

  const handleBackToLogin = () => {
    setViewMode('login');
    setResetSubmitted(false);
    setResetError(null);
  };

  // Render the login form
  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setClientLoginCredentials({ ...clientLoginCredentials, email: e.target.value.trim() })}
          placeholder="Enter your email"
          required
          className="w-full bg-white text-black"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setClientLoginCredentials({ ...clientLoginCredentials, password: e.target.value })}
            placeholder="Enter your password"
            required
            className="w-full pr-10 text-black bg-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={18} className="text-gray-500" />
            ) : (
              <Eye size={18} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>


      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember-me" />
          <Label htmlFor="remember-me" className="text-sm">
            Remember me
          </Label>
        </div>

        <div className="text-sm">
          <a 
            href="#" 
            className="font-semibold hover:underline"
            onClick={(e) => {
              e.preventDefault();
              setViewMode('forgotPassword');
              setResetSubmitted(false);
              setResetError(null);
              setResetEmail('');
            }}
          >
            Forgot password?
          </a>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full text-white"
        style={{ backgroundColor: `${loginButtonColor}`, color: loginButtonTextColor }}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Sign in'}
      </Button>
    </form>
  );

  // Render the forgot password form
  const renderForgotPasswordForm = () => (
    <div className="mt-6 space-y-6">
      {!resetSubmitted ? (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="reset-email" className="text-sm font-medium">
              Email address
            </Label>
            <Input
              id="reset-email"
              name="reset-email"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value.trim())}
              placeholder="Enter your email"
              required
              className="w-full bg-white text-black"
            />
          </div>

          {resetError && (
            <p className="text-sm text-red-500">
              {resetError}
            </p>
          )}

          <Button
            type="submit"
            className="w-full text-white"
            style={{ backgroundColor: `${loginButtonColor}`, color: loginButtonTextColor }}
            disabled={isResetting}
          >
            {isResetting ? 'Processing...' : 'Send reset instructions'}
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              If an account exists with that email address, we've sent password reset instructions to your inbox.
            </AlertDescription>
          </Alert>
        </div>
      )}

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
  );

  // Determine the title and subtitle based on viewMode
  const title = viewMode === 'login' ? 'Sign in to your account' : 'Reset your password';
  const subtitle = viewMode === 'forgotPassword' 
    ? 'Enter your email address and we\'ll send you instructions to reset your password.'
    : null;
    console.log({
      portal
    })

    if(clientUser) {
      const url  = portal?.portal_apps?.sort((a, b) => a.index - b.index)[0]?.name;
      navigate(`/portal/${url}`, { replace: true });
    }

    
 
  return (
    <AuthLayout 
      portal={portal}
      title={title}
      subtitle={subtitle}
    >
      {viewMode === 'login' ? renderLoginForm() : renderForgotPasswordForm()}
    </AuthLayout>
  );
};