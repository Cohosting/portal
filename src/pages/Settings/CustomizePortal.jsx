import React, { useState, useEffect } from 'react';
import { Layout } from '../Dashboard/Layout';
import { ActionButtons } from '../../components/UI/ActionButtons';
import { AssetItem } from './AssetItem';
import { BrandColorPicker } from '../../components/UI/ColorPicker';
import TextInputField from '../../components/UI/TextInputField';
import { useCustomizePortalLogic } from '../../hooks/useCustomizePortalLogic';
import { portalTexts } from '../../utils/constant';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import SwitchComponent from '../../components/SwitchComponent';

const Heading = ({ text, subText }) => (
  <>
    <div className="border-b-0 border-gray-200 pb-5">
      <h3 className="text-base font-semibold leading-6 text-gray-900">{text}</h3>
      <p className="mt-2 max-w-4xl text-sm text-gray-500">{subText}</p>
    </div>
  </>
);

const BrandNameSection = ({ brandName, handleUpdateState }) => (
  <div className="my-3">
    <Heading text={portalTexts.brandName.heading} subText={portalTexts.brandName.subText} />
    <TextInputField brandName={brandName} handleUpdateState={(field, value) => {
      // brand name should be less then 30 chrecter
      if (value.length > 30) {
        return
      }
      handleUpdateState(field, value)
    }} />
  </div>
);

const ImageAssetSection = ({ handleUpdateState, squareIcon, fullLogo, squareLoginImage }) => (
  <div className="my-3">
    <Heading text={portalTexts.imageAsset.heading} subText={portalTexts.imageAsset.subText} />
    <ul className='divide-y divide-gray-300'>
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

const BrandColorSection = ({ handleUpdateState, sidebarBgColor, sidebarActiveTextColor, sidebarTextColor, accentColor }) => (
  <div className="my-3 text-[15px] sm:text-[16px]">
    <Heading text={portalTexts.brandColors.heading} subText={portalTexts.brandColors.subText} />
    <ul className='divide-y divide-gray-300'>
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
  </div>
);

const PoweredBySection = ({ poweredByCopilot, handleUpdateState }) => (
  <div className="my-3">
    <Heading text={portalTexts.poweredBy.heading} subText={portalTexts.poweredBy.subText} />
    <div className="pb-12 flex items-center justify-between">
      <p>Powered by Copilot</p>
      <div>
        <SwitchComponent
          enabled={poweredByCopilot}
          setEnabled={value => {
            console.log(value)
            handleUpdateState('poweredByCopilot', value)
          }}
        />
      </div>
    </div>
  </div>
);

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
  const { brandName, squareIcon, fullLogo, squareLoginImage, poweredByCopilot, sidebarBgColor, sidebarTextColor, sidebarActiveTextColor, accentColor } = brandSettings


  const [contentPadding, setContentPadding] = useState(0);

  useEffect(() => {
    if (hasChanges) {
      setContentPadding(64); // Adjust this value based on the height of your ActionButtons
    } else {
      setContentPadding(0);
    }
  }, [hasChanges]);

  if (!portal) return <Layout>Loading...</Layout>;

  return (
    <Layout headerName='Customizations'>
      <div className="fixed top-0 right-0 z-50 w-[calc(100%-224px)]">
        <div
          className={`transition-all duration-300 ease-in-out ${hasChanges
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full'
            }`}
        >
          {hasChanges && (
            <div className="  bg-white">
              <ActionButtons
                isLoading={isLoading}
                onUpdate={handleUpdatePortalBrand}
                onCancel={resetBrandSettings}
                shouldShow
              />
            </div>
          )}
        </div>
      </div>
      <div
        className="w-full p-4 max-w-[600px] mx-auto transition-all duration-300 ease-in-out"
        style={{ paddingTop: `${contentPadding}px` }}
      >
        <h2 className="font-bold text-2xl my-3">
          Customize portal view
        </h2>
        <BrandNameSection
          brandName={brandName}
          handleUpdateState={handleUpdateState}
        />
        <ImageAssetSection
          handleUpdateState={handleUpdateState}
          squareIcon={squareIcon}
          fullLogo={fullLogo}
          squareLoginImage={squareLoginImage}
        />
        <BrandColorSection
          handleUpdateState={handleUpdateState}
          sidebarBgColor={sidebarBgColor}
          sidebarTextColor={sidebarTextColor}
          sidebarActiveTextColor={sidebarActiveTextColor}
          accentColor={accentColor}
        />
        <PoweredBySection
          poweredByCopilot={poweredByCopilot}
          handleUpdateState={handleUpdateState}
        />
      </div>
    </Layout>
  );
};
