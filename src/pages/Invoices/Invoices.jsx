import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Layout } from '../Dashboard/Layout';
import { useToggle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { usePortalData } from '../../hooks/react-query/usePortalData';
import { supabase } from '../../lib/supabase';

import EmptyStateFeedback from '../../components/EmptyStateFeedback';
import { Banknote, Loader, Search, FileX } from 'lucide-react';

 import BillingTable from './InvoiceTable';
import { Button } from '@/components/ui/button';
import SearchWithFilter from '@/components/SearchWithFilter';
import PageHeader from '@/components/internal/PageHeader';

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

export const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { currentSelectedPortal } = useSelector((state) => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);
  const [isOpen, toggleOpen] = useToggle(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    status: '',
    fromDate: '',
    toDate: '',
    client: null
  });

  console.log({
    invoices
  })
  
  // Configuration
  const ITEMS_PER_PAGE = 20;
  
  // Ref for scroll detection
  const observerRef = useRef();
  
  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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

  const fetchInvoices = async (pageNum = 0, isLoadMore = false, filters = appliedFilters, search = debouncedSearchTerm) => {
    if (!portal) return;

    if (!isLoadMore) {
      if (pageNum === 0 && (search || hasActiveFilters(filters))) {
        setIsFilterLoading(true);
      } else {
        toggleOpen(true);
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
        .select('*, clients(*)', { count: 'exact' })
        .eq('portal_id', portal.id)
        .order('created_at', { ascending: false });

      // Apply filters
      query = buildQueryFilters(query, filters, search);

      // Apply pagination
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching invoices:', error);
      } else {
        const mappedInvoices = data.map((invoice) => {
          const { clients, ...rest } = invoice;
          return {
            ...rest,
            client: clients,
          };
        });

        if (isLoadMore) {
          setInvoices(prev => [...prev, ...mappedInvoices]);
        } else {
          setInvoices(mappedInvoices);
        }

        // Check if there are more items to load
        const totalFetched = (pageNum + 1) * ITEMS_PER_PAGE;
        setHasMore(totalFetched < count);
      }
    } catch (error) {
      console.error('Unexpected error fetching invoices:', error);
    }

    if (!isLoadMore) {
      if (pageNum === 0 && (search || hasActiveFilters(filters))) {
        setIsFilterLoading(false);
      } else {
        toggleOpen(false);
      }
    } else {
      setIsLoadingMore(false);
    }
  };

  // Helper function to check if filters are active
  const hasActiveFilters = (filters) => {
    return filters.status || 
           filters.fromDate || 
           filters.toDate || 
           filters.client;
  };

  const loadMoreInvoices = useCallback(() => {
    if (!isLoadingMore && hasMore && !isFilterLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchInvoices(nextPage, true);
    }
  }, [page, isLoadingMore, hasMore, portal, appliedFilters, debouncedSearchTerm, isFilterLoading]);

  // Intersection Observer for infinite scroll
  const lastInvoiceElementRef = useCallback((node) => {
    if (isLoadingMore || isFilterLoading) return;
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
  }, [isLoadingMore, hasMore, loadMoreInvoices, isFilterLoading]);

  // Handle search term changes (debounced)
  useEffect(() => {
    if (!portal) return;
    
    // Reset pagination and refetch when search changes
    setPage(0);
    setHasMore(true);
    fetchInvoices(0, false, appliedFilters, debouncedSearchTerm);
  }, [debouncedSearchTerm, portal]);

  // Handle filter applications
  const handleApplyFilters = (newFilters) => {
    setAppliedFilters(newFilters);
    
    // Reset pagination and fetch with new filters
    setPage(0);
    setHasMore(true);
    fetchInvoices(0, false, newFilters, debouncedSearchTerm);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    const resetFilters = {
      status: '',
      fromDate: '',
      toDate: '',
      client: null
    };
    setAppliedFilters(resetFilters);
    setSearchTerm(''); // Also reset search term
    
    // Reset pagination and fetch all data
    setPage(0);
    setHasMore(true);
    fetchInvoices(0, false, resetFilters, ''); // Pass empty search term
  };

  useEffect(() => {
    if (!portal) return;

    // Reset state when portal changes
    setInvoices([]);
    setPage(0);
    setHasMore(true);
    setSearchTerm('');
    setAppliedFilters({
      status: '',
      fromDate: '',
      toDate: '',
      client: null
    });
    
    // Fetch initial invoices
    fetchInvoices(0, false, {
      status: '',
      fromDate: '',
      toDate: '',
      client: null
    }, '');

    // Set up real-time subscription
    const subscription = supabase
      .channel(`invoices:portal_id=eq.${portal.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'invoices',
          filter: `portal_id=eq.${portal.id}`,
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
          filter: `portal_id=eq.${portal.id}`,
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
          filter: `portal_id=eq.${portal.id}`,
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
  }, [portal]);

  // Check if we have any data loaded (not initial loading)
  const hasLoadedData = !isOpen || invoices.length > 0 || isFilterLoading;
  const isFiltered = hasActiveFilters(appliedFilters) || debouncedSearchTerm;

  return (
    <Layout hideMobileNav headerName="Invoices">
      <PageHeader
        title="Billing"
        description="Manage your invoices and payment settings"
        action={
          <Button
            onClick={() => navigate('/billing/new')}
            className="bg-black hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Create Invoice
          </Button>
        }
      />
   
      <div className="p-0">
        {/* Search and Filter Component - Show when data is loaded or when filtering */}
        {hasLoadedData && (
          <SearchWithFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            appliedFilters={appliedFilters}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
            currentPortal={currentSelectedPortal}
            isFilterLoading={isFilterLoading}
          />
        )}

        {/* Loading state for initial load */}
        {isOpen && !invoices.length && !isFiltered && (
          <div className="flex justify-center items-center mt-8">
            <Loader className='animate-spin' />
            <p className="ml-2">Loading...</p>
          </div>
        )}

        {/* Filter loading state */}
        {isFilterLoading && (
          <div className="flex justify-center items-center mt-8">
            <Loader className='animate-spin' />
            <p className="ml-2">Applying filters...</p>
          </div>
        )}

        {/* Empty state */}
        {!invoices.length && !isOpen && !isFilterLoading && (
          <div className="mt-16">
            <EmptyStateFeedback
              IconComponent={isFiltered ? FileX : Banknote}
              title={isFiltered ? "No invoices found" : "Create Your First Invoice"}
              message={
                isFiltered 
                  ? "No invoices match your current filters. Try adjusting your search criteria." 
                  : "It looks like you haven't created any invoices yet. Click the button below to create your first invoice."
              }
              centered
            />
          </div>
        )}

        {/* Invoices table */}
        {invoices.length > 0 && (
          <div className={`transition-opacity duration-200 ${isLoadingMore ? 'opacity-75' : 'opacity-100'}`}>
            <BillingTable
              portal={portal}
              invoices={invoices}
              stripe_connect_account_id={portal?.stripe_connect_account_id}
              lastInvoiceElementRef={lastInvoiceElementRef}
              isLoadingMore={isLoadingMore}
            />
          </div>
        )}
            
        {/* End of results indicator */}
        { !hasMore && invoices.length > 0 && page > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 py-6 px-6">
            <div className="flex justify-center items-center">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-600">
                  {isFiltered 
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
    </Layout>
  );
};