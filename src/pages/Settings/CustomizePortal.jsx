import React, { useContext, useEffect, useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import { Box, Checkbox, Collapse, Flex, Input, Text, useToast } from '@chakra-ui/react';
import { ActionButtons } from '../../components/UI/ActionButtons';
import { AssetItem } from './AssetItem';
import { SketchPicker } from 'react-color';
import { ColorPicker } from '../../components/UI/ColorPicker';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { PortalContext } from '../../context/portalContext';
const Heading = ({ text, subText }) => {
  return (
    <>
      <Text fontSize={['15px', '16px']}>{text}</Text>
      <Text fontSize={['13px','14px']} my={2}>
        {subText}
      </Text>
    </>
  );
};

export const CustomizePortal = () => {
  const { portal } = useContext(PortalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, sethasChanges] = useState(false)
  const [previousSetting, setPreviousSetting] = useState({})
  const [brandSettings, setBrandSettings] = useState({

  });
  const toast = useToast()
  const {
    brandName,
    squareIcon,
    fullLogo,
    squareLoginImage,
    poweredByCopilot,
    sidebarBgColor,
    sidebarTextColor,
    accentColor,
  } = brandSettings;

  const handleUpdateState = (key, value) => {
    setBrandSettings({
      ...brandSettings,
      [key]: value,
    });
  };

  const handleUpdatePortalBrand = async () => {
    try {
      setIsLoading(true);
      const ref = doc(db, 'portals', portal.id);
      await updateDoc(ref, {
        brandSettings,
      });
      toast({
        title: 'Settings updated.',
        description: 'The Setting has been successfully updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(`Error while updating`, error);
    }
  };
  useEffect(() => {
    if (portal && portal.brandSettings) {
      setBrandSettings(portal.brandSettings);
      setPreviousSetting(portal.brandSettings)
    }
  }, [portal]);
  useEffect(() => {
    if (previousSetting !== null) {
      const dataChanged = JSON.stringify(brandSettings) !== JSON.stringify(previousSetting);
      sethasChanges(dataChanged);
    }
  }, [brandSettings, previousSetting]);
  if (!portal) return <Layout>Loading...</Layout>;
  return (
    <Layout>
      <Box>
        <Collapse in={hasChanges} animateOpacity>

        <ActionButtons
          isLoading={isLoading}
          onUpdate={handleUpdatePortalBrand}
          shouldShow={true}
        />
        </Collapse>
      </Box>

      <Box w={'100%'} maxW={'600px'} margin={'auto'}>
        <Text fontWeight={700} fontSize={'24px'} my={3}>Customize portal view</Text>
        <Box my={3}>
          <Heading
            text={'Brand name'}
            subText={
              'Your brand name is the name your customers use to refer to you. It doesn’t need to be your legal business name.'
            }
          />

          <Box>
            <Input
              value={brandName}
              onChange={e => handleUpdateState('brandName', e.target.value)}
              placeholder={'Brand name'}
            />
            <Text textAlign={'right'} fontSize={'14px'}>
              {!brandName ? 0 : brandName.length} of 30 characters used.
            </Text>
          </Box>
        </Box>

        <Box my={3}>
          <Heading
            text={'Image asset'}
            subText={
              'Your icon and login images are used in various places to customize the experience for you and your clients'
            }
          />

          <AssetItem
            text={'Square icon'}
            subText={'Used in the navbar and on mobile'}
            onUpload={handleUpdateState}
            field={'squareIcon'}
            initialDownloadUrl={squareIcon}
          />
          <AssetItem
            text={'Full logo'}
            subText={'Used on login pages and invoices            '}
            onUpload={handleUpdateState}
            field={'fullLogo'}
            initialDownloadUrl={fullLogo}
          />
          <AssetItem
            text={'Square login image'}
            subText={'Used on the side of your login page          '}
            onUpload={handleUpdateState}
            field={'squareLoginImage'}
            initialDownloadUrl={squareLoginImage}
          />
        </Box>

        <Box my={3} fontSize={['15px', '16px']}>
          <Heading
            text={'Brand colors'}
            subText={`Customize the colors in your portal. Note that these colors only affect your portal and not the internal user experience. The accent is used for buttons, tags, and other UI elements.`}
          />

          <Flex
          flexDir={['column', 'row']}
          alignItems={['flex-start','center']}

            borderTop={'1px solid gray'}
            justifyContent={'space-between'}
            p={3}
          >
            <Text my={1}>Sidebar background color</Text>
            <ColorPicker
              defaultColor={sidebarBgColor}
              field={'sidebarBgColor'}
              onCompletePick={handleUpdateState}
            />
          </Flex>
          <Flex
            borderTop={'1px solid gray'}
            justifyContent={'space-between'}
            p={3}
            flexDir={['column', 'row']}
            alignItems={['flex-start','center']}
  
          >
            <Text my={1}>Sidebar text color</Text>
            <ColorPicker
              defaultColor={sidebarTextColor}
              field={'sidebarTextColor'}
              onCompletePick={handleUpdateState}
            />
          </Flex>

          <Flex
            borderTop={'1px solid gray'}
            flexDir={['column', 'row']}
            alignItems={['flex-start','center']}            justifyContent={'space-between'}
            p={3}
          >
            <Text my={1}>Accent color</Text>
            <ColorPicker
              defaultColor={accentColor}
              field={'accentColor'}
              onCompletePick={handleUpdateState}
            />
          </Flex>
        </Box>
        <Box my={3}>
          <Heading
            text={'Powered by Copilot badge'}
            subText={
              'The Powered by Copilot badge shows on the sign in and sign up pages of your portal.'
            }
          />

          <Flex pb={'50px'} alignItems={'center'} justifyContent={'space-between'}>
            <Text>Powered by Copilot</Text>
            <Box>
              <Checkbox
                onChange={e =>
                  handleUpdateState('poweredByCopilot', e.target.checked)
                }
                isChecked={poweredByCopilot}
              />
            </Box>
          </Flex>
        </Box>
      </Box>
    </Layout>
  );
};
