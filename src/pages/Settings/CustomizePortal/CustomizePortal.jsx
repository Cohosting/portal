// src/pages/CustomizePortal.jsx
import React, { useState, useEffect } from 'react';
 import { Button } from '@/components/ui/button';
import { useCustomizePortalLogic } from '@/hooks/useCustomizePortalLogic';
import { useSelector } from 'react-redux';
import { usePortalData } from '@/hooks/react-query/usePortalData';
import PageHeader from '@/components/internal/PageHeader';
import { Monitor } from 'lucide-react';
import BottomActionBar from '@/components/ui/BottomActionBar';
import DashboardSkeleton from '@/components/SkeletonLoading';

// Import extracted sections
import { BaseColorSection, AdvancedColorSection } from './ColorCustomization';
import { BrandNameSection, ImageAssetSection, PoweredBySection } from './PortalSections';
import { PreviewModal, PreviewTabs, PreviewContent } from './PreviewModal';
import { Layout } from '@/pages/Dashboard/Layout';

// Reusable heading component (kept here as it's specific to this page)
const Heading = ({ text, subText }) => (
  <div className="pb-4">
    <h3 className="text-lg font-semibold text-gray-900">{text}</h3>
    <p className="mt-1 text-sm text-gray-500">{subText}</p>
  </div>
);

// Desktop preview sidebar
const DesktopPreview = ({ previewTab, setPreviewTab, brandSettings, computedColors }) => (
  <div className="hidden xl:block w-[500px] flex-shrink-0 px-4 py-8">
    <div className="sticky top-20">
      <PreviewTabs previewTab={previewTab} setPreviewTab={setPreviewTab} />
      <PreviewContent 
        previewTab={previewTab} 
        brandSettings={brandSettings} 
        computedColors={computedColors} 
      />
    </div>
  </div>
);

// Main content sections
const MainContent = ({ 
  brandSettings, 
  derivedColors, 
  handleUpdateSetting, 
  handleUpdateBaseColor,
  handleUpdateAdvancedColor,
  handleUpdateAsset,
  toggleAdvancedOptions,
  resetAdvancedColors 
}) => (
  <div className="flex-1 px-6 py-8 max-w-full xl:max-w-[650px]">
    <BrandNameSection 
      brandName={brandSettings.brandName} 
      handleUpdateSetting={handleUpdateSetting}
      Heading={Heading}
    />
    
    <BaseColorSection 
      baseColors={brandSettings.baseColors} 
      handleUpdateBaseColor={handleUpdateBaseColor}
      Heading={Heading}
    />
    
    <AdvancedColorSection
      advancedColors={brandSettings.advancedColors}
      derivedColors={derivedColors}
      handleUpdateAdvancedColor={handleUpdateAdvancedColor}
      showAdvancedOptions={brandSettings.showAdvancedOptions}
      toggleAdvancedOptions={toggleAdvancedOptions}
      resetAdvancedColors={resetAdvancedColors}
    />
    
    <ImageAssetSection 
      handleUpdateAsset={handleUpdateAsset} 
      assets={brandSettings.assets}
      Heading={Heading}
    />
    
    <PoweredBySection 
      poweredByCopilot={brandSettings.poweredByCopilot} 
      handleUpdateSetting={handleUpdateSetting}
      Heading={Heading}
    />
  </div>
);

// Main CustomizePortal component
export const CustomizePortal = () => {
  const { currentSelectedPortal } = useSelector(s => s.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);

  const {
    isLoading,
    hasChanges,
    brandSettings,
    computedColors,
    derivedColors,
    handleUpdateBaseColor,
    handleUpdateAdvancedColor,
    handleUpdateAsset,
    handleUpdateSetting,
    toggleAdvancedOptions,
    resetAdvancedColors,
    handleUpdatePortalBrand,
    resetBrandSettings
  } = useCustomizePortalLogic();

  const [previewTab, setPreviewTab] = useState('dashboard');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!portal) return <DashboardSkeleton />;
  
  const isDesktop = windowWidth >= 1280;

  return (
    <Layout hideMobileNav headerName="Customizations">
      <PageHeader
        title="Customize Portal"
        description="Adjust your portal's look and feel."
        action={
          !isDesktop && (
            <Button variant="outline" onClick={() => setPreviewOpen(true)} className="flex items-center gap-2">
              <Monitor className="w-4 h-4" /> Preview
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

      {/* Mobile preview modal */}
      <PreviewModal
        previewOpen={previewOpen}
        setPreviewOpen={setPreviewOpen}
        previewTab={previewTab}
        setPreviewTab={setPreviewTab}
        brandSettings={brandSettings}
        computedColors={computedColors}
      />

      {/* Main content + sticky desktop preview */}
      <div className="flex">
        <MainContent
          brandSettings={brandSettings}
          derivedColors={derivedColors}
          handleUpdateSetting={handleUpdateSetting}
          handleUpdateBaseColor={handleUpdateBaseColor}
          handleUpdateAdvancedColor={handleUpdateAdvancedColor}
          handleUpdateAsset={handleUpdateAsset}
          toggleAdvancedOptions={toggleAdvancedOptions}
          resetAdvancedColors={resetAdvancedColors}
        />

        {isDesktop && (
          <DesktopPreview
            previewTab={previewTab}
            setPreviewTab={setPreviewTab}
            brandSettings={brandSettings}
            computedColors={computedColors}
          />
        )}
      </div>
    </Layout>
  );
};