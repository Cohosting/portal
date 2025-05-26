// PersonalInfoStep with shadcn UI
import { foundOn } from "../../../utils/constant";
import PortalURLInput from "../../../components/PortalURLInput";
import { useSelector, useDispatch } from "react-redux";
import { setPersonalInfoStep, setStep } from "../../../store/slices/authSlice";
import { useEffect, useState } from "react";
import { User, Building } from 'lucide-react';

// Import shadcn components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PersonalInfoStep = ({ isLargerThan450 }) => {
  const dispatch = useDispatch();
  const { personalInfoStep, portalURLValidation, step } = useSelector((state) => state.auth);
  const [stopGoForward, setStopGoForward] = useState(false);

  const handleChange = (e) => {
    const { value, name } = e.target;
    dispatch(setPersonalInfoStep({
      ...personalInfoStep,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    dispatch(setPersonalInfoStep({
      ...personalInfoStep,
      found_on: value
    }));
  };

  const isFormValid = () => {
    return (
      personalInfoStep.name.trim() !== '' &&
      personalInfoStep.company_name.trim() !== '' &&
      personalInfoStep.portal_url.trim() !== '' &&
      portalURLValidation.isAvailable &&
      !portalURLValidation.isChecking
    );
  };

  useEffect(() => {
    if (!portalURLValidation.isChecking && portalURLValidation.isAvailable) {
      setStopGoForward(false);
    }
  }, [personalInfoStep, portalURLValidation]);

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        {/* Full Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              name="name"
              value={personalInfoStep.name}
              onChange={handleChange}
              className="pl-10"
              placeholder="John Doe"
            />
          </div>
        </div>
        
        {/* Where did you hear about us? */}
        <div className="space-y-2">
          <Label htmlFor="found-on">Where did you hear about us?</Label>
          <Select
            value={personalInfoStep.found_on}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger id="found-on" className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className="bg-white" >
              {foundOn.map((option) => (
                <SelectItem className="hover:bg-gray-800 hover:text-white " key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Company Name Field */}
        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name</Label>
          <div className="relative">
            <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              id="company-name"
              name="company_name"
              value={personalInfoStep.company_name}
              onChange={handleChange}
              className="pl-10"
              placeholder="Acme Inc."
            />
          </div>
        </div>
        
        {/* Portal URL Input */}
        <PortalURLInput
          value={personalInfoStep.portal_url}
          setStopGoForward={setStopGoForward}
          handleChange={(url) => {
            dispatch(
              setPersonalInfoStep({
                ...personalInfoStep,
                portal_url: url,
                portalURLValidation: {
                  ...portalURLValidation,
                  isChecking: true,
                  isAvailable: false,
                }
              }))
          }}
        />
        
        {/* Continue Button */}
        <Button
          onClick={() => {
            if (!stopGoForward && isFormValid()) {
              dispatch(setStep(step + 1));
            }
          }}
          className="w-full bg-black text-white hover:bg-gray-800"
          disabled={!isFormValid() || stopGoForward}
          variant="default"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;