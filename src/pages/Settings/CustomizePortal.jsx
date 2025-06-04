import React, { useState, useEffect } from 'react';
import { Layout } from '../Dashboard/Layout';
import { ActionButtons } from '../../components/internal/ActionButtons';
import { AssetItem } from './AssetItem';
import { BrandColorPicker } from '../../components/internal/ColorPicker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCustomizePortalLogic } from '../../hooks/useCustomizePortalLogic';
import { portalTexts } from '../../utils/constant';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import SwitchComponent from '../../components/SwitchComponent';
import PageHeader from '@/components/internal/PageHeader';
import { MessageSquare, FileText, Settings, Eye, EyeOff, Monitor } from 'lucide-react';
import BottomActionBar from '@/components/ui/BottomActionBar';
import LoginPreview from './LoginPreview';
import DashboardSkeleton, { CustomSkeleton } from '@/components/SkeletonLoading';
import { Loader } from 'lucide-react';

const Heading = ({ text, subText }) => (
  <div className="pb-4">
    <h3 className="text-lg font-semibold leading-6 text-gray-900">{text}</h3>
    <p className="mt-2 max-w-4xl text-sm text-gray-500">{subText}</p>
  </div>
);

const BrandNameSection = ({ brandName, handleUpdateState }) => (
  <div className="my-6 text-sm">
    <Heading
      text={portalTexts.brandName.heading}
      subText={portalTexts.brandName.subText}
    />
    <Input
      value={brandName}
      onChange={e => {
        const val = e.target.value;
        if (val.length <= 30) handleUpdateState('brandName', val);
      }}
      maxLength={30}
      placeholder="Enter brand name"
      className="w-full"
    />
  </div>
);

const ImageAssetSection = ({ handleUpdateState, squareIcon, fullLogo, squareLoginImage }) => (
  <div className="my-6 text-sm">
    <Heading
      text={portalTexts.imageAsset.heading}
      subText={portalTexts.imageAsset.subText}
    />
    <ul className="divide-y divide-gray-300">
      <AssetItem
        text={portalTexts.imageAsset.squareIcon}
        subText={portalTexts.imageAsset.squareIconSubText}
        onUpload={handleUpdateState}
        field="squareIcon"
        initialDownloadUrl={squareIcon}
      />
      <AssetItem
        text={portalTexts.imageAsset.fullLogo}
        subText={portalTexts.imageAsset.fullLogoSubText}
        onUpload={handleUpdateState}
        field="fullLogo"
        initialDownloadUrl={fullLogo}
      />
      <AssetItem
        text={portalTexts.imageAsset.squareLoginImage}
        subText={portalTexts.imageAsset.squareLoginImageSubText}
        onUpload={handleUpdateState}
        field="squareLoginImage"
        initialDownloadUrl={squareLoginImage}
      />
    </ul>
  </div>
);

const BrandColorSection = ({ handleUpdateState, sidebarBgColor, sidebarActiveTextColor, sidebarTextColor, accentColor, loginButtonColor, loginButtonTextColor, loginFormTextColor }) => (
  <div className="my-6 text-sm">
    <Heading
      text={portalTexts.brandColors.heading}
      subText={portalTexts.brandColors.subText}
    />
    <ul className="divide-y divide-gray-300">
      <BrandColorPicker
        title={portalTexts.brandColors.sidebarBgColor}
        defaultColor={sidebarBgColor}
        field="sidebarBgColor"
        onCompletePick={handleUpdateState}
      />
      <BrandColorPicker
        title={portalTexts.brandColors.sidebarTextColor}
        defaultColor={sidebarTextColor}
        field="sidebarTextColor"
        onCompletePick={handleUpdateState}
      />
      <BrandColorPicker
        title={portalTexts.brandColors.sidebarActiveTextColor}
        defaultColor={sidebarActiveTextColor}
        field="sidebarActiveTextColor"
        onCompletePick={handleUpdateState}
      />
      <BrandColorPicker
        title={portalTexts.brandColors.accentColor}
        defaultColor={accentColor}
        field="accentColor"
        onCompletePick={handleUpdateState}
      />



    </ul>
    <div className="py-4">
<Heading
      text={'Login page colors'}
      subText={ 'This color will be used for the login page background.'}
    />
        <ul className="divide-y divide-gray-300">
        <BrandColorPicker
        title={portalTexts.brandColors.loginFormTextColor}
        defaultColor={loginFormTextColor}
        field="loginFormTextColor"
        onCompletePick={handleUpdateState}
      />
      <BrandColorPicker
        title={portalTexts.brandColors.loginButtonColor}
        defaultColor={loginButtonColor}
        field="loginButtonColor"
        onCompletePick={handleUpdateState}
      />
        <BrandColorPicker
        title={portalTexts.brandColors.loginButtonTextColor}
        defaultColor={loginButtonTextColor}
        field="loginButtonTextColor"
        onCompletePick={handleUpdateState}
      />

</ul>
</div>
  </div>
);

const PoweredBySection = ({ poweredByCopilot, handleUpdateState }) => (
  <div className="my-6 text-sm">
    <Heading
      text={portalTexts.poweredBy.heading}
      subText={portalTexts.poweredBy.subText}
    />
    <div className="flex items-center justify-between pb-12">
      <p>Powered by Copilot</p>
      <SwitchComponent
        enabled={poweredByCopilot}
        setEnabled={value => handleUpdateState('poweredByCopilot', value)}
      />
    </div>
  </div>
);

// Login Overlay Component
const LoginOverlay = ({ brandName, poweredByCopilot }) => {
  return (
    <div className="absolute top-0 left-32 z-10 bg-white shadow-md rounded-md w-[250px] overflow-hidden">
      <div className="p-5">
        <div className="text-center mb-4">
          <span className="text-xl font-normal">{brandName || 'H'}</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">Email</div>
            <input 
              type="text" 
              className="w-full border border-gray-200 rounded-sm py-1.5 px-2 text-sm bg-white" 
              readOnly
            />
          </div>
          
          <div>
            <div className="text-xs text-gray-500 mb-1">Password</div>
            <input 
              type="text" 
              className="w-full border border-gray-200 rounded-sm py-1.5 px-2 text-sm bg-white" 
              readOnly
            />
          </div>
          
          <button className="w-full bg-gray-200 py-1.5 rounded-sm text-sm text-gray-500 font-normal">
            Sign in
          </button>
          
          <div className="text-center pt-1">
            <a href="#" className="text-xs text-gray-500">Forgot password?</a>
          </div>
        </div>
        
        {poweredByCopilot && (
          <div className="text-center text-xs text-gray-400 mt-6">
            Powered by Copilot
          </div>
        )}
      </div>
    </div>
  );
};

// Preview component with toggle functionality
const ClientPreview = ({ 
  brandName, 
  poweredByCopilot, 
  sidebarBgColor, 
  sidebarTextColor, 
  sidebarActiveTextColor,
  accentColor
}) => {
  return (
    <div className="border border-gray-200 rounded-md overflow-hidden relative">
      <div className="flex w-full">
        {/* Sidebar */}
        <div 
          className="w-32 h-[500px] flex-shrink-0 relative" 
          style={{ backgroundColor: sidebarBgColor }}
        >
          <div className="py-3 px-4">
            <div className="text-lg font-bold" style={{ color: sidebarTextColor }}>
              {brandName?.charAt(0) || 'H'}
            </div>
          </div>
          
          <div className="py-2">
            <div className="flex items-center py-2 px-4" style={{ color: sidebarActiveTextColor, backgroundColor: ` ${accentColor}33` }}>
              <MessageSquare className="w-5 h-5 mr-2" />
              <span className="text-sm">Messages</span>
            </div>
            
            <div className="flex items-center py-2 px-4" style={{ color: sidebarTextColor }}>
              <FileText className="w-5 h-5 mr-2" />
              <span className="text-sm">Files</span>
            </div>
            
            <div className="flex items-center py-2 px-4" style={{ color: sidebarTextColor }}>
              <Settings className="w-5 h-5 mr-2" />
              <span className="text-sm">Forms</span>
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 p-4 bg-white">
          <h2 className="text-xl font-medium mb-4">Messages</h2>
          <div className="w-full h-6 bg-gray-100 rounded-md mb-3"></div>
          <div className="w-4/5 h-6 bg-gray-100 rounded-md mb-3"></div>
          <div className="w-2/3 h-6 bg-gray-100 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export const CustomizePortal = () => {
  const { currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);
  const {
    isLoading,
    hasChanges,
    brandSettings,
    handleUpdateState,
    handleUpdatePortalBrand,
    resetBrandSettings
  } = useCustomizePortalLogic();

  const {
    brandName,
    squareIcon,
    fullLogo,
    squareLoginImage,
    poweredByCopilot,
    sidebarBgColor,
    sidebarTextColor,
    sidebarActiveTextColor,
    accentColor,
    loginFormTextColor,
    loginButtonColor,
    loginButtonTextColor,

  } = brandSettings;

  const [contentPadding, setContentPadding] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Track window width for responsive behavior
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  useEffect(() => {
    // setContentPadding(hasChanges ? 64 : 0);
    
    // Add window resize listener
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize
    
    return () => window.removeEventListener('resize', handleResize);
  }, [hasChanges]);

  if (!portal)  return <DashboardSkeleton />

  // Determine if we should show preview inline or use modal
  const showInlinePreview = windowWidth >= 1280;

  return (
    <Layout hideMobileNav headerName="Customizations">
      <PageHeader
        title="Customize Portal"
        description="Customize the look and feel of your portal to match your brand identity."
        action={
          !showInlinePreview && (
            <Button onClick={setPreviewOpen} variant="outline" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              <span>Preview</span>
          </Button>
          )

        }
      />

 
          {hasChanges && (
 
            <BottomActionBar
              onSave={handleUpdatePortalBrand}
              onCancel={resetBrandSettings}
              isLoading={isLoading}
              saveText="Save changes"
               cancelText="Cancel"
              />

          )}
 
      {/* Preview Modal Button */}
      <div className="flex justify-end px-4 mb-4 xl:hidden">
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
 
          <DialogContent className="sm:max-w-[700px] bg-white w-[95vw]">
            <DialogHeader>
              <DialogTitle>Client Preview</DialogTitle>
            </DialogHeader>
            <ClientPreview
              brandName={brandName}
              poweredByCopilot={poweredByCopilot}
              sidebarBgColor={sidebarBgColor}
              sidebarTextColor={sidebarTextColor}
              sidebarActiveTextColor={sidebarActiveTextColor}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Main content */}
      <div className="flex flex-col xl:flex-row">
        {/* Form content */}
        <div
          className="w-full px-4 md:px-7 transition-all duration-300 ease-in-out"
          style={{ 
            paddingTop: `${contentPadding}px`,
            maxWidth: showInlinePreview ? '650px' : '800px',
            margin: !showInlinePreview ? '0 auto' : '0'
          }}
        >
          <BrandNameSection
            brandName={brandName}
            handleUpdateState={handleUpdateState}
          />
          <BrandColorSection
            handleUpdateState={handleUpdateState}
            sidebarBgColor={sidebarBgColor}
            sidebarTextColor={sidebarTextColor}
            sidebarActiveTextColor={sidebarActiveTextColor}
            accentColor={accentColor}
            loginFormTextColor={loginFormTextColor}
            loginButtonColor={loginButtonColor}
            loginButtonTextColor={loginButtonTextColor}
          />
          <ImageAssetSection
            handleUpdateState={handleUpdateState}
            squareIcon={squareIcon}
            fullLogo={fullLogo}
            squareLoginImage={squareLoginImage}
          />
          <PoweredBySection
            poweredByCopilot={poweredByCopilot}
            handleUpdateState={handleUpdateState}
          />
        </div>

        {/* Preview section - only shown on larger screens */}
        {showInlinePreview && (
          <div className="w-full xl:w-[500px] px-4 xl:px-0 mt-8 mb-8 xl:mb-0">
            <h2 className="text-lg font-medium mb-6">Client preview</h2>
            <ClientPreview
              brandName={brandName}
              poweredByCopilot={poweredByCopilot}
              sidebarBgColor={sidebarBgColor}
              sidebarTextColor={sidebarTextColor}
              sidebarActiveTextColor={sidebarActiveTextColor}
              accentColor={accentColor}
            />
        <LoginPreview brandSettings={brandSettings} />
          </div>
        )}

      </div>
    </Layout>
  );
};