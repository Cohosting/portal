import React, { useState, useEffect, useRef } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '../../lib/supabase';

const DefaultPortalSettings = () => {
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, currentSelectedPortal } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  let portals = user?.portals || [];
  portals = portals.filter((portal, index, self) =>
    index === self.findIndex((t) => t.id === portal.id)
  );

  useEffect(() => {
    let portals = user?.portals || [];
    portals = portals.filter((portal, index, self) =>
      index === self.findIndex((t) => t.id === portal.id)
    );
    if (portals.length > 0) {
      const portal = portals.find(portal => portal.id === currentSelectedPortal);
      setSelectedPortal(portal || portals[0]);
    }
  }, [currentSelectedPortal, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = async () => {
    if (!selectedPortal) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from('users').update({
        default_portal: selectedPortal.id
      }).eq('id', user.id);
      if (error) {
        throw error;
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Error updating default portal:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const isDisabled = currentSelectedPortal === selectedPortal?.id || isSaving;

  return (
    <div className="w-full max-w-md   bg-white  ">
      <div className="  py-5 ">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Default Portal</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Choose which portal you'd like to see first when you log in.
        </p>
      </div>
      <div className=" py-5 ">
        <div className="space-y-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            >
              <span className="block truncate">{selectedPortal?.brand_settings?.brandName || 'Select a portal'}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </button>
            {isOpen && (
              <ul className="absolute z-10 mt-1   w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {portals.map((portal) => (
                  <li
                    key={portal.id}
                    className={`relative cursor-default select-none py-2 pl-10 pr-4 ${selectedPortal?.id === portal.id ? 'bg-amber-100 text-amber-900' : 'text-gray-900 hover:bg-amber-50'
                      }`}
                    onClick={() => {
                      setSelectedPortal(portal);
                      setIsOpen(false);
                    }}
                  >
                    <span className={`block truncate ${selectedPortal?.id === portal.id ? 'font-medium' : 'font-normal'}`}>
                      {portal.brand_settings?.brandName}
                    </span>
                    {selectedPortal?.id === portal.id && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleSave}
              disabled={isDisabled}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${isDisabled && 'opacity-50 cursor-not-allowed'}`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            {isSaved && (
              <CheckIcon className="ml-2 w-5 h-5 text-green-500" />
            )}
          </div>
          {isSaved && (
            <p className="text-sm text-green-600 mt-2">Your changes have been saved successfully.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefaultPortalSettings;