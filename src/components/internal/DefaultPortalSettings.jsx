import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '../../lib/supabase';
import { Check, ChevronDown, CheckCircle } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DefaultPortalSettings = () => {
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { user, currentSelectedPortal } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // Filter unique portals
  const portals = (user?.portals || []).filter((portal, index, self) =>
    index === self.findIndex((t) => t.id === portal.id)
  );

  useEffect(() => {
    if (portals.length > 0) {
      const portal = portals.find(portal => portal.id === currentSelectedPortal);
      setSelectedPortal(portal || portals[0]);
    }
  }, [currentSelectedPortal, user, portals]);

  const handleSave = async () => {
    if (!selectedPortal) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from('users').update({
        default_portal: selectedPortal.id
      }).eq('id', user.id);
      
      if (error) throw error;
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Error updating default portal:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const isDisabled = currentSelectedPortal === selectedPortal?.id || isSaving;

  const handleSelectChange = (value) => {
    const selected = portals.find(portal => portal.id === value);
    setSelectedPortal(selected);
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Default Portal</h2>
        <p className="text-sm text-gray-600 mt-1">
          Choose which portal you'd like to see first when you log in.
        </p>
      </div>
      
      <div className="space-y-4">
        <Select 
          value={selectedPortal?.id} 
          onValueChange={handleSelectChange}
          disabled={portals.length === 0}
        >
          <SelectTrigger className="w-full border-gray-200 focus:ring-gray-400">
            <SelectValue placeholder="Select a portal">
              {selectedPortal?.brand_settings?.brandName || 'Select a portal'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {portals.map((portal) => (
              <SelectItem 
                key={portal.id} 
                value={portal.id}
                className="focus:bg-gray-100"
              >
                <div className="flex items-center">
                  {selectedPortal?.id === portal.id && (
                    <Check className="mr-2 h-4 w-4 text-gray-500" />
                  )}
                  <span>{portal.brand_settings?.brandName}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="pt-2">
          <Button
            onClick={handleSave}
            disabled={isDisabled}
            className="  bg-black hover:bg-gray-800 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {isSaved && (
          <Alert className="bg-green-50 border-green-200 text-green-800 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <AlertDescription>Your changes have been saved successfully.</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default DefaultPortalSettings;