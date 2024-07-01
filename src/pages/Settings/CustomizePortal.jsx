import React, { useContext } from 'react';
import { Layout } from '../Dashboard/Layout';
import { Box, Checkbox, Collapse, Flex, Text } from '@chakra-ui/react';
import { ActionButtons } from '../../components/UI/ActionButtons';
import { AssetItem } from './AssetItem';
import { BrandColorPicker } from '../../components/UI/ColorPicker';
import TextInputField from '../../components/UI/TextInputField';
import { useCustomizePortalLogic } from '../../hooks/useCustomizePortalLogic';
import { portalTexts } from '../../utils/constant';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';

const Heading = ({ text, subText }) => (
  <>
    <Text fontSize={['15px', '16px']}>{text}</Text>
    <Text fontSize={['13px', '14px']} my={2}>
      {subText}
    </Text>
  </>
);

const BrandNameSection = ({ brandName, handleUpdateState }) => (
  <Box my={3}>
    <Heading text={portalTexts.brandName.heading} subText={portalTexts.brandName.subText} />
    <TextInputField brandName={brandName} handleUpdateState={handleUpdateState} />
  </Box>
);

const ImageAssetSection = ({ handleUpdateState, squareIcon, fullLogo, squareLoginImage }) => (
  <Box my={3}>
    <Heading text={portalTexts.imageAsset.heading} subText={portalTexts.imageAsset.subText} />
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
  </Box>
);

const BrandColorSection = ({ handleUpdateState, sidebarBgColor, sidebarTextColor, accentColor }) => (
  <Box my={3} fontSize={['15px', '16px']}>
    <Heading text={portalTexts.brandColors.heading} subText={portalTexts.brandColors.subText} />
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
      title={portalTexts.brandColors.accentColor}
      defaultColor={accentColor}
      field="accentColor"
      onCompletePick={handleUpdateState}
    />
  </Box>
);

const PoweredBySection = ({ poweredByCopilot, handleUpdateState }) => (
  <Box my={3}>
    <Heading text={portalTexts.poweredBy.heading} subText={portalTexts.poweredBy.subText} />
    <Flex pb="50px" alignItems="center" justifyContent="space-between">
      <Text>Powered by Copilot</Text>
      <Box>
        <Checkbox
          onChange={e => handleUpdateState('poweredByCopilot', e.target.checked)}
          isChecked={poweredByCopilot}
        />
      </Box>
    </Flex>
  </Box>
);

export const CustomizePortal = () => {
  const { user } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(user?.portals);
  const {
    isLoading,
    hasChanges,
    brandSettings,
    handleUpdateState,
    handleUpdatePortalBrand,
  } = useCustomizePortalLogic();
  const { brandName, squareIcon, fullLogo, squareLoginImage, poweredByCopilot, sidebarBgColor, sidebarTextColor, accentColor } = brandSettings;

  if (!portal) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <Box>
        <Collapse in={hasChanges} animateOpacity>
          <ActionButtons isLoading={isLoading} onUpdate={handleUpdatePortalBrand} shouldShow />
        </Collapse>
      </Box>
      <Box w="100%" maxW="600px" margin="auto">
        <Text fontWeight={700} fontSize="24px" my={3}>
          Customize portal view
        </Text>
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
          accentColor={accentColor}
        />
        <PoweredBySection
          poweredByCopilot={poweredByCopilot}
          handleUpdateState={handleUpdateState}
        />
      </Box>
    </Layout>
  );
};
