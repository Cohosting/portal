import { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';
import IconSelector from './IconSelector';
import { Loader } from 'lucide-react';
import queryClient from '@/hooks/react-query/queryClient';
import { queryKeys } from '@/hooks/react-query/queryKeys';

// ✅ New validation helper
const isValidURL = (str) => {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const AppConfigurationModal = ({ isOpen, onClose, appId, clientId }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [appSettings, setAppSettings] = useState({
    viewType: 'embedded',
    content: '',
    autoSize: true,
    setupType: 'manual',
  });
  const [editAppSettings, setEditAppSettings] = useState(null);
  const [error, setError] = useState(null); // ✅ Error state

  const { viewType, content, autoSize } = appSettings;

  const validate = () => {
    if (!content.trim()) {
      return 'Content cannot be empty';
    }
    if (viewType === 'link' && !isValidURL(content.trim())) {
      return 'Please enter a valid URL';
    }
    return null;
  };

  const handleSaveSettings = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data: app } = await supabase
        .from('portal_apps')
        .select('*')
        .eq('id', appId)
        .single();

      const updatedSettings = editAppSettings
        ? updateClientSettings(editAppSettings.settings.clientsSettings)
        : [
            ...(app.settings.clientsSettings || []),
            { ...appSettings, clientId },
          ];

      const { error: updateError } = await supabase
        .from('portal_apps')
        .update({
          settings: {
            ...app.settings,
            clientsSettings: updatedSettings,
          },
        })
        .eq('id', appId);

      if (updateError) throw updateError;

      // ✅ Update cache to avoid stale UI
      queryClient.setQueryData(queryKeys.portalData(app.portal_id), (old) => {
        if (!old) return old;
        return {
          ...old,
          portal_apps: old.portal_apps.map((a) => {
            if (a.id !== appId) return a;
            return {
              ...a,
              settings: {
                ...a.settings,
                clientsSettings: updatedSettings,
              },
            };
          }),
        };
      });

      toast.success('App settings saved');
      onClose();
    } catch (error) {
      console.error(`Error saving app settings: ${error}`);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateClientSettings = (currentSettings) => {
    const index = currentSettings.findIndex(
      (client) => client.clientId === clientId
    );
    if (index > -1) {
      currentSettings[index] = { ...appSettings, clientId };
    } else {
      currentSettings.push({ ...appSettings, clientId });
    }
    return currentSettings;
  };

  useEffect(() => {
    if (editAppSettings) return;
    const getAppData = async () => {
      const { data } = await supabase
        .from('portal_apps')
        .select('*')
        .eq('id', appId)
        .single();

      setEditAppSettings(data);
      const clientSettings = data.settings.clientsSettings.find(
        (client) => client.clientId === clientId
      );
      clientSettings && setAppSettings(clientSettings);
    };
    getAppData();
  }, [appId, clientId, editAppSettings]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>Embed App</DialogTitle>
        </DialogHeader>

        {!editAppSettings ? (
          <div className="flex justify-center mt-8 items-center space-x-2 mb-4">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="viewType">View Type</Label>
                <Select
                  value={viewType}
                  onValueChange={(value) =>
                    setAppSettings({ ...appSettings, viewType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select view type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="embedded">
                      Show as embed - App shows directly in your Portal
                    </SelectItem>
                    <SelectItem value="link">
                      Show as link - App opens in a new browser tab
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Can be public URL</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) =>
                    setAppSettings({ ...appSettings, content: e.target.value })
                  }
                  rows={3}
                />
                {error && (
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
              </div>

              {viewType === 'embedded' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autoSize"
                    checked={autoSize}
                    onCheckedChange={(checked) =>
                      setAppSettings({ ...appSettings, autoSize: checked })
                    }
                  />
                  <Label htmlFor="autoSize">Auto size embed</Label>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button onClick={onClose}>Cancel</Button>
              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="bg-black text-white hover:bg-gray-800"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
