import React, { useState, useEffect } from 'react';
import { Search, Filter, X, RotateCcw, ChevronsUpDown, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-toastify';

export default function SearchWithFilter({
  searchTerm,
  onSearchChange,
  appliedFilters,
  onApplyFilters,
  onResetFilters,
  currentPortal,
  isFilterLoading
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientsData, setClientsData] = useState([]);
  const [filteredClientsData, setFilteredClientsData] = useState([]);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isClientPopoverOpen, setIsClientPopoverOpen] = useState(false);

  // Sync local state with applied filters
  useEffect(() => {
    setSelectedStatus(appliedFilters.status || '');
    setFromDate(appliedFilters.fromDate || '');
    setToDate(appliedFilters.toDate || '');
    setSelectedClient(appliedFilters.client || null);
  }, [appliedFilters]);

  // Fetch clients function
  const fetchClients = async () => {
    setIsLoadingClients(true);
    
    try {
      const { data: clients, error } = await supabase
        .from('clients')
        .select('id, name, email')
        .eq('portal_id', currentPortal)
        .order('name');
        
      if (error) {
        console.error('Error fetching clients:', error);
        toast.error('Failed to load clients');
        setClientsData([]);
        setFilteredClientsData([]);
      } else {
        setClientsData(clients || []);
        setFilteredClientsData(clients || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Failed to load clients');
      setClientsData([]);
      setFilteredClientsData([]);
    }
    
    setIsLoadingClients(false);
  };

  // Filter clients based on search
  const filterClients = (searchValue) => {
    if (!searchValue.trim()) {
      setFilteredClientsData(clientsData);
      return;
    }

    const filtered = clientsData.filter(client => 
      client.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      client.email.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredClientsData(filtered);
  };

  // Handle client search
  const handleClientSearch = (e) => {
    const value = e.target.value;
    setClientSearchTerm(value);
    filterClients(value);
  };

  const handleClientPopoverOpen = (open) => {
    setIsClientPopoverOpen(open);
    if (open && clientsData.length === 0) {
      fetchClients();
    }
    // Reset search when closing
    if (!open) {
      setClientSearchTerm('');
      setFilteredClientsData(clientsData);
    }
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setIsClientPopoverOpen(false);
    setClientSearchTerm('');
  };

  const statusOptions = [
    { value: '', label: 'Select status...' },
    { value: 'all', label: 'All' },
    { value: 'draft', label: "Draft" },
    { value: 'open', label: 'Open' },
    { value: 'paid', label: 'Paid' },
    { value: 'processing', label: 'Processing' },
    { value: 'void', label: 'Void' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleStatusReset = () => {
    setSelectedStatus('');
  };

  const handleDateReset = () => {
    setFromDate('');
    setToDate('');
  };

  const handleClientReset = () => {
    setSelectedClient(null);
  };

  const handleApply = () => {
    const newAppliedFilters = {
      status: selectedStatus,
      fromDate,
      toDate,
      client: selectedClient
    };
    onApplyFilters(newAppliedFilters);
    setIsFilterOpen(false);
  };

  const handleResetAll = () => {
    setSelectedStatus('');
    setFromDate('');
    setToDate('');
    setSelectedClient(null);
    setClientSearchTerm('');
    // Also clear the search term
    onSearchChange('');
    onResetFilters();
  };

  // Count active filters
  const activeFilterCount = Object.values(appliedFilters).filter(value => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'object') return value !== null;
    return Boolean(value);
  }).length;

  return (
    <div className="bg-background">
      <div className="max-w-4xl p-6 pb-0">
        
        {/* Search and Filter Container */}
        <div className="relative">
          <div className="flex gap-2 mb-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search by invoice number…"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isFilterLoading}
              />
              <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                ⌘K
              </kbd>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              disabled={isFilterLoading}
              className={`inline-flex items-center justify-center cursor-pointer rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2 relative ${
                activeFilterCount > 0 ? 'border-black bg-black/5' : ''
              }`}
            >
              {isFilterLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Filter className="h-4 w-4" />
              )}
              Filter
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div className="absolute top-full bg-white right-0 z-50 w-96 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-sm">Filter</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Due Date Range</label>
                  <button
                    onClick={handleDateReset}
                    className="text-xs text-primary hover:underline"
                  >
                    Reset
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">From</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">To</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Client Filter */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Client</label>
                  <button
                    onClick={handleClientReset}
                    className="text-xs text-primary hover:underline"
                  >
                    Reset
                  </button>
                </div>
                
                {/* Client Popover */}
                <div className="relative">
                  <button
                    onClick={() => handleClientPopoverOpen(!isClientPopoverOpen)}
                    className="flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className={selectedClient ? "" : "text-muted-foreground"}>
                      {selectedClient
                        ? `${selectedClient.name} (${selectedClient.email})`
                        : "Select client"}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </button>

                  {/* Dropdown */}
                  {isClientPopoverOpen && (
                    <div className="absolute bg-white top-full left-0 z-50 w-full mt-1 rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none">
                      {/* Search Input */}
                      <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                          value={clientSearchTerm}
                          onChange={handleClientSearch}
                          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Search clients with email"
                        />
                      </div>

                      {/* Loading State */}
                      {isLoadingClients ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="ml-2 text-sm text-muted-foreground">Loading clients...</span>
                        </div>
                      ) : (
                        <div className="max-h-72 overflow-auto">
                          {filteredClientsData.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                              {clientSearchTerm ? 'No clients found matching your search.' : 'No clients found.'}
                            </div>
                          ) : (
                            <div className="p-1">
                              {filteredClientsData.map((client) => (
                                <div
                                  key={client.id}
                                  onClick={() => handleSelectClient(client)}
                                  className="relative hover:bg-gray-100 flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                >
                                  <div className="flex flex-col flex-1">
                                    <span className="font-medium">{client.name}</span>
                                    <span className="text-sm text-muted-foreground">{client.email}</span>
                                  </div>
                                  <Check
                                    className={`ml-auto h-4 w-4 ${
                                      selectedClient?.id === client.id ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Status</label>
                  <button
                    onClick={handleStatusReset}
                    className="text-xs text-primary hover:underline"
                  >
                    Reset
                  </button>
                </div>
                
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* Status Indicator */}
                {selectedStatus === 'cancelled' && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Cancelled
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t">
                <button
                  onClick={handleResetAll}
                  disabled={isFilterLoading}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset All
                </button>
                
                <button
                  onClick={handleApply}
                  disabled={isFilterLoading}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                >
                  {isFilterLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Applying...
                    </>
                  ) : (
                    "Apply Now"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Indicator */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="font-medium">{activeFilterCount}</span>
              <span>filter{activeFilterCount > 1 ? 's' : ''} applied</span>
            </div>
            <button
              onClick={handleResetAll}
              disabled={isFilterLoading}
              className="text-xs text-primary hover:underline disabled:opacity-50"
            >
              Clear all
            </button>
          </div>
        )}
 
      </div>
    </div>
  );
}