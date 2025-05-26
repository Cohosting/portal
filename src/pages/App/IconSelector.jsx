'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Image, SearchX } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { PreloadedIcons } from '@/components/preloaded-icons';

const IconSelector = ({ onSelectIcon, initialIconName = null }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIcons, setFilteredIcons] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(initialIconName);

  const getAllIconNames = () => Object.keys(PreloadedIcons);

  useEffect(() => {
    setFilteredIcons(getAllIconNames().slice(0, 100));
    if (initialIconName) setSelectedIcon(initialIconName);
  }, [initialIconName]);

  useEffect(() => {
    const allIcons = getAllIconNames();
    if (!searchTerm?.trim()) {
      setFilteredIcons(allIcons.slice(0, 100));
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = allIcons.filter(name =>
        name.toLowerCase().includes(lower)
      );
      setFilteredIcons(filtered.slice(0, 150));
    }
  }, [searchTerm]);

  const handleIconSelect = (iconName) => {
    setSelectedIcon(iconName);
    onSelectIcon(iconName);
    setOpen(false);
  };

  const renderIcon = (iconName) => {
    const IconComponent = PreloadedIcons[iconName];
    return IconComponent ? <IconComponent size={20} /> : <div>?</div>;
  };

  return (
    <div className="w-full max-w-md">
      <Popover 
        open={open} 
        onOpenChange={setOpen}
        modal={true} // Force modal behavior to handle z-index properly
      >
        <PopoverTrigger asChild>
          <div
            className={`flex items-center w-full px-3 py-2 border rounded-md cursor-pointer transition-colors ${
              open
                ? 'border-blue-500 ring-1 ring-blue-500'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {selectedIcon ? (
              <div className="flex items-center mr-2 text-gray-600">
                {renderIcon(selectedIcon)}
              </div>
            ) : (
              <div className="mr-2 text-gray-400">
                <Image size={20} />
              </div>
            )}

            <span className="flex-1 text-sm truncate">
              {selectedIcon || "Select an icon"}
            </span>

            <div className="text-gray-400">
              {open ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent 
          className="w-full bg-white p-0 z-[9999]" 
          align="start" 
          sideOffset={5}
          style={{ zIndex: 9999 }} // Inline style as fallback
          avoidCollisions={true}
          side="bottom"
          onOpenAutoFocus={(e) => {
            // Allow auto focus but focus the search input
            const searchInput = e.currentTarget.querySelector('input[type="text"]');
            if (searchInput) {
              setTimeout(() => searchInput.focus(), 0);
            }
          }}
        >
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              <input
                type="text"
                className="w-full pl-8 pr-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search icons..."
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>

          {/* Search results count */}
          <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
            {filteredIcons.length} icons found
          </div>

          {/* Icons Grid */}
          <div className="p-2 overflow-y-auto max-h-64">
            {filteredIcons.length > 0 ? (
              <div className="grid grid-cols-6 gap-1">
                {filteredIcons.map(iconName => (
                  <div
                    key={iconName}
                    className={`flex flex-col items-center p-2 rounded cursor-pointer transition-colors ${
                      selectedIcon === iconName
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleIconSelect(iconName)}
                    title={iconName}
                  >
                    <div className="flex items-center justify-center h-8">
                      {renderIcon(iconName)}
                    </div>
                    <span className="mt-1 text-xs text-center truncate w-full">
                      {iconName}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <SearchX className="mx-auto mb-2" size={24} />
                <p className="text-sm">No icons found</p>
                <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Footer with selection info */}
          <div className="flex items-center justify-between p-2 bg-gray-50 border-t border-gray-100 text-xs">
            <span className="text-gray-500">
              {selectedIcon ? `Selected: ${selectedIcon}` : 'No icon selected'}
            </span>
            <button
              className="px-2 py-1 text-blue-600 hover:text-blue-800"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default IconSelector;