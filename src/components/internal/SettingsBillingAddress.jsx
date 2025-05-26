import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { supabase } from "../../lib/supabase";
import { useBoolean } from "react-use";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const SettingsBillingAddress = ({ portalId, billingAddress }) => {
  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    zipPostalCode: "",
  });

  useEffect(() => {
    if (billingAddress) {
      setFormData(billingAddress);
    }
  }, [billingAddress]);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useBoolean(false);
  let isAddressChanged = JSON.stringify(billingAddress) !== JSON.stringify(formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateFormData = () => {
    const { addressLine1, city, stateProvince, zipPostalCode } = formData;
    if (!addressLine1 || !city || !stateProvince || !zipPostalCode) {
      return "All fields except Address Line 2 are required.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAddressChanged) return;
    
    const validationError = validateFormData();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("portals")
        .update({ billing_address: formData })
        .eq("id", portalId);

      if (error) throw error;

      toast.success("Billing address updated successfully!");
    } catch (err) {
      console.error("Error updating billing address", err);
      toast.error("Failed to update billing address.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 mt-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Billing Address
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Please provide your billing address. This address will appear on all
          your invoices.
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="addressLine1" className="text-gray-700">
              Address Line 1
            </Label>
            <Input
              type="text"
              id="addressLine1"
              name="addressLine1"
              placeholder="123 Main St"
              value={formData.addressLine1}
              onChange={handleInputChange}
              required
              className="rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="addressLine2" className="text-gray-700">
              Address Line 2 (Optional)
            </Label>
            <Input
              type="text"
              id="addressLine2"
              name="addressLine2"
              placeholder="Apt 4B"
              value={formData.addressLine2}
              onChange={handleInputChange}
              className="rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city" className="text-gray-700">
              City
            </Label>
            <Input
              type="text"
              id="city"
              name="city"
              placeholder="New York"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stateProvince" className="text-gray-700">
              State/Province
            </Label>
            <Input
              type="text"
              id="stateProvince"
              name="stateProvince"
              placeholder="NY"
              value={formData.stateProvince}
              onChange={handleInputChange}
              required
              className="rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zipPostalCode" className="text-gray-700">
              Zip/Postal Code
            </Label>
            <Input
              type="text"
              id="zipPostalCode"
              name="zipPostalCode"
              placeholder="10001"
              value={formData.zipPostalCode}
              onChange={handleInputChange}
              required
              className="rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500"
            />
          </div>
        </div>
        
        <Button
          type="submit"
          className="  bg-black hover:bg-gray-800 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading || !isAddressChanged}
        >
          {isLoading ? 'Updating...' : 'Update Billing Address'}
        </Button>
      </form>
    </div>
  );
};

export default SettingsBillingAddress;