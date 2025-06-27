import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LogOut,
  HelpCircle,
  Inbox,
  Folders,
  FileSpreadsheet,
  ChevronDown,
  MapPin,
  Camera
} from 'lucide-react';
import { PreloadedIcons } from '@/components/preloaded-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useClientAuth } from '@/hooks/useClientAuth';
import { classNames } from '../../../../utils/statusStyles';
import { useMediaQuery } from 'react-responsive';
import { useSidebar } from '@/components/ui/sidebar';
import AddressModal from '@/components/Modal/AddressModal';
import { toast } from 'react-toastify';
import { supabase } from '@/lib/supabase';

// ----------------------------------------------
// 1. Static fallback icon map
// ----------------------------------------------
const DEFAULT_ICONS = {
  'Messages': Inbox,
  'messages': Inbox,
  'Files': Folders,
  'files': Folders,
  'Billings': FileSpreadsheet,
  'billings': FileSpreadsheet
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
// 3. Resolve icon name from app settings
// ----------------------------------------------
const getResolvedIconName = (app, clientUserId) => {
  const { icon } = app;
  return icon || 'help-circle';
};

// ----------------------------------------------
// 4. Final icon rendering function
// ----------------------------------------------
const RenderIcon = ({ iconName, className }) => {
  if (DEFAULT_ICONS[iconName]) {
    const Icon = DEFAULT_ICONS[iconName];
    return <Icon className={className} />;
  }
  const Icon = PreloadedIcons[iconName];
  if (Icon) return <Icon className={className} />;
  return <HelpCircle className={className} />;
};

// ----------------------------------------------
// 5. Main Navigation Component
// ----------------------------------------------
const Navigation = ({ portal_apps, portal, brandSettings, computedColors }) => {
  const { clientUser, updateClientUser } = useClientAuth(portal?.id);
  const navigate = useNavigate();
  const location = useLocation();
  const { setOpen } = useSidebar();

console.log({
  portal_apps
})
  let filteredApps = portal_apps
                    .sort((a, b) => a.index - b.index)
                    .filter(app =>{
                      if(app?.settings?.setupType !== 'manual') return app;
                      return app?.settings?.clientsSettings?.some(setting => setting.clientId === clientUser?.id);
                    });

  // State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const isLessThan1024 = useMediaQuery({ query: '(max-width: 1024px)' });

  // Destructure computedColors
  const {
    sidebarBgColor,
    sidebarTextColor,
    sidebarHoverBgColor,
    sidebarActiveBgColor,
    sidebarActiveTextColor,
    sidebarPrimaryTextColor,
    dividerColor,
    loginButtonColor,
    loginButtonTextColor
  } = computedColors;

  // Helpers
  const getUserInitials = () => {
    if (!clientUser?.name) return 'U';
    const [first, second] = clientUser.name.split(' ');
    return (first[0] + (second?.[0] || '')).toUpperCase();
  };

  const handleAddressAction = () => {
    setIsAddressModalOpen(true);
    setIsDropdownOpen(false);
    if (isLessThan1024) setOpen(false);
  };

  const closeAddressModal = () => setIsAddressModalOpen(false);

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  // File upload
  const handleAvatarClick = (e) => { e.stopPropagation(); fileInputRef.current?.click(); };
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please select an image file');
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be <5MB');

    setIsUploadingImage(true);
    try {
      const ext = file.name.split('.').pop();
      const name = `${clientUser.id}-${Date.now()}.${ext}`;
      const path = `clients/${name}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { cacheControl: '3600', upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
      const avatarUrl = urlData.publicUrl;
      const { error: updateError } = await supabase.from('clients').update({ avatar_url: avatarUrl }).eq('id', clientUser.id);
      if (updateError) throw updateError;
      updateClientUser && updateClientUser({ ...clientUser, avatar_url: avatarUrl });
      toast.success('Profile picture updated!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update avatar');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Close dropdown outside
  useEffect(() => {
    const onClick = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Address text
  const hasAddress = Boolean(clientUser?.address || clientUser?.street || clientUser?.city);
  const addressActionText = hasAddress ? 'Update Address' : 'Set Address';

  return (
    <div style={{ backgroundColor: sidebarBgColor }} className="flex grow flex-col gap-y-5 overflow-y-auto pb-2">
      {/* Logo */}
      <div className="flex h-16 shrink-0 px-6 items-center">
        <img alt="Logo" src={brandSettings?.assets?.squareIcon} className="h-8 w-auto" />
        {/* <p className="text-lg font-semibold">{brandSettings?.brandName}</p> */}
      </div>


      {/* Apps List */}
      <nav className="flex-1 flex flex-col">
        <ul className="flex flex-1 flex-col gap-y-1">
          {filteredApps.map(item => {
            const decoded = decodeURIComponent(location.pathname.split('/')[2] || '');
            const active = item.name.toLowerCase() === decoded.toLowerCase();
            const iconName = getResolvedIconName(item, clientUser?.id);
            return (
              <li key={item.id}>
                <button
                  onClick={() => { navigate(`/portal/${item.name.toLowerCase()}`); isLessThan1024 && setOpen(false); }}
                  className="group flex gap-x-3 px-6 py-3 text-sm font-semibold leading-6 w-full  transition-colors"
                  style={{ color: active ? sidebarActiveTextColor : sidebarTextColor, backgroundColor: active ? sidebarActiveBgColor : 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = sidebarHoverBgColor}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = active ? sidebarActiveBgColor : 'transparent'}
                >
                  <RenderIcon iconName={iconName} className={classNames('h-6 w-6 shrink-0', active ? 'text-opacity-100' : 'text-opacity-80 group-hover:text-opacity-80')} />
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>

        {/* User & Logout */}
        <div className="border-t flex flex-col items-center pt-6 pb-4" style={{ borderColor: dividerColor }}>
          {clientUser ? (
            <div className="flex items-center mb-4 px-6 w-full relative" ref={dropdownRef}>
              <button onClick={handleAvatarClick} className="relative group" disabled={isUploadingImage}>
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={clientUser.avatar_url || ''} alt={clientUser.name || 'User'} />
                  <AvatarFallback className="bg-gray-200 text-gray-700">{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUploadingImage ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : <Camera className="h-4 w-4 text-white" />}
                </div>
              </button>

              <button onClick={toggleDropdown} className="flex items-center ml-3 hover:opacity-80 transition-opacity min-w-0 flex-1" style={{ color: sidebarPrimaryTextColor }}>
                <div className="text-left min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{clientUser.name}</p>
                  <p className="text-xs truncate opacity-75">{clientUser.email}</p>
                </div>
                <ChevronDown className={`h-4 w-4 ml-2 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 mx-3 rounded-md shadow-lg border z-50" style={{ backgroundColor: sidebarBgColor, borderColor: dividerColor }}>
                  <button onClick={handleAddressAction} className="w-full px-4 py-3 text-left text-sm hover:opacity-80 transition-opacity flex items-center" style={{ color: sidebarTextColor }}>
                    <MapPin className="mr-2 h-4 w-4" />
                    {addressActionText}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center mb-4 px-6 w-full">
              <div className="animate-pulse rounded-full h-10 w-10" style={{ backgroundColor: loginButtonColor }}></div>
              <div className="ml-3 min-w-0 flex-1">
                <div className="animate-pulse h-4 rounded w-3/4 mb-2" style={{ backgroundColor: loginButtonColor }}></div>
                <div className="animate-pulse h-3 rounded w-1/2" style={{ backgroundColor: loginButtonColor }}></div>
              </div>
            </div>
          )}

          {clientUser ? (
            <Button onClick={() => { localStorage.removeItem('sessionToken'); window.location.href = '/login'; }} style={{ backgroundColor: loginButtonColor, color: loginButtonTextColor }} className="w-10/12">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          ) : (
            <div className="animate-pulse h-9 w-10/12 rounded" style={{ backgroundColor: loginButtonColor }}></div>
          )}
        </div>
      </nav>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={closeAddressModal}
        clientUser={clientUser}
        portal={portal}
        defaultAddress={clientUser?.billing_address}
        colorSettings={computedColors}
      />
    </div>
  );
};

export default Navigation;
