import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clients, industries, sizes, types } from "../../../utils/constant";
import { useNavigate } from 'react-router-dom';
import { setBusinessDetailsStep, setStep } from "../../../store/slices/authSlice";
import { initializeOrganizationSetup } from "../../../utils/signupUtils";
import useCustomerOnDemand from "../../../hooks/useCustomerOnDemand";
import { Briefcase, Users, Building } from 'lucide-react';

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
 import {Resend} from "resend";
import HueHQWelcomeEmail from "@/components/Emails/HueHQWelcomeEmail";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollAreaViewport } from "@radix-ui/react-scroll-area";
import { ScrollAreaThumb } from "@radix-ui/react-scroll-area";
import { ScrollAreaScrollbar } from "@radix-ui/react-scroll-area";

// vite
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);


const BusinessDetailsStep = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { personalInfoStep, businessDetailsStep, user, step } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const createCustomer = useCustomerOnDemand();

  const setupOrganizationAndNavigate = async () => {
    try {
      setIsLoading(true);
      setError('');
  
      // Step 1: Initialize organization setup
      await initializeOrganizationSetup(user, personalInfoStep, businessDetailsStep, createCustomer);
      
      console.log('✅ Organization setup completed');
  
      // Step 2: Send welcome email with Resend
      console.log('📧 Sending welcome email with Resend...', {
        to: user.email,
        userName: personalInfoStep.name,
        portalUrl: personalInfoStep.portal_url,
      });
  
      try {
        const { data, error } = await resend.emails.send({
          from: 'HueHQ <welcome@huehq.com>', // Replace with your verified domain
          to: [user.email],
          subject: 'Welcome to HueHQ - You\'re ready to go!',
          react: <HueHQWelcomeEmail
           />,
          tags: [
            { name: 'category', value: 'welcome' },
            { name: 'user_type', value: 'new_signup' }
          ],
        });
  
        if (error) {
          console.error('❌ Resend email error:', error);
          // Don't fail the entire flow for email issues
        } else {
          console.log('✅ Welcome email sent successfully:', {
            emailId: data.id,
            recipient: user.email
          });
        }
      } catch (emailError) {
        console.error('❌ Failed to send welcome email (non-blocking):', emailError);
        // Continue with the flow even if email fails
      }
  
      // Step 3: Navigate to success page
      dispatch(setStep(step + 1));
  
    } catch (err) {
      console.error('❌ Organization setup failed:', err);
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const areAllFieldsSelected = () => {
    return !Object.values(businessDetailsStep).includes('');
  };

  const handleSelectChange = (field, value) => {
    dispatch(setBusinessDetailsStep({
      ...businessDetailsStep,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        {/* Industry */}
        <div className="space-y-2">
          <Label htmlFor="industry">Which industry are you in?</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
            <Select
              value={businessDetailsStep.industry}
              onValueChange={(value) => handleSelectChange("industry", value)}
            >
              <SelectTrigger id="industry" className="pl-10 w-full">
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent
    position="popper"
    sideOffset={4}
    className="p-0"           // remove default padding if you like
  >
   <ScrollArea className="h-60">
    <ScrollAreaViewport>
      {industries.map((option) => (
        <SelectItem key={option} value={option}>
          {option}
        </SelectItem>
      ))}
    </ScrollAreaViewport>

    {/* vertical thumb */}
    <ScrollAreaScrollbar orientation="vertical" className="w-2">
      <ScrollAreaThumb className="bg-gray-400 rounded-full" />
    </ScrollAreaScrollbar>

    {/* optional horizontal thumb */}
    <ScrollAreaScrollbar orientation="horizontal" className="h-2">
      <ScrollAreaThumb className="bg-gray-400 rounded-full" />
    </ScrollAreaScrollbar>
  </ScrollArea>
</SelectContent>
             </Select>
          </div>
        </div>

        {/* Company Size */}
        <div className="space-y-2">
          <Label htmlFor="company-size">How large is your company?</Label>
          <div className="relative">
            <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
            <Select
              value={businessDetailsStep.company_size}
              onValueChange={(value) => handleSelectChange("company_size", value)}
            >
              <SelectTrigger id="company-size" className="pl-10 w-full">
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clients */}
        <div className="space-y-2">
          <Label htmlFor="clients">How many clients do you have?</Label>
          <div className="relative">
            <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
            <Select
              value={businessDetailsStep.clients}
              onValueChange={(value) => handleSelectChange("clients", value)}
            >
              <SelectTrigger id="clients" className="pl-10 w-full">
                <SelectValue placeholder="Select number of clients" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Type of Service */}
        <div className="space-y-2">
          <Label htmlFor="type-of-service">Do you serve companies, individuals, or a mix of both?</Label>
          <div className="relative">
            <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
            <Select
              value={businessDetailsStep.type_of_service}
              onValueChange={(value) => handleSelectChange("type_of_service", value)}
            >
              <SelectTrigger id="type-of-service" className="pl-10 w-full">
                <SelectValue placeholder="Select type of service" />
              </SelectTrigger>
              <SelectContent>
                {types.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline"
            onClick={() => dispatch(setStep(step - 1))}
          >
            Back
          </Button>
          <Button 
            onClick={setupOrganizationAndNavigate} 
            disabled={!areAllFieldsSelected() || isLoading}
            variant="default"
            className="bg-black text-white hover:bg-gray-800"
          >
            {isLoading ? 'Loading...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsStep;
