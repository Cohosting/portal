import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDomainInfo } from '../../../hooks/useDomainInfo';
import { useClientAuth } from '../../../hooks/useClientAuth';
import { useClientPortalData } from '../../../hooks/react-query/usePortalData';
import BillingActivity from '../../../components/BillingActvity/BillingActivity';
import BillingActivityTabs from '../../../components/BillingActvity/BillingActivityTabs';
import { useInvoiceCounts, useInvoicesWithFilter } from '../../../hooks/react-query/useInvoice';
import DateRangeSelector from '../../../components/DateRangeSelector/DateRangeSelector';
import { formatInvoiceDates } from '../../../utils/invoices';
import PageHeader from './components/PageHeader';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { debounce } from '@/utils';

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
  const [debouncedSearchId, setDebouncedSearchId] = useState('');

  const { domain } = useDomainInfo();
  const { data: portal } = useClientPortalData(domain);
  const { clientUser } = useClientAuth(portal?.id);

  const memoizedFilters = useMemo(
    () => ({
      ...filters,
      searchInvoiceId: debouncedSearchId,
      portalId: portal?.id,
      clientId: clientUser?.id
    }),
    [filters, debouncedSearchId, portal?.id, clientUser?.id]
  );

  const { data: invoiceCount, isLoading: isCountLoading } = useInvoiceCounts({
    portal_id: portal?.id,
    client_id: clientUser?.id
  });

  const {
    data: invoicesData,
    isLoading: isInvoiceLoading,
    isFetching
  } = useInvoicesWithFilter(memoizedFilters);

  const safeInvoices = Array.isArray(invoicesData) ? invoicesData : [];

  useEffect(() => {
    // 1. Compute newCounts based on safeInvoices
    const newCounts = [
      { name: 'All', count: safeInvoices.length },
      { name: 'Open', count: safeInvoices.filter(inv => inv.status === 'open').length },
      { name: 'Paid', count: safeInvoices.filter(inv => inv.status === 'paid').length },
      { name: 'Processing', count: safeInvoices.filter(inv => inv.status === 'processing').length }
    ];

    // 2. Compare newCounts vs. current tabs array deeply (by checking each object)
    const isSame =
      newCounts.length === tabs.length &&
      newCounts.every((nc, idx) => nc.name === tabs[idx].name && nc.count === tabs[idx].count);

    // 3. Only update tabs state if something actually changed
    if (!isSame) {
      setTabs(newCounts);
    }
  }, [safeInvoices, tabs]);

  const groupedInvoices = useMemo(() => {
    console.log('▶ inside useMemo for groupedInvoices');
    console.log('   isInvoiceLoading:', isInvoiceLoading);
    console.log('   isFetching:', isFetching);
    console.log('   safeInvoices:', safeInvoices);
    console.log('   filters.status:', filters.status);
  
    if (isInvoiceLoading || isFetching) {
      console.log('   → returning [] because still loading/fetching');
      return [];
    }
  
    let baseList = safeInvoices;
    if (filters.status !== 'all') {
      baseList = safeInvoices.filter(inv => inv.status === filters.status);
      console.log('   → after status filter, baseList:', baseList);
    } else {
      console.log('   → status is "all", baseList = safeInvoices');
    }
  
    const formatted = formatInvoiceDates(baseList);
    console.log('   → returning formatted baseList:', formatted);
    return formatted;
  }, [safeInvoices, isInvoiceLoading, isFetching, filters.status]);
  const debouncedSetSearchId = useCallback(
    debounce(value => {
      setDebouncedSearchId(value);
    }, 400),
    []
  );

  const onDateRangeChange = (start, end) => {
    setFilters(prev => ({ ...prev, startDate: start, endDate: end }));
  };

  const onTabChange = tab => {
    setFilters(prev => ({ ...prev, status: tab.name.toLowerCase() }));
  };

  const onSearchChange = e => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, searchInvoiceId: value }));
    debouncedSetSearchId(value);
  };

  const isLoading = isInvoiceLoading || isFetching;

  console.log(invoicesData)
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
        groupedInvoices={groupedInvoices}
      />
    </div>
  );
};

export default ClientBillingActivity;
