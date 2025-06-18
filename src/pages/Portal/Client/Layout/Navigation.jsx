import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { lighten, transparentize } from "polished";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  HelpCircle,
  MessageSquare,
  FileText,
  CreditCard,
  ChevronDown,
  MapPin,
  Camera
} from "lucide-react";
import { PreloadedIcons } from "@/components/preloaded-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useClientAuth } from "@/hooks/useClientAuth";
import { classNames } from "../../../../utils/statusStyles";
import { useMediaQuery } from 'react-responsive';
import { useSidebar } from '@/components/ui/sidebar';
import AddressModal from '@/components/Modal/AddressModal';
import { toast } from 'react-toastify';
import { supabase } from '@/lib/supabase'; // Assuming you have supabase client setup

// ----------------------------------------------
// 1. Static fallback icon map
// ----------------------------------------------
const DEFAULT_ICONS = {
  'Messages': MessageSquare,
  'messages': MessageSquare,
  'Files': FileText,
  'files': FileText,
  'Billings': CreditCard,
  'billings': CreditCard
};

// ----------------------------------------------
// 2. Convert to kebab-case (from PascalCase/Icon/etc.)
// ----------------------------------------------
const toKebabCase = (str) =>
  str
    ?.replace(/Icon$/, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase() || 'help-circle';

// ----------------------------------------------
// 3. Get icon name for this app based on client ID
// ----------------------------------------------
const getResolvedIconName = (app, clientUserId) => {
  const { settings, icon } = app;

  let rawIconName = icon;

  // if (settings?.setupType === "manual") {
  //   const clientSettings = settings.clientsSettings || [];
  //   const match = clientSettings.find(cs => cs.clientId === clientUserId);
  //   rawIconName = match?.icon;
  // }

  return rawIconName || "help-circle";
};

// ----------------------------------------------
// 4. Final icon rendering function
// ----------------------------------------------
const RenderIcon = ({ iconName, className }) => {
  // First: use fallback map
  if (DEFAULT_ICONS[iconName]) {
    const Icon = DEFAULT_ICONS[iconName];
    return <Icon className={className} />;
  }

  // Second: try preloaded icons
  const Icon = PreloadedIcons[iconName];
  if (Icon) return <Icon className={className} />;

  // Last: fallback icon
  return <HelpCircle className={className} />;
};

// ----------------------------------------------
// 5. Main Navigation
// ----------------------------------------------
const Navigation = ({ portal_apps, portal }) => {
  const { clientUser, updateClientUser } = useClientAuth(portal?.id); // Assuming updateClientUser exists
  const navigate = useNavigate();
  const location = useLocation();
  const { setOpen } = useSidebar();
  
  // State for address modal, dropdown, and file input
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const isLessThan1024 = useMediaQuery({ query: '(max-width: 1024px)' });

  const {
    sidebarBgColor,
    sidebarTextColor = 'rgb(79, 70, 229)',
    accentColor = 'rgb(79, 70, 229)',
    sidebarActiveTextColor,
    fullLogo,
    loginButtonColor,
    loginButtonTextColor
  } = portal?.brand_settings || {};

  const sidebarItemHoverBgColor = transparentize(0.8, accentColor);
  const sidebarItemHoverColor = lighten(0.2, sidebarTextColor);

  const getUserInitials = () => {
    if (!clientUser?.name) return "U";
    const [first, second] = clientUser.name.split(" ");
    return (first?.[0] + (second?.[0] || '')).toUpperCase();
  };

  const handleAddressAction = () => {
    setIsAddressModalOpen(true);
    setIsDropdownOpen(false);
    // Close sidebar on mobile when address action is clicked
    if (isLessThan1024) {
      setOpen(false);
    }
  };

  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle avatar click to open file manager
  const handleAvatarClick = (e) => {
    e.stopPropagation(); // Prevent dropdown from opening
    fileInputRef.current?.click();
  };

  // Handle file selection and upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please select an image smaller than 5MB");
      return;
    }

    setIsUploadingImage(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${clientUser.id}-${Date.now()}.${fileExt}`;
      const filePath = `clients/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = urlData.publicUrl;

      // Update client record in database
      const { error: updateError } = await supabase
        .from('clients') // Assuming your table is called 'clients'
        .update({ avatar_url: avatarUrl })
        .eq('id', clientUser.id);

      if (updateError) {
        throw updateError;
      }

      // Update the client user data locally
      if (updateClientUser) {
        updateClientUser({ ...clientUser, avatar_url: avatarUrl });
      }

      toast.success("Profile picture updated successfully!");

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Failed to update profile picture. Please try again.");
    } finally {
      setIsUploadingImage(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check if user has an address (you might need to adjust this based on your data structure)
  const hasAddress = clientUser?.address || clientUser?.street || clientUser?.city;
  const addressActionText = hasAddress ? "Update Address" : "Set Address";

  return (
    <div
      style={{ backgroundColor: sidebarBgColor }}
      className="flex grow flex-col gap-y-5 overflow-y-auto pb-2"
    >
      <div className="flex h-16 shrink-0 px-6 items-center">
        <img
          alt="Your Company"
          src={fullLogo || "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"}
          className="h-8 w-auto"
        />
      </div>

      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-1">
          {portal_apps.map((item) => {
            const decodedPath = decodeURIComponent(location.pathname.split('/')[2]);
            const active = item.name.toLowerCase() === decodedPath.toLowerCase();
            const resolvedIconName = getResolvedIconName(item, clientUser?.id);

            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (isLessThan1024) {
                      setOpen(false);
                    }
                    navigate(`/portal/${item.name.toLowerCase()}`)
                  }}
                  className={classNames(
                    'group flex gap-x-3 px-6 py-3 text-sm font-semibold leading-6 w-full',
                    { 'hover:bg-opacity-20': !active }
                  )}
                  style={{
                    color: active ? sidebarActiveTextColor : sidebarTextColor,
                    backgroundColor: active ? `${accentColor}33` : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = sidebarItemHoverBgColor;
                    e.currentTarget.style.color = sidebarItemHoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = active ? `${accentColor}33` : 'transparent';
                    e.currentTarget.style.color = active ? sidebarActiveTextColor : sidebarTextColor;
                  }}
                >
                  <RenderIcon
                    iconName={resolvedIconName}
                    className={classNames(
                      'h-6 w-6 shrink-0',
                      { 'text-opacity-80 group-hover:text-opacity-80': !active },
                      { 'text-opacity-100': active }
                    )}
                  />
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>

        <div
          className="border-t flex flex-col items-center pt-6 pb-4"
          style={{ borderColor: `${loginButtonColor}44` }}
        >
          {!clientUser ? (
            <div className="flex items-center mb-4 px-6 w-full">
              <div className="animate-pulse rounded-full h-10 w-10" style={{ backgroundColor: loginButtonColor }}></div>
              <div className="ml-3 min-w-0 flex-1">
                <div className="animate-pulse h-4 rounded w-3/4 mb-2" style={{ backgroundColor: loginButtonColor }}></div>
                <div className="animate-pulse h-3 rounded w-1/2" style={{ backgroundColor: loginButtonColor }}></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center mb-4 px-6 w-full relative" ref={dropdownRef}>
              {/* Avatar with click handler for file upload */}
              <div className="relative">
                <button 
                  onClick={handleAvatarClick}
                  className="relative group"
                  disabled={isUploadingImage}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage
                      src={clientUser?.avatar_url || ""}
                      alt={clientUser?.name || "User"}
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Camera overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {isUploadingImage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Camera className="h-4 w-4 text-white" />
                    )}
                  </div>
                </button>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Name/Email area with dropdown */}
              <button 
                onClick={toggleDropdown}
                className="flex items-center ml-3 hover:opacity-80 transition-opacity min-w-0 flex-1"
                style={{ color: sidebarTextColor }}
              >
                <div className="text-left min-w-0 flex-1">
                  {clientUser?.name && (
                    <p className="text-sm font-medium overflow-hidden whitespace-nowrap truncate">
                      {clientUser.name}
                    </p>
                  )}
                  {clientUser?.email && (
                    <p className="text-xs overflow-hidden whitespace-nowrap truncate opacity-75">
                      {clientUser.email}
                    </p>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 ml-2 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Custom Dropdown */}
              {isDropdownOpen && (
                <div 
                  className="absolute top-full left-0 right-0 mt-2 mx-3 rounded-md shadow-lg border z-50"
                  style={{ 
                    backgroundColor: sidebarBgColor || 'white',
                    borderColor: `${loginButtonColor}44`
                  }}
                >
                  <button
                    onClick={handleAddressAction}
                    className="w-full px-4 py-3 text-left text-sm hover:opacity-80 transition-opacity flex items-center"
                    style={{ color: sidebarTextColor }}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    {addressActionText}
                  </button>
                </div>
              )}
            </div>
          )}

          {!clientUser ? (
            <div className="animate-pulse h-9 w-10/12 rounded" style={{ backgroundColor: loginButtonColor }}></div>
          ) : (
            <Button
              onClick={() => {
                localStorage.removeItem('sessionToken');
                window.location.href = '/login';
              }}
              style={{
                backgroundColor: loginButtonColor,
                color: loginButtonTextColor,
              }}
              className="w-10/12"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </nav>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={closeAddressModal}
        clientUser={clientUser}
        portal={portal}
        defaultAddress={clientUser?.billing_address}
      />  
    </div>
  );
};

export default Navigation;