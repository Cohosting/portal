import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface BottomActionBarProps {
   isLoading: boolean;
  onCancel: () => void;
  onSave: () => void;
  saveText?: string;
  cancelText?: string;
  isDisabled?: boolean;
}

const BottomActionBar: React.FC<BottomActionBarProps> = ({ 
   isLoading, 
  onCancel, 
  onSave, 
  saveText = 'Save Changes',
  cancelText = 'Cancel',
  isDisabled = false,
}) => {
  if (isDisabled) return null;

  return (
    <div className="fixed bottom-0  left-0 right-0 w-full bg-white/80 backdrop-blur-sm transition-opacity duration-200 ease-in-out z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <Separator className="h-[1px]" />
      <div className="flex items-center justify-end p-4 mx-auto max-w-screen-2xl">
        <Button 
          variant="ghost" 
          onClick={onCancel}
          className="mr-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          {cancelText}
        </Button>
        <Button 
          onClick={onSave}
          disabled={isLoading}
          className="bg-black text-white hover:bg-gray-800 text-sm font-medium transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          ) : (
            saveText
          )}
        </Button>
      </div>
    </div>
  );
};

export default BottomActionBar;

 