import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Check } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { Search } from 'lucide-react';
import { useRef } from 'react';
import { useAddressSearch } from '@/hooks/useAddressSearch';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import axiosInstance from '@/api/axiosConfig';
import { supabase } from '@/lib/supabase';
import { useClientAuth } from '@/hooks/useClientAuth';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../ui/button';

// Address Input Component
const AddressInput = ({ onAddressSelect, selectedAddress, defaultAddress }) => {
  const inputRef = useRef(null);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  
  const {
    query,
    setQuery,
    suggestions,
    isLoading,
    showSuggestions,
    setShowSuggestions,
    highlightedIndex,
    setHighlightedIndex,
    clearSearch
  } = useAddressSearch();

  // Initialize with default address if provided
  useEffect(() => {
    if (defaultAddress && !selectedAddress && !userHasInteracted) {
      setQuery(defaultAddress.fullAddress || '');
      setShowSuggestions(false); // Explicitly hide suggestions
    }
  }, [defaultAddress, selectedAddress, userHasInteracted, setQuery, setShowSuggestions]);

  const handleAddressSelect = (address) => {
    clearSearch();
    onAddressSelect(address);
    inputRef.current?.blur();
    setUserHasInteracted(true);
  };

  const { handleKeyDown } = useKeyboardNavigation(
    suggestions, 
    highlightedIndex, 
    setHighlightedIndex, 
    handleAddressSelect
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserHasInteracted(true); // User has started interacting
    setQuery(value);
    
    // Clear selected address if user starts typing something different
    if (selectedAddress && value !== selectedAddress.place_name) {
      onAddressSelect(null);
    }
  };

  const handleClearSelection = () => {
    onAddressSelect(null);
    setQuery('');
    setShowSuggestions(false);
    setUserHasInteracted(true);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    // Only show suggestions if user has interacted or if there's no default address
    if (!defaultAddress || userHasInteracted) {
      const currentValue = getInputValue();
      if (currentValue.length >= 2) {
        setShowSuggestions(true);
      }
    }
  };

  // Get the display value for the input
  const getInputValue = () => {
    if (selectedAddress) {
      return selectedAddress.place_name;
    }
    return query;
  };

  // Check if we're showing the default address (not a new selection)
  const isShowingDefaultAddress = () => {
    return defaultAddress && !selectedAddress && !userHasInteracted && query === defaultAddress.fullAddress;
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={getInputValue()}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder="Start typing your address..."
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
        {(selectedAddress || (defaultAddress && query)) && (
          <button
            onClick={handleClearSelection}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear address"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Only show suggestions if user has interacted or no default address */}
      {showSuggestions && suggestions.length > 0 && (userHasInteracted || !defaultAddress) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((address, index) => (
            <button
              key={address.id}
              onClick={() => handleAddressSelect(address)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                index === highlightedIndex ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {address.properties.address}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {address.properties.locality}, {address.properties.region} {address.properties.postcode}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && !isLoading && query.length >= 2 && userHasInteracted && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm">
          No addresses found. Try a different search term.
        </div>
      )}
    </div>
  );
};

// Address Modal Component
const AddressModal = ({ isOpen, onClose, onSave, clientUser, portal, defaultAddress, colorSettings }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const {  primaryButtonColor, primaryButtonTextColor } = colorSettings || {};

  console.log({
    clientUser,
    defaultAddress
  });

  // Convert default address to the expected format if it exists
  useEffect(() => {
    if (defaultAddress && isOpen) {
      // If we have a default address, we can either:
      // 1. Set it as selected (if it has the right format)
      // 2. Or just let it show in the input for editing
      
      // For now, we'll let users see and edit the default address
      // If you want to pre-select it, you'd need to convert defaultAddress 
      // to the same format that comes from the address search API
    }
  }, [defaultAddress, isOpen]);

  const handleSave = async () => {
    if (!selectedAddress) return;
  
    const addressData = {
      id: uuidv4(),
      address: {
        line1: selectedAddress.properties.address,
        city: selectedAddress.properties.locality,
        state: selectedAddress.properties.region,
        postal_code: selectedAddress.properties.postcode,
        country: 'US',
      },
      fullAddress: selectedAddress.place_name,
      coordinates: selectedAddress.geometry.coordinates,
      createdAt: new Date().toISOString(),
    };
  
    setLoading(true);
  
    try {
      // 1️⃣ Update Stripe
      const stripeRes = await axiosInstance.post(
        '/stripe/connect/client/update',
        {
          address: addressData.address,
          stripe_connect_account_id: portal.stripe_connect_account_id,
          customer_id: clientUser.customer_id,
        }
      );
  
      if (stripeRes.status !== 200) {
        throw new Error(`Stripe API returned ${stripeRes.status}`);
      }
  
      // 2️⃣ Update Supabase
      const { error } = await supabase
        .from('clients')
        .update({ billing_address: addressData })
        .eq('id', clientUser.id);
  
      if (error) {
        throw error;
      }
  
      // ✅ Only on complete success:
      toast.success('Address updated successfully');
      onSave && onSave(addressData);
      handleClose();
  
    } catch (err) {
      console.error(err);
      toast.error('Failed to update address. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setSelectedAddress(null);
    onClose();
  };

  if (!isOpen) return null;

 

  return (
    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {defaultAddress ? 'Update Address' : 'Setup Your Address'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">The address will appear in invoices</p>
          </div>
          <Button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            variant="ghost"
          >
            <X className="h-5 w-5 text-gray-400" />
          </Button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto" style={{ minHeight: '400px', maxHeight: '500px' }}>
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Search Address</label>
            <AddressInput 
              onAddressSelect={setSelectedAddress}
              selectedAddress={selectedAddress}
              defaultAddress={defaultAddress}
            />
            
            {/* Show current/default address info */}
            {defaultAddress && !selectedAddress && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Current Address</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">{defaultAddress.fullAddress}</p>
                <p className="text-xs text-blue-500 mt-1">Edit above to change your address</p>
              </div>
            )}

            {/* Show newly selected address */}
            {selectedAddress && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">New Address Selected</span>
                </div>
                <p className="text-xs text-green-600 mt-1">{selectedAddress.place_name}</p>
              </div>
            )}
            
            {/* Empty state - only show when no default and no selection */}
            {!defaultAddress && !selectedAddress && (
              <div className="mt-4 p-6 text-center text-gray-500">
                <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm">Start typing to search for your address</p>
                <p className="text-xs text-gray-400 mt-1">We'll show you suggestions as you type</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedAddress || loading}
            className="flex-1  rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: primaryButtonColor, color: primaryButtonTextColor }}
         >
            {loading ?  (defaultAddress ? 'Updating...' : 'Saving...') : (defaultAddress ? 'Update Address' : 'Save Address')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;