import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDomainInfo } from '../../../hooks/useDomainInfo';
import { useClientAuth } from '../../../hooks/useClientAuth';
import { useClientPortalData } from '../../../hooks/react-query/usePortalData';
import BillingActivity from '../../../components/BillingActvity/BillingActivity';
import SectionHeader from '../../../components/SectionHeader';
import BillingActivityTabs from '../../../components/BillingActvity/BillingActivityTabs';
import InputField from '../../../components/InputField';
import { useInvoiceCounts, useInvoicesWithFilter } from '../../../hooks/react-query/useInvoice';
import DateRangeSelector from '../../../components/DateRangeSelector/DateRangeSelector';
import { formatInvoiceDates } from '../../../utils/invoices';
import debounce from 'lodash/debounce';

import PageHeader from './components/PageHeader';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
 


const ClientBillingActivity = () => {
  const [tabs, setTabs] = useState(
    [
      { name: 'All', count: 0 },
      { name: 'Open', count: 0 },
      { name: 'Paid', count: 0 },
      { name: 'Processing', count: 0 }
    ]
  )

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

  const memoizedFilters = useMemo(() => ({
    ...filters,
    searchInvoiceId: debouncedSearchId,
    portalId: portal?.id,
    clientId: clientUser?.id
  }), [filters, debouncedSearchId, portal?.id, clientUser?.id]);

  const { data: invoiceCount, isLoading: isCountLoading } = useInvoiceCounts({
    portal_id: portal?.id,
    client_id: clientUser?.id
  });
  const { data: invoices, isLoading: isInvoiceLoading, isFetching } = useInvoicesWithFilter(memoizedFilters);

  const groupedInvoices = useMemo(() => {
    if (invoices && !isInvoiceLoading && !isFetching) {
      const newCounts = [
        { name: 'All', count: invoices?.length },
        { name: 'Open', count: invoices?.filter(inv => inv.status === 'open').length },
        { name: 'Paid', count: invoices?.filter(inv => inv.status === 'paid').length },
        { name: 'processing', count: invoices?.filter(inv => inv.status === 'processing').length }
      ]

      setTabs(newCounts);

      // filter by tabs
      if (filters.status !== 'all') {
        const filteredInvoices = invoices.filter(inv => inv.status === filters.status);
        return formatInvoiceDates(filteredInvoices);

      }


      return formatInvoiceDates(invoices);


    }
    return [];
  }, [invoices, isInvoiceLoading, isFetching]);

  const debouncedSetSearchId = useCallback(
    debounce((value) => {
      setDebouncedSearchId(value);
    }, 400),
    []
  );

  const onDateRangeChange = (start, end) => {
    setFilters(prev => ({ ...prev, startDate: start, endDate: end }));
  };

  const onTabChange = (tab) => {
    setFilters(prev => ({ ...prev, status: tab.name.toLowerCase() }));
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, searchInvoiceId: value }));
    debouncedSetSearchId(value);
  };

  const isLoading = isInvoiceLoading || isFetching;

  return (
    <div className='h-screen    '>
      <PageHeader
        title="Client Billing Activity"
        description="Review recent billing activities for your clients. Track invoice payments, due dates, and outstanding balances to ensure timely follow-ups."
        showSidebar={true}
        />
 
      <div className='flex items-center mt-4 px-3 sm:px-6'>
        <div className='w-[300px]'>
<Label className='text-sm font-medium mb-2'>
Search Invoice ID
        </Label>
          <Input
            label={'Search Invoice ID'}
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