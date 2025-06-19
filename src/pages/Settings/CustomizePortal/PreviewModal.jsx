// src/pages/CustomizePortal/PreviewModal.jsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Monitor, Lock } from 'lucide-react';
import ClientPreview from './ClientPreview';
import LoginPreview from './LoginPreview';

// Preview tab button component
const PreviewTab = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 px-3 py-1 rounded-md ${
      active
        ? 'bg-white text-gray-900 shadow'
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    <Icon className="w-4 h-4" /> {label}
  </button>
);

// Preview tabs component (reusable for both modal and desktop)
export const PreviewTabs = ({ previewTab, setPreviewTab }) => (
  <div className="flex space-x-4 mb-4">
    <PreviewTab
      active={previewTab === 'dashboard'}
      onClick={() => setPreviewTab('dashboard')}
      icon={Monitor}
      label="Dashboard"
    />
    <PreviewTab
      active={previewTab === 'login'}
      onClick={() => setPreviewTab('login')}
      icon={Lock}
      label="Login"
    />
  </div>
);

// Preview content component (reusable for both modal and desktop)
export const PreviewContent = ({ previewTab, brandSettings, computedColors }) => (
  <>
    {previewTab === 'dashboard' ? (
      <ClientPreview brandSettings={brandSettings} computedColors={computedColors} />
    ) : (
      <LoginPreview
        brandSettings={brandSettings}
        computedColors={computedColors}
        usePortalBackground
      />
    )}
  </>
);

// Mobile preview modal
export const PreviewModal = ({ 
  previewOpen, 
  setPreviewOpen, 
  previewTab, 
  setPreviewTab, 
  brandSettings, 
  computedColors 
}) => (
  <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
    <DialogContent className="sm:max-w-[700px] bg-white w-[95vw]">
      <DialogHeader>
        <DialogTitle>Preview</DialogTitle>
      </DialogHeader>

      <PreviewTabs previewTab={previewTab} setPreviewTab={setPreviewTab} />
      <PreviewContent 
        previewTab={previewTab} 
        brandSettings={brandSettings} 
        computedColors={computedColors} 
      />
    </DialogContent>
  </Dialog>
);