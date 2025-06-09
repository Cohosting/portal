import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Layout } from '../Dashboard/Layout';
import { useToggle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { usePortalData } from '../../hooks/react-query/usePortalData';
import { supabase } from '../../lib/supabase';

import EmptyStateFeedback from '../../components/EmptyStateFeedback';
import { Banknote, Loader } from 'lucide-react';

import PageHeader from '@/components/internal/PageHeader';
import BillingTable from './InvoiceTable';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
 
export const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { currentSelectedPortal } = useSelector((state) => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);
  const [isOpen, toggleOpen] = useToggle(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Configuration
  const ITEMS_PER_PAGE = 20;
  
  // Ref for scroll detection
  const observerRef = useRef();

  const fetchInvoices = async (pageNum = 0, isLoadMore = false) => {
    if (!portal) return;

    if (!isLoadMore) {
      toggleOpen(true);
    } else {
      setIsLoadingMore(true);
    }

    const from = pageNum * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error, count } = await supabase
      .from('invoices')
      .select('*, clients(*)', { count: 'exact' })
      .eq('portal_id', portal.id)
      .order('created_at', { ascending: false })
      .range(from, to);

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

    if (!isLoadMore) {
      toggleOpen(false);
    } else {
      setIsLoadingMore(false);
    }
  };

  const loadMoreInvoices = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchInvoices(nextPage, true);
    }
  }, [page, isLoadingMore, hasMore, portal]);

  // Intersection Observer for infinite scroll
  const lastInvoiceElementRef = useCallback((node) => {
    if (isLoadingMore) return;
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
  }, [isLoadingMore, hasMore, loadMoreInvoices]);

  useEffect(() => {
    if (!portal) return;

    // Reset state when portal changes
    setInvoices([]);
    setPage(0);
    setHasMore(true);
    
    // Fetch initial invoices
    fetchInvoices(0, false);

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
          fetchInvoices(0, false);
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
          fetchInvoices(0, false);
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
          fetchInvoices(0, false);
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
        {isOpen && !invoices.length && (
          <div className="flex justify-center items-center mt-8">
            <Loader className='animate-spin' />
            <p className="ml-2">Loading...</p>
          </div>
        )}

        {!invoices.length && !isOpen && (
          <div className="mt-16">
            <EmptyStateFeedback
              IconComponent={Banknote}
              title="Create Your First Invoice"
              message="It looks like you haven't created any invoices yet. Click the button below to create your first invoice."
              centered
            />
          </div>
        )}

        {invoices.length > 0 && (
          <div className={`transition-opacity duration-200 ${isLoadingMore ? 'opacity-75' : 'opacity-100'}`}>
 
            <BillingTable
              portal={portal}
              invoices={invoices}
              stripe_connect_account_id={portal.stripe_connect_account_id}
              lastInvoiceElementRef={lastInvoiceElementRef}
              isLoadingMore={isLoadingMore}
            />
          </div>
        )}
 
            
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
                    <p className="text-sm font-medium text-gray-600">All invoices loaded</p>
                    <p className="text-xs text-gray-500 mt-1">{invoices.length} total invoices</p>
                  </div>
                </div>
              </div>
            )}
      </div>
    </Layout>
  );
};