import React, { useState, useMemo } from 'react';
import { useClientAuth } from '../../../hooks/useClientAuth';
import axiosInstance from '@/api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { AuthLayout } from './components/AuthLayout';
import { toast } from 'react-toastify';
import {
  defaultBrandSettings,
  deriveColors,
  getComputedColors
} from '@/utils/colorUtils';

export const ClientLogin = ({ portal }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [viewMode, setViewMode] = useState('login');
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [resetError, setResetError] = useState(null);

  // Decide where portal data comes from
  // If portal prop is missing, you could fetch it here via usePortalData
  const brandSettings = portal?.brand_settings || defaultBrandSettings;

  // Compute colors based on advanced options toggle
  const colors = useMemo(() => {
    return brandSettings.showAdvancedOptions 
      ? getComputedColors(brandSettings)     // Use advanced colors
      : deriveColors(brandSettings.baseColors); // Ignore advanced colors completely
  }, [brandSettings]);

  const {
    loginButtonColor,
    loginButtonTextColor,
    loginButtonHoverColor,
     
  } = colors;
 
  const { authenticate, clientUser, authenticationError, isLoading } = useClientAuth(
    portal?.id
  );
  const { email, password } = credentials;

  // Redirect on successful login
  if (clientUser) {
    const firstApp = portal?.portal_apps
      ?.sort((a, b) => a.index - b.index)[0]
      ?.name;
    navigate(`/portal/${firstApp}`, { replace: true });
  }

  const handleLogin = (e) => {
    e.preventDefault();
    authenticate(email, password, portal.id);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsResetting(true);
    setResetError(null);
    try {
      await axiosInstance.post('/auth/forgot-password', {
        email: resetEmail,
        portal_id: portal.id
      });
      setResetSubmitted(true);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === 'client not found') {
        setResetSubmitted(true);
      } else {
        toast.error(msg || 'Something went wrong.');
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

  const title =
    viewMode === 'login' ? 'Sign in to your account' : 'Reset your password';
  const subtitle =
    viewMode === 'forgotPassword'
      ? "Enter your email address and we'll send you instructions to reset your password."
      : null;

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value.trim() })
          }
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
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            placeholder="Enter your password"
            required
            className="w-full pr-10 text-black bg-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
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
          <Checkbox 
            id="remember-me" 
            style={{ accentColor: loginButtonColor || '#1E40AF' }}
            className="focus:ring-2"
          />
          <Label htmlFor="remember-me" className="text-sm">
            Remember me
          </Label>
        </div>
        <div className="text-sm">
          <a
            href="#"
            className="font-semibold hover:underline"
            style={{ color: loginButtonColor || '#1E40AF' }}
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

      {authenticationError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            {authenticationError}
          </AlertDescription>
        </Alert>
      )}

<Button
      type="submit"
      className="w-full btn-dynamic"
      disabled={isLoading}
      style={{
        '--btn-bg':    loginButtonColor,
        '--btn-hover': loginButtonHoverColor,
        '--btn-text':  loginButtonTextColor,
      }}
    >
      {isLoading ? 'Loading…' : 'Sign in'}
    </Button>
    </form>
  );

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
              type="email"
              value={resetEmail}
              onChange={(e) =>
                setResetEmail(e.target.value.trim())
              }
              placeholder="Enter your email"
              required
              className="w-full bg-white text-black"
            />
          </div>
          {resetError && (
            <p className="text-sm text-red-500">{resetError}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            style={{
              backgroundColor: loginButtonColor || '#1E40AF',
              color: loginButtonTextColor || '#FFFFFF',
              border: 'none'
            }}
            disabled={isResetting}
          >
            {isResetting ? 'Processing...' : 'Send reset instructions'}
          </Button>
        </form>
      ) : (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            If an account exists with that email address, we've sent password reset instructions to your inbox.
          </AlertDescription>
        </Alert>
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

  return (
    <AuthLayout portal={portal} title={title} subtitle={subtitle} brandSettings={{
      ...brandSettings,
      colors
    }}>
      {viewMode === 'login' ? renderLoginForm() : renderForgotPasswordForm()}
    </AuthLayout>
  );
};