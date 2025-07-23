import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Folder, File, Plus, Upload, Trash2, MoreHorizontal, ChevronRight, Home, Download, Edit3, Star, Share, Eye, Loader2, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Layout } from '../Dashboard/Layout';
import { sanitizeFileName } from '@/utils/file-upload';
import FileViewer from './FileViewer';
import ShareModal from './ShareModal'; // Import the ShareModal component
import { useSelector } from 'react-redux';
import { CustomSkeleton } from '@/components/SkeletonLoading';
import { Move } from 'lucide-react';

const STORAGE_BUCKET = 'file-storage';

const Files = () => {
  const [items, setItems] = useState([]);
  const [allFolders, setAllFolders] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [lastSelectedItem, setLastSelectedItem] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [error, setError] = useState(null);

  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false); // Add share dialog state
  const [shareItem, setShareItem] = useState(null); // Add share item state
  const [moveDialogCurrentFolder, setMoveDialogCurrentFolder] = useState(null);
  
  const [itemsToMove, setItemsToMove] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [renameItemId, setRenameItemId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  // Enhanced loading states with pending items
  const [loadingStates, setLoadingStates] = useState({
    loading: true,
    creating: false,
    uploading: false,
    deleting: [],
    moving: false,
    renaming: null,
    starring: [],
    downloading: null
  });

  // New state for pending items that appear with loading spinners
  const [pendingItems, setPendingItems] = useState([]);
  // New state to track if we should skip loading spinner
  const [skipNextLoading, setSkipNextLoading] = useState(false);
  const { user, currentSelectedPortal } = useSelector((state) => state.auth);

  const fileInputRef = useRef(null);

  // Memoize loadItems to prevent infinite re-renders
  const loadItems = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoadingStates(prev => ({ ...prev, loading: true }));
      }
      
      const { data, error } = await supabase.rpc('get_user_items', {
        folder_id: currentFolder,
        p_portal_id: currentSelectedPortal
      });

      if (error) throw error;

      setItems(data || []);
      setPendingItems([]); // Clear pending items when real items load
      setError(null);
    } catch (err) {
      setError('Failed to load items');
      console.error('Load items error:', err);
    } finally {
      if (showLoading) {
        setLoadingStates(prev => ({ ...prev, loading: false }));
      }
    }
  }, [currentFolder, currentSelectedPortal]);

  // Memoize loadAllFolders to prevent infinite re-renders
  const loadAllFolders = useCallback(async () => {
    try {
      const { data, error } = await supabase
      .from('file_items')
      .select('id, name, parent_id')
      .eq('type', 'folder')
      .eq('portal_id', currentSelectedPortal)
      .order('name');

      if (error) throw error;

      setAllFolders(data || []);
    } catch (err) {
      console.error('Load all folders error:', err);
    }
  }, [currentSelectedPortal]);

  // Reset state when portal changes
  useEffect(() => {
    if (currentSelectedPortal) {
      // Reset folder navigation to root when portal changes
      setCurrentFolder(null);
      setSelectedItems([]);
      setLastSelectedItem(null);
      setPendingItems([]);
      setError(null);
    }
  }, [currentSelectedPortal]);
 
  useEffect(() => {
    if (user && currentSelectedPortal) {
      const shouldShowLoading = !skipNextLoading;
      setSkipNextLoading(false); // Reset the flag
      loadItems(shouldShowLoading);
      loadAllFolders();
    }
  }, [currentFolder, user, currentSelectedPortal, loadItems, loadAllFolders]);

  const createFolder = async (name, parentId) => {
    setLoadingStates(prev => ({ ...prev, creating: true }));
    
    // Add pending folder immediately
    const pendingFolder = {
      id: `pending-folder-${Date.now()}`,
      name,
      type: 'folder',
      parent_id: parentId,
      pending: true,
      created_at: new Date().toISOString(),
      portal_id: currentSelectedPortal,
    };
    
    setPendingItems(prev => [...prev, pendingFolder]);
    
    try {
      const { data, error } = await supabase.from('file_items').insert({
        name,
        type: 'folder',
        parent_id: parentId,
        owner_id: user.id,
        portal_id: currentSelectedPortal,
      }).select();
  
      if (error) throw error;
  
      // Set flag to skip loading spinner on next loadItems call
      setSkipNextLoading(true);
      
      // Update items without full loading spinner
      await loadItems(false);
      await loadAllFolders();
      return data?.[0] || null;
    } catch (err) {
      // Remove pending item on error
      setPendingItems(prev => prev.filter(item => item.id !== pendingFolder.id));
      setError('Failed to create folder');
      console.error('Create folder error:', err);
      throw err;
    } finally {
      setLoadingStates(prev => ({ ...prev, creating: false }));
    }
  };

  const uploadFiles = async (files, parentId) => {
    setLoadingStates(prev => ({ ...prev, uploading: true }));
    
    // Add pending files immediately
    const pendingFiles = files.map(file => ({
      id: `pending-file-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: 'file',
      parent_id: parentId,
      pending: true,
      file_size: file.size,
      mime_type: file.type,
      created_at: new Date().toISOString(),
      portal_id: currentSelectedPortal,
    }));
    
    setPendingItems(prev => [...prev, ...pendingFiles]);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const sanitizedFileName = sanitizeFileName(file.name);
        const fileName = `${Date.now()}-${sanitizedFileName}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, file);
  
        if (uploadError) throw uploadError;
  
        const { data, error } = await supabase.from('file_items').insert({
          name: file.name,
          type: 'file',
          parent_id: parentId,
          owner_id: user.id,
          portal_id: currentSelectedPortal,
          file_path: uploadData.path,
          file_size: file.size,
          mime_type: file.type
        }).select();
  
        if (error) throw error;
        return data?.[0] || null;
      });
  
      await Promise.all(uploadPromises);
      
      // Set flag to skip loading spinner on next loadItems call
      setSkipNextLoading(true);
      
      // Update items without full loading spinner
      await loadItems(false);
    } catch (err) {
      // Remove pending files on error
      const pendingIds = pendingFiles.map(f => f.id);
      setPendingItems(prev => prev.filter(item => !pendingIds.includes(item.id)));
      setError('Failed to upload files');
      console.error('Upload files error:', err);
      throw err;
    } finally {
      setLoadingStates(prev => ({ ...prev, uploading: false }));
    }
  };

  const deleteItems = async (itemIds) => {
    setLoadingStates(prev => ({ ...prev, deleting: itemIds }));
    
    try {
      const itemsToDelete = items.filter(item => itemIds.includes(item.id));
      
      const fileItems = itemsToDelete.filter(item => item.type === 'file' && item.file_path);
      if (fileItems.length > 0) {
        const filePaths = fileItems.map(item => item.file_path);
        await supabase.storage
          .from(STORAGE_BUCKET)
          .remove(filePaths);
      }

      const { error } = await supabase.from('file_items')
        .delete()
        .in('id', itemIds)
        .eq('portal_id', currentSelectedPortal);

      if (error) throw error;

      setSelectedItems([]);
      setLastSelectedItem(null);
      // Update items without full loading spinner
      await loadItems(false);
      await loadAllFolders();
    } catch (err) {
      setError('Failed to delete items');
      console.error('Delete items error:', err);
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: [] }));
    }
  };

  const moveItems = async (itemIds, newParentId) => {
    setLoadingStates(prev => ({ ...prev, moving: true }));
    
    try {
      const { error } = await supabase.from('file_items')
      .update({ parent_id: newParentId })
      .in('id', itemIds)
      .eq('portal_id', currentSelectedPortal);
      if (error) throw error;

      // Update items without full loading spinner
      await loadItems(false);
      await loadAllFolders();
    } catch (err) {
      setError('Failed to move items');
      console.error('Move items error:', err);
      throw err;
    } finally {
      setLoadingStates(prev => ({ ...prev, moving: false }));
    }
  };

  const renameItem = async (itemId, newName) => {
    setLoadingStates(prev => ({ ...prev, renaming: itemId }));
    
    try {
      const { error } = await supabase.from('file_items')
        .update({ 
          name: newName,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)
        .eq('portal_id', currentSelectedPortal);

      if (error) throw error;

      // Update items without full loading spinner
      await loadItems(false);
      await loadAllFolders();
    } catch (err) {
      setError('Failed to rename item');
      console.error('Rename item error:', err);
      throw err;
    } finally {
      setLoadingStates(prev => ({ ...prev, renaming: null }));
    }
  };

  const toggleStarItem = async (itemId) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    setLoadingStates(prev => ({ ...prev, starring: [...prev.starring, itemId] }));
    
    try {
      const { error } = await supabase.from('file_items')
        .update({ starred: !item.starred })
        .eq('id', itemId)
        .eq('portal_id', currentSelectedPortal);

      if (error) throw error;

      // Update items without full loading spinner
      await loadItems(false);
    } catch (err) {
      setError('Failed to update star status');
      console.error('Toggle star error:', err);
    } finally {
      setLoadingStates(prev => ({ 
        ...prev, 
        starring: prev.starring.filter(id => id !== itemId) 
      }));
    }
  };

  // Add share functions
  const openShareDialog = (item) => {
    // Verify item belongs to current portal
    if (item.portal_id !== currentSelectedPortal) {
      setError('Cannot share items from other portals');
      return;
    }
    
    setShareItem(item);
    setShowShareDialog(true);
  };

  const closeShareDialog = () => {
    setShowShareDialog(false);
    setShareItem(null);
  };

  // Combine real items with pending items for display
  const getCurrentItems = () => {
    const allItems = [...items, ...pendingItems];
    return allItems.sort((a, b) => {
      // Folders first, then files
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  };

  const buildFolderPath = (folderId, foldersList = allFolders) => {
    if (!folderId) return [];
    
    const path = [];
    let current = folderId;
    
    while (current) {
      const folder = foldersList.find(item => item.id === current);
      if (folder) {
        path.unshift(folder);
        current = folder.parent_id;
      } else {
        break;
      }
    }
    
    return path;
  };

  const getItemIcon = (item) => {
    if (item.type === 'folder') {
      return <Folder className="w-5 h-5 text-blue-600" />;
    }
    
    const extension = item.name.split('.').pop()?.toLowerCase();
    const iconColors = {
      pdf: 'text-red-500',
      doc: 'text-blue-500',
      docx: 'text-blue-500',
      xlsx: 'text-green-500',
      jpg: 'text-purple-500',
      png: 'text-purple-500',
      txt: 'text-gray-500'
    };
    
    return <File className={`w-5 h-5 ${iconColors[extension] || 'text-gray-500'}`} />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes >= 1024 * 1024) {
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleItemClick = (item, event) => {
    event.stopPropagation();
    
    // Don't allow selection of pending items
    if (item.pending) return;
    
    if (event.ctrlKey || event.metaKey) {
      setSelectedItems(prev => {
        if (prev.includes(item.id)) {
          const newSelected = prev.filter(id => id !== item.id);
          setLastSelectedItem(newSelected.length > 0 ? newSelected[newSelected.length - 1] : null);
          return newSelected;
        } else {
          setLastSelectedItem(item.id);
          return [...prev, item.id];
        }
      });
    } else {
      setSelectedItems([item.id]);
      setLastSelectedItem(item.id);
    }
  };

  const handleItemNameClick = (item, event) => {
    event.stopPropagation();
    
    // Don't allow navigation to pending folders
    if (item.pending) return;
    
    if (item.type === 'folder') {
      navigateToFolder(item.id);
    }
  };

  const handleContainerClick = () => {
    setSelectedItems([]);
    setLastSelectedItem(null);
  };

  const navigateToFolder = (folderId) => {
    // If navigating to root (null), allow it
    if (folderId === null) {
      setCurrentFolder(folderId);
      setSelectedItems([]);
      setLastSelectedItem(null);
      setPendingItems([]);
      return;
    }
    
    // Verify the target folder belongs to current portal
    const targetFolder = allFolders.find(folder => folder.id === folderId);
    if (!targetFolder) {
      setError('Folder not found or access denied');
      return;
    }
    
    setCurrentFolder(folderId);
    setSelectedItems([]);
    setLastSelectedItem(null);
    setPendingItems([]);
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      try {
        await createFolder(newFolderName, currentFolder);
        setNewFolderName('');
        setShowNewFolderDialog(false);
      } catch (err) {
        // Error handled in createFolder
      }
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      try {
        await uploadFiles(files, currentFolder);
      } catch (err) {
        // Error handled in uploadFiles
      }
    }
    event.target.value = '';
  };

  const openRenameDialog = (itemId) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setRenameItemId(itemId);
      setRenameValue(item.name);
      setShowRenameDialog(true);
    }
  };

  const handleRenameItem = async () => {
    if (renameValue.trim() && renameItemId) {
      try {
        await renameItem(renameItemId, renameValue);
        setShowRenameDialog(false);
        setRenameItemId(null);
        setRenameValue('');
      } catch (err) {
        // Error handled in renameItem
      }
    }
  };

  const openMoveDialog = (itemIds) => {
    setItemsToMove(itemIds);
    setMoveDialogCurrentFolder(null);
    setShowMoveDialog(true);
  };

  const getMoveDialogItems = () => {
    return allFolders.filter(folder => 
      folder.parent_id === moveDialogCurrentFolder &&
      !itemsToMove.includes(folder.id) &&
      !isDescendantFolder(folder.id, itemsToMove)
    );
  };

  const isDescendantFolder = (folderId, ancestorIds) => {
    if (ancestorIds.includes(folderId)) return true;
    
    const folder = allFolders.find(f => f.id === folderId);
    if (!folder || !folder.parent_id) return false;
    
    return isDescendantFolder(folder.parent_id, ancestorIds);
  };

  const handleMoveItems = async () => {
    try {
      await moveItems(itemsToMove, moveDialogCurrentFolder);
      setShowMoveDialog(false);
      setItemsToMove([]);
      setSelectedItems([]);
      setLastSelectedItem(null);
    } catch (err) {
      // Error handled in moveItems
    }
  };

  const openPreviewDialog = (item) => {
    if (item.type === 'file' && !item.pending && item.portal_id === currentSelectedPortal) {
      setPreviewFile(item);
      setShowPreviewDialog(true);
    } else if (item.portal_id !== currentSelectedPortal) {
      setError('File access denied');
    }
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return '';
    
    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  };

  const downloadFile = async (file) => {
    try {
      // Verify file belongs to current portal
      if (file.portal_id !== currentSelectedPortal) {
        setError('File access denied');
        return;
      }
      
      setLoadingStates(prev => ({ ...prev, downloading: file.id }));
      
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(file.file_path);
        
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download file');
    } finally {
      setLoadingStates(prev => ({ ...prev, downloading: null }));
    }
  };

  const currentPath = buildFolderPath(currentFolder);
  const currentItems = getCurrentItems();

  if (loadingStates.loading) {
    return (
      <Layout>
        <header className="bg-white border-b px-3 sm:px-6 border-gray-200 py-4 sm:py-5 lg:py-6">
          <div className="flex flex-col">
            {/* icon skeleton  */}
            <div className="flex items-center mb-0 lg:mb-2  ">
              <div className="animate-pulse rounded-sm block lg:hidden h-6 w-6 bg-gray-200 mr-4" />
              <CustomSkeleton className="h-6 w-32" />
            </div>
            <CustomSkeleton className="h-4 w-80 hidden lg:block" />
          </div>
        </header>
         <div className="flex mt-6 items-center justify-center">
            <Loader className="animate-spin" />
            <p className="ml-2">Loading...</p>
          </div>
      </Layout>
    );
  }

  return (
    <Layout>
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
              <h1 className="text-xl font-semibold text-gray-900">My Files</h1>
              
              <nav className="flex items-center space-x-1 text-sm text-gray-600">
                <button
                  onClick={() => navigateToFolder(null)}
                  className="flex items-center hover:text-gray-900 transition-colors"
                >
                  <Home className="w-4 h-4" />
                </button>
                
                {currentPath.map((folder, index) => (
                  <React.Fragment key={folder.id}>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <button
                      onClick={() => navigateToFolder(folder.id)}
                      className="hover:text-gray-900 transition-colors max-w-32 truncate"
                    >
                      {folder.name}
                    </button>
                  </React.Fragment>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={loadingStates.uploading}
              >
                {loadingStates.uploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {loadingStates.uploading ? 'Uploading...' : 'Upload'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowNewFolderDialog(true)}
                disabled={loadingStates.creating}
              >
                {loadingStates.creating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                {loadingStates.creating ? 'Creating...' : 'New folder'}
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {selectedItems.length > 1 && (
        <div className="bg-blue-50 border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 font-medium">
              {selectedItems.length} items selected
            </span>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => openMoveDialog(selectedItems)}
                disabled={loadingStates.moving}
              >
                {loadingStates.moving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Moving...
                  </>
                ) : (
                  'Move'
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => deleteItems(selectedItems)}
                disabled={loadingStates.deleting.some(id => selectedItems.includes(id))}
                className="text-red-600 hover:text-red-700"
              >
                {loadingStates.deleting.some(id => selectedItems.includes(id)) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 py-4" onClick={handleContainerClick}>
        {currentItems.length === 0 ? (
          <div className="text-center py-16">
            <Folder className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">This folder is empty</h3>
            <p className="text-gray-500 mb-6">Get started by uploading files or creating a new folder</p>
            <div className="flex justify-center space-x-3">
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload files
              </Button>
              <Button variant="outline" onClick={() => setShowNewFolderDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New folder
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {currentItems.map(item => {
              const isSelected = selectedItems.includes(item.id);
              const isLastSelected = lastSelectedItem === item.id;
              const isDeleting = loadingStates.deleting.includes(item.id);
              const isRenaming = loadingStates.renaming === item.id;
              const isStarring = loadingStates.starring.includes(item.id);
              const isPending = item.pending;
              
              return (
                <div
                  key={item.id}
                  className={`
                    group flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors
                    ${isSelected ? 'bg-blue-50 hover:bg-blue-100' : ''}
                    ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
                    ${isPending ? 'opacity-70' : ''}
                  `}
                  onClick={(e) => !isDeleting && !isRenaming && !isPending && handleItemClick(item, e)}
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="flex-shrink-0 mr-3">
                      {isPending ? (
                        <div className="flex items-center">
                          {getItemIcon(item)}
                          <Loader2 className="w-3 h-3 ml-1 animate-spin text-gray-400" />
                        </div>
                      ) : isDeleting ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      ) : (
                        getItemIcon(item)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center">
                        <p 
                          className={`text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600 ${isRenaming || isPending ? 'opacity-50' : ''}`}
                          onClick={(e) => !isDeleting && !isRenaming && !isPending && handleItemNameClick(item, e)}
                        >
                          {isRenaming ? (
                            <span className="flex items-center">
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              {item.name}
                            </span>
                          ) : isPending ? (
                            <span className="flex items-center text-gray-600">
                              {item.name}
                              <span className="text-xs ml-2 text-gray-500">Adding...</span>
                            </span>
                          ) : (
                            item.name
                          )}
                        </p>
                        {item.starred && !isPending && (
                          <Star 
                            className={`w-4 h-4 text-yellow-400 ml-2 flex-shrink-0 ${isStarring ? 'animate-pulse' : ''}`} 
                            fill="currentColor" 
                          />
                        )}
                        {isStarring && (
                          <Loader2 className="w-3 h-3 ml-1 animate-spin text-gray-400" />
                        )}
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
                    
                    {!isPending && isLastSelected && selectedItems.length > 0 ? (
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPreviewDialog(item);
                          }}
                          disabled={item.type === 'folder'}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Quick view
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            openShareDialog(item);
                          }}
                        >
                          <Share className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="w-4 h-4 mr-1" />
                              More
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-white">
                            <DropdownMenuItem onClick={() => openMoveDialog([item.id])}>
                             
                             <Move className="w-4 h-4 mr-2" />
                              Move
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => toggleStarItem(item.id)}
                              disabled={isStarring}
                            >
                              <Star className="w-4 h-4 mr-2" />
                              {item.starred ? 'Remove star' : 'Add star'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => downloadFile(item)}
                              disabled={loadingStates.downloading === item.id}
                            >
                              {loadingStates.downloading === item.id ? (
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
                            <DropdownMenuItem 
                              onClick={() => openRenameDialog(item.id)}
                              disabled={isRenaming}
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => deleteItems([item.id])}
                              disabled={isDeleting}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ) : (
                      !isSelected && !isDeleting && !isRenaming && !isPending && (
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
                            <DropdownMenuItem onClick={() => openMoveDialog([item.id])}>
                              <Move className="w-4 h-4 mr-2" />
                              Move
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => toggleStarItem(item.id)}
                              disabled={isStarring}
                            >
                              <Star className="w-4 h-4 mr-2" />
                              {item.starred ? 'Remove star' : 'Add star'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => downloadFile(item)}
                              disabled={loadingStates.downloading === item.id}
                            >
                              {loadingStates.downloading === item.id ? (
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
                            <DropdownMenuItem 
                              onClick={() => openRenameDialog(item.id)}
                              disabled={isRenaming}
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openShareDialog(item)}
                            >
                              <Share className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => deleteItems([item.id])}
                              disabled={isDeleting}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="folderName" className='mb-2'>Folder Name</Label>
              <Input
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowNewFolderDialog(false)}
                disabled={loadingStates.creating}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateFolder} 
                disabled={!newFolderName.trim() || loadingStates.creating}
              >
                {loadingStates.creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Folder'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>
              Move {itemsToMove.length} item{itemsToMove.length > 1 ? 's' : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
              <Home className="w-4 h-4 mr-2" />
              {moveDialogCurrentFolder ? (
                <div className="flex items-center">
                  <span>My Files</span>
                  {buildFolderPath(moveDialogCurrentFolder).map(folder => (
                    <React.Fragment key={folder.id}>
                      <ChevronRight className="w-4 h-4 mx-1" />
                      <span>{folder.name}</span>
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <span>My Files (Root)</span>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto border rounded">
              {moveDialogCurrentFolder && (
                <button
                  className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-50 border-b"
                  onClick={() => {
                    const currentFolder = allFolders.find(folder => folder.id === moveDialogCurrentFolder);
                    setMoveDialogCurrentFolder(currentFolder?.parent_id || null);
                  }}
                >
                  <Folder className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm">.. (Go up)</span>
                </button>
              )}
              
              {getMoveDialogItems().map(folder => (
                <button
                  key={folder.id}
                  className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-50"
                  onClick={() => setMoveDialogCurrentFolder(folder.id)}
                >
                  <Folder className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm">{folder.name}</span>
                </button>
              ))}
              
              {getMoveDialogItems().length === 0 && !moveDialogCurrentFolder && (
                <div className="px-3 py-8 text-center text-gray-500 text-sm">
                  No folders available at root level
                </div>
              )}
              
              {getMoveDialogItems().length === 0 && moveDialogCurrentFolder && (
                <div className="px-3 py-8 text-center text-gray-500 text-sm">
                  No subfolders in this location
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowMoveDialog(false)}
                disabled={loadingStates.moving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleMoveItems} 
                disabled={loadingStates.moving}
              >
                {loadingStates.moving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Moving...
                  </>
                ) : (
                  'Move Here'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Rename Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="renameName">New Name</Label>
              <Input
                id="renameName"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                placeholder="Enter new name"
                onKeyPress={(e) => e.key === 'Enter' && handleRenameItem()}
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowRenameDialog(false)}
                disabled={loadingStates.renaming}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleRenameItem} 
                disabled={!renameValue.trim() || loadingStates.renaming}
              >
                {loadingStates.renaming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Renaming...
                  </>
                ) : (
                  'Rename'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Modal Integration */}
      <ShareModal
        isOpen={showShareDialog}
        onClose={closeShareDialog}
        item={shareItem}
        user={user}
      />
    </div>

    <FileViewer
      file={previewFile}
      fileUrl={previewFile ? getFileUrl(previewFile.file_path) : ''}
      isOpen={showPreviewDialog}
      formatFileSize={formatFileSize}
      downloadFile={downloadFile}
      loadingStates={loadingStates}
      onClose={() => {
        setShowPreviewDialog(false);
        setPreviewFile(null);
      }}
    />
    </Layout>
  );
};

export default Files;