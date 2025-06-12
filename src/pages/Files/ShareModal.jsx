import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  X, 
  Check, 
  Loader2, 
  UserPlus, 
  Mail,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Building
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ShareModal = ({ 
  isOpen, 
  onClose, 
  item, 
  user 
}) => {
  const { currentSelectedPortal } = useSelector(state => state.auth);
  
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [existingShares, setExistingShares] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && item && currentSelectedPortal) {
      loadClients();
      loadExistingShares();
    } else {
      // Reset state when modal closes
      setClients([]);
      setSelectedClients([]);
      setExistingShares([]);
      setSearchTerm('');
      setError(null);
    }
  }, [isOpen, item, currentSelectedPortal]);

  const loadClients = async () => {
    try {
      setLoadingClients(true);
      
      // Fetch clients from the current portal only
      const { data, error } = await supabase
        .from('clients')
        .select('id, email, name,  portal_id')
        .eq('portal_id', currentSelectedPortal)
        .order('name');

      if (error) throw error;

      setClients(data || []);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError('Failed to load clients');
    } finally {
      setLoadingClients(false);
    }
  };

  const loadExistingShares = async () => {
    if (!item?.id || !currentSelectedPortal) return;

    try {
      // Get existing shares for this item in the current portal
      const { data, error } = await supabase
        .from('file_shares')
        .select(`
          id,
          shared_client_id,
          created_at,
          portal_id,
          clients!shared_client_id (
            id,
            email,
            name,
            
            portal_id
          )
        `)
        .eq('item_id', item.id)
        .eq('portal_id', currentSelectedPortal);

      if (error) throw error;

      setExistingShares(data || []);
    } catch (err) {
      console.error('Error loading existing shares:', err);
      setError('Failed to load existing shares');
    }
  };

  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClientSelect = (client) => {
    setSelectedClients(prev => {
      const isSelected = prev.find(c => c.id === client.id);
      if (isSelected) {
        return prev.filter(c => c.id !== client.id);
      } else {
        return [...prev, client];
      }
    });
  };

  const handleShare = async () => {
    if (selectedClients.length === 0 || !currentSelectedPortal) return;

    try {
      setSharing(true);
      setError(null);

      // Create shares for selected clients in the current portal
      const shares = selectedClients.map(client => ({
        item_id: item.id,
        shared_client_id: client.id,
        shared_by: user.id,
        portal_id: currentSelectedPortal,
        shared_with_email: client.email,
       }));

      const { error } = await supabase
        .from('file_shares')
        .insert(shares);

      if (error) throw error;

      // Reload existing shares to show the new ones
      await loadExistingShares();
      
      // Clear selected clients
      setSelectedClients([]);
      
      // Optional: Show success message
      console.log('Items shared successfully');
      
    } catch (err) {
      console.error('Error sharing item:', err);
      if (err.code === '23505') {
        setError('Some clients already have access to this item');
      } else {
        setError('Failed to share item');
      }
    } finally {
      setSharing(false);
    }
  };

  const handleRemoveShare = async (shareId) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('file_shares')
        .delete()
        .eq('id', shareId);

      if (error) throw error;

      // Reload existing shares
      await loadExistingShares();
      
    } catch (err) {
      console.error('Error removing share:', err);
      setError('Failed to remove share');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!item || !currentSelectedPortal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Share "{item.name}"
            <div className="flex items-center ml-4 text-sm text-gray-500">
              <Building className="w-4 h-4 mr-1" />
              {currentSelectedPortal.name}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Portal Info */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="flex items-center">
              <Building className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm text-blue-700">
                Sharing within <strong>{currentSelectedPortal.name}</strong> portal
              </span>
            </div>
          </div>

          {/* Existing Shares */}
          {existingShares.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Shared with ({existingShares.length} {existingShares.length === 1 ? 'client' : 'clients'})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {existingShares.map(share => (
                  <div key={share.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                        {getInitials(share.clients?.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {share.clients?.name || 'Unknown Client'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {share.clients?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        Can view
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveShare(share.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Clients */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Add clients from {currentSelectedPortal.name}
            </h3>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search clients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Selected Clients */}
            {selectedClients.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Selected ({selectedClients.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {selectedClients.map(client => (
                    <Badge key={client.id} variant="secondary" className="flex items-center">
                      {client.name || client.email}
                      <button
                        onClick={() => handleClientSelect(client)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Client List */}
            <div className="border rounded-lg max-h-64 overflow-y-auto">
              {loadingClients ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Loading clients...</p>
                </div>
              ) : filteredClients.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">
                    {searchTerm ? 'No clients found' : `No clients available in ${currentSelectedPortal.name}`}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredClients.map(client => {
                    const isSelected = selectedClients.find(c => c.id === client.id);
                    const hasAccess = existingShares.find(s => s.shared_client_id === client.id);
                    
                    return (
                      <div
                        key={client.id}
                        className={`
                          flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition-colors
                          ${isSelected ? 'bg-blue-50' : ''}
                          ${hasAccess ? 'opacity-50' : ''}
                        `}
                        onClick={() => !hasAccess && handleClientSelect(client)}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                            {getInitials(client.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {client.name || 'Unknown Client'}
                            </p>
                            <p className="text-xs text-gray-500">{client.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {hasAccess ? (
                            <Badge variant="outline" className="text-xs">
                              Has access
                            </Badge>
                          ) : isSelected ? (
                            <Check className="w-4 h-4 text-blue-600" />
                          ) : (
                            <UserPlus className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Share Info */}
          {item.type === 'folder' && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <div className="flex">
                <AlertCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Folder sharing</p>
                  <p>When you share a folder, clients will have access to all files and subfolders inside it.</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={sharing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleShare}
              disabled={selectedClients.length === 0 || sharing}
              className='bg-black text-white'
            >
              {sharing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Share with {selectedClients.length} {selectedClients.length === 1 ? 'client' : 'clients'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;