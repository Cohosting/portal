import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { supabase } from "../../lib/supabase"; // Assuming supabase is set up for database operations
import { useBoolean } from "react-use";

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
    if (!isAddressChanged) return
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
        <h2 className="text-2xl font-semibold leading-none tracking-tight">
          Billing Address
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Please provide your billing address. This address will appear on all
          your invoices
        </p>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="addressLine1"
              className="block text-sm font-medium text-gray-700"
            >
              Address Line 1
            </label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              placeholder="123 Main St"
              value={formData.addressLine1}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="addressLine2"
              className="block text-sm font-medium text-gray-700"
            >
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              placeholder="Apt 4B"
              value={formData.addressLine2}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="New York"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="stateProvince"
              className="block text-sm font-medium text-gray-700"
            >
              State/Province
            </label>
            <input
              type="text"
              id="stateProvince"
              name="stateProvince"
              placeholder="NY"
              value={formData.stateProvince}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="zipPostalCode"
              className="block text-sm font-medium text-gray-700"
            >
              Zip/Postal Code
            </label>
            <input
              type="text"
              id="zipPostalCode"
              name="zipPostalCode"
              placeholder="10001"
              value={formData.zipPostalCode}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3"
            />
          </div>
        </div>
        <button
          type="submit"
          className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isLoading || !isAddressChanged ? 'opacity-50 cursor-not-allowed' : ''} `}
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Billing Address'}
        </button>
      </form>
    </div>
  );
};

export default SettingsBillingAddress;