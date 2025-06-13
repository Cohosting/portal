import React, { useState, useEffect } from 'react';
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
  User,
  Calendar
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import FileViewer from '@/pages/Files/FileViewer';
import { useClientAuth } from '@/hooks/useClientAuth';
import { useDomainInfo } from '@/hooks/useDomainInfo';
import { useClientPortalData } from '@/hooks/react-query/usePortalData';

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
      return <Folder className="w-5 h-5 text-blue-600" />;
    }
    const ext = item.name.split('.').pop()?.toLowerCase();
    const colors = {
      pdf: 'text-red-500',
      doc: 'text-blue-500',
      docx: 'text-blue-500',
      xlsx: 'text-green-500',
      jpg: 'text-purple-500',
      png: 'text-purple-500',
      txt: 'text-gray-500'
    };
    return <File className={`w-5 h-5 ${colors[ext] || 'text-gray-500'}`} />;
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
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
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

  function openPreview(item) {
    if (item.type === 'file') {
      setPreviewFile(item);
      setShowPreviewDialog(true);
    } else {
      setCurrentFolder(item.id);
    }
  }

  const currentPath = buildFolderPath(currentFolder);

  if (clientLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!clientUser?.email) {
    return (
      <div className="flex items-center justify-center h-screen">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="ml-2">Unable to authenticate</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="ml-2">Loading shared files...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white min-h-screen">
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 m-6 rounded flex items-center">
          <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-500">×</button>
        </div>
      )}

      {/* Sticky header with updated breadcrumb */}
      <div className="sticky top-0 bg-white border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <nav className="flex items-center text-gray-600 space-x-2">
            <button onClick={() => setCurrentFolder(null)}>
              <Home className="w-5 h-5" />
            </button>
            {currentPath.length === 0 ? (
              <span className="ml-2 font-medium text-gray-800">Files Shared with You</span>
            ) : (
              currentPath.map(f => (
                <React.Fragment key={f.id}>
                  <ChevronRight className="w-4 h-4" />
                  <button
                    onClick={() => setCurrentFolder(f.id)}
                    className="hover:underline truncate max-w-xs"
                  >
                    {f.name}
                  </button>
                </React.Fragment>
              ))
            )}
          </nav>
          <div className="text-sm text-gray-500">
            {items.length} item{items.length !== 1 && 's'} shared with you
          </div>
        </div>
      </div>

      {/* File and folder list */}
      <div className="px-6 py-4">
        {!items.length ? (
          <div className="text-center py-16 text-gray-500">
            <Folder className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium">
              {currentFolder ? 'This folder is empty' : 'No files shared with you'}
            </h3>
          </div>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              className="group flex items-center p-3 border-b hover:bg-gray-50"
              onClick={() => openPreview(item)}
            >
              <div className="flex-1 flex items-center min-w-0">
                <div className="mr-4">{getItemIcon(item)}</div>
                <div className="truncate">
                  <p className="font-medium text-gray-900 truncate">{item.name}</p>
                  <div className="flex text-xs text-gray-500 space-x-4 mt-1">
                    <span className="flex items-center"><User className="w-3 h-3 mr-1" />{item.shared_by_email || 'Someone'}</span>
                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />{formatDate(item.share_created_at || item.created_at)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span className="w-16 text-right">{formatFileSize(item.file_size)}</span>
                <span className="w-20 text-right">{formatDate(item.created_at)}</span>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100">
                  {item.type === 'file' ? (
                    <>
                      <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); openPreview(item); }}><Eye className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); downloadFile(item); }} disabled={downloadingFile === item.id}>
                        {downloadingFile === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); setCurrentFolder(item.id); }}><Folder className="w-4 h-4" /></Button>
                  )}
                </div>
              </div>
            </div>
          ))
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
        onClose={() => setShowPreviewDialog(false)}
      />
    </div>
  );
};

export default ClientFiles;
