// useCustomizePortalLogic.js
import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { usePortalData } from './react-query/usePortalData';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import { 
  defaultBrandSettings, 
  getComputedColors,
  deriveColors 
} from '../utils/colorUtils';

export const useCustomizePortalLogic = () => {
  const { currentSelectedPortal } = useSelector(s => s.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [previousSetting, setPreviousSetting] = useState(null);
  const [brandSettings, setBrandSettings] = useState(defaultBrandSettings);

  // Computed colors for previews
  const computedColors = useMemo(
    () => getComputedColors(brandSettings),
    [brandSettings]
  );
  const derivedColors = useMemo(
    () => deriveColors(brandSettings.baseColors),
    [brandSettings.baseColors]
  );

  // Base color updates
  const handleUpdateBaseColor = (colorKey, value) => {
    setBrandSettings(bs => ({
      ...bs,
      baseColors: {
        ...bs.baseColors,
        [colorKey]: value,
      }
    }));
  };

  // Advanced override updates (flat key)
  const handleUpdateAdvancedColor = (tokenKey, value) => {
    setBrandSettings(bs => ({
      ...bs,
      advancedColors: {
        ...bs.advancedColors,
        [tokenKey]: value || null,
      }
    }));
  };

  // Reset all overrides to “null”
  const resetAdvancedColors = () => {
    setBrandSettings(bs => ({
      ...bs,
      advancedColors: {
        ...defaultBrandSettings.advancedColors
      }
    }));
  };

  // Other updates
  const handleUpdateAsset = (assetKey, value) => {
    setBrandSettings(bs => ({
      ...bs,
      assets: {
        ...bs.assets,
        [assetKey]: value,
      }
    }));
  };
  const toggleAdvancedOptions = () => {
    setBrandSettings(bs => ({
      ...bs,
      showAdvancedOptions: !bs.showAdvancedOptions,
    }));
  };
  const handleUpdateSetting = (key, value) => {
    setBrandSettings(bs => ({
      ...bs,
      [key]: value,
    }));
  };

  // Save to Supabase
  const handleUpdatePortalBrand = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('portals')
        .update({ brand_settings: brandSettings })
        .eq('id', portal.id);

      if (error) throw error;

      toast.success('Portal brand settings updated successfully', { position:'bottom-center' });
      setPreviousSetting(brandSettings);
      setHasChanges(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update portal settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Init from DB
  useEffect(() => {
    if (portal) {
      const settings = portal.brand_settings
        ? { ...defaultBrandSettings, ...portal.brand_settings }
        : { ...defaultBrandSettings, brandName: portal.name || '' };
      setBrandSettings(settings);
      setPreviousSetting(settings);
    }
  }, [portal]);

  // Track dirty state
  useEffect(() => {
    if (previousSetting) {
      setHasChanges(JSON.stringify(brandSettings) !== JSON.stringify(previousSetting));
    }
  }, [brandSettings, previousSetting]);

  const resetBrandSettings = () => {
    setBrandSettings(previousSetting);
  };

  return {
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
    resetBrandSettings,
  };
};
