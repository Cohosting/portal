import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useClientAuth } from '@/hooks/useClientAuth';
import { useClientPortalData } from '@/hooks/react-query/usePortalData';
import BillingActivity from '@/components/BillingActvity/BillingActivity';
import BillingActivityTabs from '@/components/BillingActvity/BillingActivityTabs';
import { useInvoiceCounts } from '@/hooks/react-query/useInvoice';
import DateRangeSelector from '@/components/DateRangeSelector/DateRangeSelector';
import PageHeader from '@/components/internal/PageHeader';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { debounce } from '@/utils';
import { supabase } from '@/lib/supabase';
import { DateTime } from 'luxon';
import { useDomainInfo } from '@/hooks/useDomainInfo';

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
  const [tabs, setTabs] = useState([
    { name: 'All', count: 0 },
    { name: 'Open', count: 0 },
    { name: 'Paid', count: 0 },
    { name: 'Processing', count: 0 }
  ]);

  const [filters, setFilters] = useState({
    status: 'all',
    searchInvoiceId: '',
    startDate: '',
    endDate: ''
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
  const debouncedSearchId = useDebounce(filters.searchInvoiceId, 400);

  const { data: invoiceCount, isLoading: isCountLoading } = useInvoiceCounts({
    portal_id: portal?.id,
    client_id: clientUser?.id
  });

  // Build query filters
  const buildQueryFilters = (query, currentFilters, searchId) => {
    let filteredQuery = query;

    // Apply search filter
    if (searchId && searchId.trim()) {
      filteredQuery = filteredQuery.ilike('invoice_number', `%${searchId.trim()}%`);
    }

    // Apply status filter
    if (currentFilters.status && currentFilters.status !== 'all') {
      filteredQuery = filteredQuery.eq('status', currentFilters.status);
    }

    // Apply date range filter
    if (currentFilters.startDate) {
      const formattedStartDate = DateTime.fromISO(currentFilters.startDate).startOf("day").toISO();
      filteredQuery = filteredQuery.gte("created_at", formattedStartDate);
    }

    if (currentFilters.endDate) {
      const formattedEndDate = DateTime.fromISO(currentFilters.endDate).endOf("day").toISO();
      filteredQuery = filteredQuery.lte("created_at", formattedEndDate);
    }

    return filteredQuery;
  };

  const fetchInvoices = async (pageNum = 0, isLoadMore = false, currentFilters = filters, searchId = debouncedSearchId) => {
    if (!portal?.id || !clientUser?.id) return;

    if (!isLoadMore) {
      if (pageNum === 0 && (searchId || hasActiveFilters(currentFilters))) {
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

      // Apply filters
      query = buildQueryFilters(query, currentFilters, searchId);

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

        // Check if there are more items to load
        const totalFetched = (pageNum + 1) * ITEMS_PER_PAGE;
        setHasMore(totalFetched < count);
      }
    } catch (error) {
      console.error('Unexpected error fetching invoices:', error);
    }

    if (!isLoadMore) {
      if (pageNum === 0 && (searchId || hasActiveFilters(currentFilters))) {
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
    return currentFilters.status !== 'all' || 
           currentFilters.startDate || 
           currentFilters.endDate;
  };

  const loadMoreInvoices = useCallback(() => {
    if (!isLoadingMore && hasMore && !isFilterLoading && !isInitialLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchInvoices(nextPage, true);
    }
  }, [page, isLoadingMore, hasMore, portal, clientUser, filters, debouncedSearchId, isFilterLoading, isInitialLoading]);

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

  // Update tabs based on current invoices
  useEffect(() => {
    const newCounts = [
      { name: 'All', count: invoices.length },
      { name: 'Open', count: invoices.filter(inv => inv.status === 'open').length },
      { name: 'Paid', count: invoices.filter(inv => inv.status === 'paid').length },
      { name: 'Processing', count: invoices.filter(inv => inv.status === 'processing').length }
    ];

    const isSame =
      newCounts.length === tabs.length &&
      newCounts.every((nc, idx) => nc.name === tabs[idx].name && nc.count === tabs[idx].count);

    if (!isSame) {
      setTabs(newCounts);
    }
  }, [invoices, tabs]);

  // Filter invoices based on status
  const filteredInvoices = useMemo(() => {
    if (filters.status === 'all') {
      return invoices;
    }
    return invoices.filter(inv => inv.status === filters.status);
  }, [invoices, filters.status]);

  // Handle search term changes (debounced)
  useEffect(() => {
    if (!portal?.id || !clientUser?.id) return;
    
    // Reset pagination and refetch when search changes
    setPage(0);
    setHasMore(true);
    fetchInvoices(0, false, filters, debouncedSearchId);
  }, [debouncedSearchId, portal?.id, clientUser?.id]);

  // Initial load and portal/client changes
  useEffect(() => {
    if (!portal?.id || !clientUser?.id) return;

    // Reset state when portal/client changes
    setInvoices([]);
    setPage(0);
    setHasMore(true);
    setFilters({
      status: 'all',
      searchInvoiceId: '',
      startDate: '',
      endDate: ''
    });
    
    // Fetch initial invoices
    fetchInvoices(0, false, {
      status: 'all',
      searchInvoiceId: '',
      startDate: '',
      endDate: ''
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
          fetchInvoices(0, false, filters, debouncedSearchId);
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
          fetchInvoices(0, false, filters, debouncedSearchId);
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
          fetchInvoices(0, false, filters, debouncedSearchId);
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

  const onDateRangeChange = (start, end) => {
    const newFilters = { ...filters, startDate: start, endDate: end };
    setFilters(newFilters);
    
    // Reset pagination and fetch with new filters
    setPage(0);
    setHasMore(true);
    fetchInvoices(0, false, newFilters, debouncedSearchId);
  };

  const onTabChange = tab => {
    const newFilters = { ...filters, status: tab.name.toLowerCase() };
    setFilters(newFilters);
    
    // Reset pagination and fetch with new filters
    setPage(0);
    setHasMore(true);
    fetchInvoices(0, false, newFilters, debouncedSearchId);
  };

  const onSearchChange = e => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, searchInvoiceId: value }));
  };

  const isLoading = isInitialLoading || isFilterLoading;

  return (
    <div className="h-screen">
      <PageHeader
        title="Client Billing Activity"
        description="Review recent billing activities for your clients. Track invoice payments, due dates, and outstanding balances to ensure timely follow-ups."
        showSidebar={true}
      />

      <div className="flex items-center mt-4 px-3 sm:px-6">
        <div className="w-[300px]">
          <Label className="text-sm font-medium mb-2">Search Invoice ID</Label>
          <Input
            label="Search Invoice ID"
            placeholder="Search Invoice by ID (e.g., #1234)"
            value={filters.searchInvoiceId}
            onChange={onSearchChange}
          />
        </div>
      </div>

      <BillingActivityTabs
        tabs={tabs}
        onTabChange={onTabChange}
        colorSettings={portal?.brand_settings}
      />

      <DateRangeSelector
        onDateRangeChange={onDateRangeChange}
        startDate={filters.startDate}
        endDate={filters.endDate}
        colorSettings={portal?.brand_settings}
      />

      <BillingActivity
        colorSettings={portal?.brand_settings}
        isLoading={isLoading}
        invoices={filteredInvoices}
        lastInvoiceElementRef={lastInvoiceElementRef}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
      />
      
      {/* End of results indicator */}
      {!hasMore && invoices.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 py-6 px-6">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600">
                {hasActiveFilters(filters) || debouncedSearchId 
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