import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Home,
  ChevronRight,
  Folder,
  File,
  Eye,
  Download,
  Loader2,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabase';
import FileViewer from '@/pages/Files/FileViewer';
import { useClientAuth } from '@/hooks/useClientAuth';
import { useDomainInfo } from '@/hooks/useDomainInfo';
import { useClientPortalData } from '@/hooks/react-query/usePortalData';
import { defaultBrandSettings, deriveColors, getComputedColors } from '@/utils/colorUtils';

const STORAGE_BUCKET = 'file-storage';

const ClientFiles = () => {
  const [items, setItems] = useState([]);
  const [allFolders, setAllFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { domain } = useDomainInfo();
  const { data: portal } = useClientPortalData(domain);
  const { clientUser, isLoading: clientLoading } = useClientAuth(portal?.id);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [downloadingFile, setDownloadingFile] = useState(null);

  const brandSettings = portal?.brand_settings || defaultBrandSettings;
  const computedColors = useMemo(() => {
    return brandSettings.showAdvancedOptions 
      ? getComputedColors(brandSettings)     // Use advanced colors
      : deriveColors(brandSettings.baseColors); // Ignore advanced colors completely
  }, [brandSettings]);
  const { primaryButtonColor } = computedColors;
  
  useEffect(() => {
    if (clientUser?.email) {
      loadAllSharedFolders();
      loadSharedItems();
    }
  }, [clientUser, currentFolder]);

  async function loadSharedItems() {
    if (!clientUser?.email) return;
    setLoading(true);
    try {
      const { data, error: rpcError } = await supabase.rpc(
        'get_shared_folder_contents',
        { p_user_email: clientUser.email, p_folder_id: currentFolder }
      );
      if (rpcError) throw rpcError;
      setItems(data || []);
      setError(null);
    } catch (err) {
      console.error('Load shared items error:', err);
      setError('Failed to load shared items');
    } finally {
      setLoading(false);
    }
  }

  async function loadAllSharedFolders() {
    if (!clientUser?.email) return;
    try {
      const { data, error: rpcError } = await supabase.rpc(
        'get_shared_folder_hierarchy',
        { p_user_email: clientUser.email }
      );
      if (rpcError) throw rpcError;
      setAllFolders(data || []);
    } catch (err) {
      console.error('Load all shared folders error:', err);
    }
  }

  function buildFolderPath(folderId) {
    if (!folderId) return [];
    const path = [];
    let curr = folderId;
    while (curr) {
      const folder = allFolders.find(f => f.id === curr);
      if (!folder) break;
      path.unshift(folder);
      curr = folder.parent_id;
    }
    return path;
  }

  function getItemIcon(item) {
    if (item.type === 'folder') {
      return <Folder className="w-5 h-5" style={{ color: primaryButtonColor }} />;
    }
    return <File className="w-5 h-5" style={{ color: primaryButtonColor }} />;
  }

  function formatFileSize(bytes) {
    if (!bytes) return '—';
    if (bytes >= 1024 * 1024) {
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  function getFileUrl(path) {
    if (!path) return '';
    return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  async function downloadFile(item) {
    try {
      setDownloadingFile(item.id);
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(item.file_path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download file');
    } finally {
      setDownloadingFile(null);
    }
  }

  function handleItemNameClick(item, event) {
    event.stopPropagation();
    if (item.type === 'folder') {
      setCurrentFolder(item.id);
    }
  }

  function openPreview(item) {
    if (item.type === 'file') {
      setPreviewFile(item);
      setShowPreviewDialog(true);
    }
  }

  const currentPath = buildFolderPath(currentFolder);

  if (clientLoading || !clientUser?.email || loading) {
    return (
      <div className="flex items-center justify-center h-96">
      <Loader2 className=" animate-spin w-12 h-12 text-primary" />
  </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-white min-h-screen">
      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 mx-6 mt-4 rounded-lg flex items-center">
          <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
          <span className="text-red-700 text-sm">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      <div className="border-b bg-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Shared Files</h1>
              
              <nav className="flex items-center space-x-1 text-sm text-gray-600">
                <button
                  onClick={() => setCurrentFolder(null)}
                  className="flex items-center hover:text-gray-900 transition-colors"
                >
                  <Home className="w-4 h-4" />
                </button>
                
                {currentPath.map((folder, index) => (
                  <React.Fragment key={folder.id}>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <button
                      onClick={() => setCurrentFolder(folder.id)}
                      className="hover:text-gray-900 transition-colors max-w-32 truncate"
                    >
                      {folder.name}
                    </button>
                  </React.Fragment>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <Folder className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {currentFolder ? 'This folder is empty' : 'No files shared with you'}
            </h3>
            <p className="text-gray-500">
              {currentFolder ? 'This shared folder contains no items' : 'You don\'t have any shared files yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {items.map(item => (
              <div
                key={item.id}
                className="group flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center min-w-0 flex-1">
                  <div className="flex-shrink-0 mr-3">
                    {getItemIcon(item)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center">
                      <p 
                        className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600"
                        onClick={(e) => handleItemNameClick(item, e)}
                      >
                        {item.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-8 text-sm text-gray-500">
                  <span className="w-16 text-right">
                    {formatFileSize(item.file_size)}
                  </span>
                  <span className="w-20 text-right">
                    {formatDate(item.created_at)}
                  </span>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white">
                      {item.type === 'file' && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => openPreview(item)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => downloadFile(item)}
                            disabled={downloadingFile === item.id}
                          >
                            {downloadingFile === item.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </>
                            )}
                          </DropdownMenuItem>
                        </>
                      )}
                      {item.type === 'folder' && (
                        <DropdownMenuItem 
                          onClick={() => setCurrentFolder(item.id)}
                        >
                          <Folder className="w-4 h-4 mr-2" />
                          Open Folder
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview dialog */}
      <FileViewer
        isOpen={showPreviewDialog}
        file={previewFile}
        fileUrl={previewFile ? getFileUrl(previewFile.file_path) : ''}
        downloadFile={downloadFile}
        formatFileSize={formatFileSize}
        loadingStates={{ downloading: downloadingFile }}
        onClose={() => {
          setShowPreviewDialog(false);
          setPreviewFile(null);
        }}
      />
    </div>
  );
};

export default ClientFiles;