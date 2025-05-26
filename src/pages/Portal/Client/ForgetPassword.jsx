import { supabase } from '@/lib/supabase';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthLayout } from './components/AuthLayout';
import { SetPassword } from './components/SetPassword';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
   
export const ForgetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenStatus, setTokenStatus] = useState('validating'); // validating, valid, invalid, expired, used
  const [clientData, setClientData] = useState(null);
  const [portal, setPortal] = useState(null);

  // Validate token and fetch related data when component mounts
  useEffect(() => {
    const validateTokenAndFetchData = async () => {
      if (!token) {
        setTokenStatus('invalid');
        return;
      }
      
      try {
        setIsLoading(true);
        
        // First, get the client data associated with the reset token
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('id, name, email, reset_token_expires_at, reset_token_used, portal_id')
          .eq('reset_password_token', token)
          .single();
        
        if (clientError || !clientData) {
          console.error('Client data error:', clientError);
          setTokenStatus('invalid');
          setIsLoading(false);
          return;
        }
        
        // Check if token is expired
        const expiryDate = new Date(clientData.reset_token_expires_at);
        if (expiryDate < new Date()) {
          setTokenStatus('expired');
          setIsLoading(false);
          return;
        }
        
        // Check if token is already used
        if (clientData.reset_token_used) {
          setTokenStatus('used');
          setIsLoading(false);
          return;
        }
        
        // Check if client has a portal_id
        if (!clientData.portal_id) {
          setTokenStatus('no_portal');
          setClientData(clientData);
          setIsLoading(false);
          return;
        }
        
        // Token is valid and client has portal_id, now fetch the portal data
        const { data: portalData, error: portalError } = await supabase
          .from('portals')
          .select('*')
          .eq('id', clientData.portal_id)
          .single();
          
        if (portalError || !portalData) {
          console.error('Error fetching portal data:', portalError);
          setTokenStatus('no_portal');
          setClientData(clientData);
          setIsLoading(false);
          return;
        }
        
        // All checks passed, set data and mark token as valid
        setPortal(portalData);
        setClientData(clientData);
        setTokenStatus('valid');
      } catch (err) {
        console.error('Error validating token or fetching data:', err);
        setTokenStatus('invalid');
      } finally {
        setIsLoading(false);
      }
    };
    
    validateTokenAndFetchData();
  }, [token]);
  
  const handlePasswordReset = async (passwords) => {
    if (!clientData || !portal) return;
    
    setIsLoading(true);
    setError('');
 
    try {
      // For client-side password hashing, use bcryptjs
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(passwords.password, 10);
      
      // Update client record
      const { error } = await supabase
        .from('clients')
        .update({
          password: hashedPassword,
          reset_token_used: true,
          // No need to change status as user is already active
        })
        .eq('id', clientData.id);
      
      if (error) throw error;
      
      // Redirect to login page with success message
      navigate('/login?passwordReset=true');
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Loading state
  if (tokenStatus === 'validating') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden">
          <div className="h-1 bg-blue-500"></div>
          <CardHeader className="space-y-2 text-center pb-6 border-b border-gray-100">
            <CardTitle className="text-2xl font-semibold tracking-tight">Validating Reset Link</CardTitle>
            <CardDescription className="text-gray-500">Please wait while we verify your password reset link</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-10">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
              <p className="text-sm text-gray-500">Checking reset link details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Error states (without AuthLayout)
  if (tokenStatus !== 'valid') {
    let title, description, icon;
    
    switch (tokenStatus) {
      case 'invalid':
        title = "Invalid Reset Link";
        description = "This password reset link is invalid or has been tampered with.";
        icon = "❌";
        break;
      case 'expired':
        title = "Reset Link Expired";
        description = "This password reset link has expired. Please request a new password reset.";
        icon = "⏱️";
        break;
      case 'used':
        title = "Reset Link Already Used";
        description = "This password reset link has already been used.";
        icon = "✓";
        break;
      case 'no_portal':
        title = "Portal Not Available";
        description = "Your account is not associated with an active portal. Please contact support for assistance.";
        icon = "🔒";
        break;
      default:
        title = "Error";
        description = "An unexpected error occurred while processing your password reset.";
        icon = "⚠️";
    }
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="text-4xl mb-2">{icon}</div>
            <CardTitle className="text-2xl font-semibold tracking-tight">{title}</CardTitle>
            <CardDescription className="text-gray-600">{description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-6 px-8">
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
              If you believe this is an error, please contact your administrator or support team for assistance.
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-8 px-8">
            <Button 
              onClick={() => navigate('/login')}
              variant="default"
              className="w-full bg-black text-white hover:bg-gray-800 rounded-lg py-6 font-medium transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
            >
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Valid token state (with AuthLayout)
  return (
    <AuthLayout
      portal={portal}
      title="Reset Your Password"
      subtitle={`Hello ${clientData?.name}. Please set your new password to access the portal.`}
    >
      <SetPassword
        buttonText="Reset Password"
        isLoading={isLoading}
        error={error}
        onSubmit={handlePasswordReset}
        onCancel={() => navigate('/login')}
        brandSettings={portal?.brand_settings}
      />
    </AuthLayout>
  );
};