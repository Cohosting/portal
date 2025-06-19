import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useDomainInfo } from '../../../hooks/useDomainInfo';
import { useClientAuth } from '../../../hooks/useClientAuth';
import { useClientPortalData } from '../../../hooks/react-query/usePortalData';
import BillingActivity from '../../../components/BillingActvity/BillingActivity';
 import PageHeader from './components/PageHeader';
import { supabase } from '../../../lib/supabase';
import SearchWithFilter from '@/components/SearchWithFilter';
import { defaultBrandSettings, deriveColors, getComputedColors } from '@/utils/colorUtils';
 
// Custom hook for debounced value
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ClientBillingActivity = () => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    fromDate: '',
    toDate: '',
    client: null
  });

  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: '',
    status: '',
    fromDate: '',
    toDate: '',
    client: null
  });

  // Infinite scroll states
  const [invoices, setInvoices] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Configuration
  const ITEMS_PER_PAGE = 20;

  // Ref for scroll detection
  const observerRef = useRef();

  const { domain } = useDomainInfo();
  const { data: portal } = useClientPortalData(domain);
  const { clientUser } = useClientAuth(portal?.id);

  // Debounce search term
  const debouncedSearchTerm = useDebounce(appliedFilters.searchTerm, 400);

  // Build query filters
  const buildQueryFilters = (query, filters, search) => {
    let filteredQuery = query;

    // Apply search filter (invoice number starts with)
    if (search && search.trim()) {
      filteredQuery = filteredQuery.ilike('invoice_number', `${search.trim()}%`);
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filteredQuery = filteredQuery.eq('status', filters.status.toLowerCase());
    }

    // Apply client filter
    if (filters.client && filters.client.id) {
      filteredQuery = filteredQuery.eq('client_id', filters.client.id);
    }

    // Apply date range filter (due_date)
    if (filters.fromDate) {
      // Convert to ISO string for comparison, considering timezone
      const fromDate = new Date(filters.fromDate);
      fromDate.setHours(0, 0, 0, 0); // Start of day
      filteredQuery = filteredQuery.gte('due_date', fromDate.toISOString());
    }

    if (filters.toDate) {
      // Convert to ISO string for comparison, considering timezone
      const toDate = new Date(filters.toDate);
      toDate.setHours(23, 59, 59, 999); // End of day
      filteredQuery = filteredQuery.lte('due_date', toDate.toISOString());
    }

    return filteredQuery;
  };

  const fetchInvoices = async (pageNum = 0, isLoadMore = false, currentFilters = appliedFilters, searchTerm = debouncedSearchTerm) => {
    if (!portal?.id || !clientUser?.id) return;

    if (!isLoadMore) {
      if (pageNum === 0 && (searchTerm || hasActiveFilters(currentFilters))) {
        setIsFilterLoading(true);
      } else {
        setIsInitialLoading(true);
      }
    } else {
      setIsLoadingMore(true);
    }

    const from = pageNum * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    try {
      // Base query
      let query = supabase
        .from('invoices')
        .select('*', { count: 'exact' })
        .eq('portal_id', portal.id)
        .eq('client_id', clientUser.id)
        .neq('status', 'draft')
        .order('created_at', { ascending: false });

      // Apply filters using the updated function signature
      query = buildQueryFilters(query, currentFilters, searchTerm);

      // Apply pagination
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching invoices:', error);
      } else {
        if (isLoadMore) {
          setInvoices(prev => [...prev, ...data]);
        } else {
          setInvoices(data);
        }

        // FIXED: Check if there are more items to load based on actual data
        const totalItemsFetched = isLoadMore ? invoices.length + data.length : data.length;
        setHasMore(totalItemsFetched < count);
      }
    } catch (error) {
      console.error('Unexpected error fetching invoices:', error);
    }

    if (!isLoadMore) {
      if (pageNum === 0 && (searchTerm || hasActiveFilters(currentFilters))) {
        setIsFilterLoading(false);
      } else {
        setIsInitialLoading(false);
      }
    } else {
      setIsLoadingMore(false);
    }
  };

  // Helper function to check if filters are active
  const hasActiveFilters = (currentFilters) => {
    return (currentFilters.status && currentFilters.status !== '' && currentFilters.status !== 'all') || 
           currentFilters.fromDate || 
           currentFilters.toDate ||
           (currentFilters.client && currentFilters.client.id);
  };

  const loadMoreInvoices = useCallback(() => {
    if (!isLoadingMore && hasMore && !isFilterLoading && !isInitialLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchInvoices(nextPage, true);
    }
  }, [page, isLoadingMore, hasMore, portal, clientUser, appliedFilters, debouncedSearchTerm, isFilterLoading, isInitialLoading]);

  // Intersection Observer for infinite scroll
  const lastInvoiceElementRef = useCallback((node) => {
    if (isLoadingMore || isFilterLoading || isInitialLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreInvoices();
      }
    }, {
      threshold: 1.0,
      rootMargin: '50px'
    });
    
    if (node) observerRef.current.observe(node);
  }, [isLoadingMore, hasMore, loadMoreInvoices, isFilterLoading, isInitialLoading]);

  // Handle search term changes (debounced)
  useEffect(() => {
    if (!portal?.id || !clientUser?.id) return;
    
    // Reset pagination and refetch when search changes
    setPage(0);
    setHasMore(true);
    fetchInvoices(0, false, appliedFilters, debouncedSearchTerm);
  }, [debouncedSearchTerm, portal?.id, clientUser?.id]);

  // Initial load and portal/client changes
  useEffect(() => {
    if (!portal?.id || !clientUser?.id) return;

    // Reset state when portal/client changes
    setInvoices([]);
    setPage(0);
    setHasMore(true);
    setFilters({
      searchTerm: '',
      status: '',
      fromDate: '',
      toDate: '',
      client: null
    });
    setAppliedFilters({
      searchTerm: '',
      status: '',
      fromDate: '',
      toDate: '',
      client: null
    });
    
    // Fetch initial invoices
    fetchInvoices(0, false, {
      searchTerm: '',
      status: '',
      fromDate: '',
      toDate: '',
      client: null
    }, '');

    // Set up real-time subscription
    const subscription = supabase
      .channel(`client-invoices:portal_id=eq.${portal.id}:client_id=eq.${clientUser.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'invoices',
          filter: `portal_id=eq.${portal.id},client_id=eq.${clientUser.id}`,
        },
        () => {
          // Reset and refetch when new invoice is added
          setInvoices([]);
          setPage(0);
          setHasMore(true);
          fetchInvoices(0, false, appliedFilters, debouncedSearchTerm);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'invoices',
          filter: `portal_id=eq.${portal.id},client_id=eq.${clientUser.id}`,
        },
        () => {
          // Reset and refetch when invoice is updated
          setInvoices([]);
          setPage(0);
          setHasMore(true);
          fetchInvoices(0, false, appliedFilters, debouncedSearchTerm);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'invoices',
          filter: `portal_id=eq.${portal.id},client_id=eq.${clientUser.id}`,
        },
        () => {
          // Reset and refetch when invoice is deleted
          setInvoices([]);
          setPage(0);
          setHasMore(true);
          fetchInvoices(0, false, appliedFilters, debouncedSearchTerm);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [portal?.id, clientUser?.id]);

  // Handle search change
  const handleSearchChange = (searchTerm) => {
    setFilters(prev => ({ ...prev, searchTerm }));
    setAppliedFilters(prev => ({ ...prev, searchTerm }));
  };

  // Handle apply filters
  const handleApplyFilters = (newFilters) => {
    setAppliedFilters(prev => ({
      ...prev,
      ...newFilters,
      searchTerm: filters.searchTerm // Keep current search term
    }));
    
    // Reset pagination and fetch with new filters
    setPage(0);
    setHasMore(true);
    fetchInvoices(0, false, {
      ...newFilters,
      searchTerm: filters.searchTerm
    }, debouncedSearchTerm);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    const resetFilters = {
      searchTerm: '',
      status: '',
      fromDate: '',
      toDate: '',
      client: null
    };
    
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    
    // Reset pagination and fetch with reset filters
    setPage(0);
    setHasMore(true);
    fetchInvoices(0, false, resetFilters, '');
  };

  const isLoading = isInitialLoading || isFilterLoading;

  const brandSettings = portal?.brand_settings || defaultBrandSettings;
  const computedColors = useMemo(() => {
    return brandSettings.showAdvancedOptions 
      ? getComputedColors(brandSettings)     // Use advanced colors
      : deriveColors(brandSettings.baseColors); // Ignore advanced colors completely
  }, [brandSettings]);

  return (
    <div className="h-screen">
      <PageHeader
        title="Client Billing Activity"
        description="Review recent billing activities for your clients. Track invoice payments, due dates, and outstanding balances to ensure timely follow-ups."
        showSidebar={true}
      />

      <SearchWithFilter
        searchTerm={filters.searchTerm}
        onSearchChange={handleSearchChange}
        appliedFilters={appliedFilters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        currentPortal={portal?.id}
        isFilterLoading={isFilterLoading}
        colorSettings={computedColors}
      />

      <BillingActivity
        colorSettings={computedColors}
        isLoading={isLoading}
        invoices={invoices}
        lastInvoiceElementRef={lastInvoiceElementRef}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
      />
      
      {/* End of results indicator - Only show if we actually loaded more than one page */}
      {!hasMore && invoices.length > 0 && invoices.length >= ITEMS_PER_PAGE && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 py-6 px-6">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600">
                {hasActiveFilters(appliedFilters) || debouncedSearchTerm 
                  ? "All matching invoices loaded" 
                  : "All invoices loaded"
                }
              </p>
              <p className="text-xs text-gray-500 mt-1">{invoices.length} total invoices</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientBillingActivity;