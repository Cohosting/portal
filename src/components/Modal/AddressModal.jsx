
import { useState } from 'react';
import { X } from 'lucide-react';
import { Check } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { Search } from 'lucide-react';
import { useRef } from 'react';
import { useAddressSearch } from '@/hooks/useAddressSearch';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';








// Address Input Component
const AddressInput = ({ onAddressSelect, selectedAddress }) => {
  const inputRef = useRef(null);
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

  const handleAddressSelect = (address) => {
    clearSearch();
    onAddressSelect(address);
    inputRef.current?.blur();
  };

  const { handleKeyDown } = useKeyboardNavigation(
    suggestions, 
    highlightedIndex, 
    setHighlightedIndex, 
    handleAddressSelect
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear selected address if user starts typing again
    if (selectedAddress && value !== '') {
      onAddressSelect(null);
    }
  };

  const handleClearSelection = () => {
    onAddressSelect(null);
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={selectedAddress ? selectedAddress.place_name : query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length >= 2) setShowSuggestions(true);
          }}
          placeholder="Start typing your address..."
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          autoComplete="off"
          readOnly={!!selectedAddress}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
        {selectedAddress && (
          <button
            onClick={handleClearSelection}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
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

      {showSuggestions && suggestions.length === 0 && !isLoading && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm">
          No addresses found. Try a different search term.
        </div>
      )}
    </div>
  );
};

// Address Modal Component
const AddressModal = ({ isOpen, onClose, onSave }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleSave = () => {
    if (!selectedAddress) return;

    // Format address data for Stripe Customer object (US only)
    const addressData = {
      id: Date.now().toString(),
      // Stripe customer address format
      address: {
        line1: selectedAddress.properties.address, // Required: Street address
        line2: null, // Optional: Apartment, suite, etc.
        city: selectedAddress.properties.locality, // Required: City
        state: selectedAddress.properties.region, // Required: State
        postal_code: selectedAddress.properties.postcode, // Required: ZIP code
        country: 'US' // Fixed to US only
      },
      // Additional metadata for display
      fullAddress: selectedAddress.place_name,
      coordinates: selectedAddress.geometry.coordinates,
      // For internal use
      createdAt: new Date().toISOString()
    };

    onSave(addressData);
    handleClose();
  };

  const handleClose = () => {
    setSelectedAddress(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Setup Your Address</h2>
            <p className="text-sm text-gray-500 mt-1">The address will be appear in invoices</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto" style={{ minHeight: '400px', maxHeight: '500px' }}>
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Search Address</label>
            <AddressInput 
              onAddressSelect={setSelectedAddress}
              selectedAddress={selectedAddress}
            />
            {selectedAddress && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Address Selected</span>
                </div>
                <p className="text-xs text-green-600 mt-1">{selectedAddress.place_name}</p>
              </div>
            )}
            
            {!selectedAddress && (
              <div className="mt-4 p-6 text-center text-gray-500">
                <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm">Start typing to search for your address</p>
                <p className="text-xs text-gray-400 mt-1">We'll show you suggestions as you type</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedAddress}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
