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

      await initializeOrganizationSetup(user, personalInfoStep, businessDetailsStep, createCustomer);
      dispatch(setStep(step + 1)); // Go to success page or next step

    } catch (err) {
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
              <SelectContent>
                {industries.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
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
