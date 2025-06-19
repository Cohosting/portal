// src/pages/CustomizePortal/PortalSections.jsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { AssetItem } from './AssetItem';
import SwitchComponent from '@/components/SwitchComponent';
import { portalTexts } from '@/utils/constant';

// Image upload section
export const ImageAssetSection = ({ handleUpdateAsset, assets, Heading }) => (
  <div className="my-6 text-sm">
    <Heading text={portalTexts.imageAsset.heading} subText={portalTexts.imageAsset.subText} />
    <ul className="divide-y divide-gray-300">
      {['squareIcon', 'fullLogo', 'squareLoginImage'].map(field => (
        <AssetItem
          key={field}
          text={portalTexts.imageAsset[field]}
          subText={portalTexts.imageAsset[`${field}SubText`]}
          onUpload={handleUpdateAsset}
          field={field}
          initialDownloadUrl={assets[field]}
        />
      ))}
    </ul>
  </div>
);

// Powered by toggle
export const PoweredBySection = ({ poweredByCopilot, handleUpdateSetting, Heading }) => (
  <div className="my-6 text-sm">
    <Heading text={portalTexts.poweredBy.heading} subText={portalTexts.poweredBy.subText} />
    <div className="flex items-center justify-between">
      <span>Powered by Copilot</span>
      <SwitchComponent enabled={poweredByCopilot} setEnabled={v => handleUpdateSetting('poweredByCopilot', v)} />
    </div>
  </div>
);

// Brand name section
export const BrandNameSection = ({ brandName, handleUpdateSetting, Heading }) => (
  <div className="my-6 text-sm">
    <Heading text={portalTexts.brandName.heading} subText={portalTexts.brandName.subText} />
    <Input
      value={brandName}
      onChange={e => {
        const v = e.target.value;
        if (v.length <= 30) handleUpdateSetting('brandName', v);
      }}
      maxLength={30}
      placeholder="Enter brand name"
      className="w-full"
    />
  </div>
);