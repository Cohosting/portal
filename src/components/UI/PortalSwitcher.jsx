import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Check } from '@phosphor-icons/react/dist/ssr';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSelectedPortal } from '../../store/slices/authSlice';

const PortalSwitcher = () => {
    const dispatch = useDispatch();
    const { currentSelectedPortal, user } = useSelector(state => state.auth);
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (portalId) => {
        if (portalId === currentSelectedPortal) {
            return setIsOpen(false);
        }
        dispatch(setCurrentSelectedPortal(portalId));
        setIsOpen(false);
    };

    let portals = user?.portals || [];
    const selectedPortalData = portals.find(portal => portal.id === currentSelectedPortal);

    const DefaultBadge = () => (
        <span className="inline-flex items-center justify-center px-1.5 py-0.5 ml-2 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
            Default
        </span>
    );

    return (
        <div className="relative inline-block mt-5 text-left">
            <div>
                <button
                    type="button"
                    className="inline-flex justify-between items-center w-[200px] rounded-md border border-gray-300 shadow-sm px-3 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded="true"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="truncate">{selectedPortalData?.brand_settings?.brandName}</span>
                    <div className="flex items-center">
                        {user?.default_portal === selectedPortalData?.id && <DefaultBadge />}
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </div>
                </button>
            </div>

            {isOpen && (
                <div className="fixed left-[15px] mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {portals.map((portal) => (
                            <button
                                key={portal.id}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex justify-between items-center"
                                role="menuitem"
                                onClick={() => handleSelect(portal.id)}
                            >
                                <span className="truncate">{portal?.brand_settings?.brandName}</span>
                                <div className="flex items-center">
                                    {user?.default_portal === portal.id && <DefaultBadge />}
                                    {currentSelectedPortal === portal.id && <Check className="ml-2 h-4 w-4 text-indigo-500" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortalSwitcher;