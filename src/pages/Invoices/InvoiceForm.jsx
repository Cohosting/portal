import React, { useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import { UploadAttachmentComponent } from '../../components/internal/uploadAttachment';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { useRealtimePortalClients } from '../../hooks/useRealtimePortalClients';
import Breadcrumb from '../../components/Breadcrumb';
import InvoicePaymentSettings from '../../components/InvoicePaymentSettings';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { BanknotesIcon, ChevronDownIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { EyeIcon } from '@heroicons/react/24/outline';
import InvoiceLineItemsTable from '../../components/table/InvoiceLineItemsTable';
import useInvoice from '../../hooks/invoice/useInvoice';
import PageHeader from '@/components/internal/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronsUpDownIcon, Loader } from 'lucide-react';
import { InvoicePreview } from './InvoicePreview';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'react-toastify';

// Error display component
const ErrorMessage = ({ error, className = "" }) => {
  console.log({
    error
  })
  if (!error) return null;
  
  return (
    <p className={cn("text-sm font-medium text-red-600", className)}>
      {error}
    </p>
  );
};

// Loading state component
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading invoice...</p>
    </div>
  </div>
);

// Error state component
const ErrorState = ({ error, onRetry }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center max-w-md">
      <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Invoice</h3>
      <p className="text-gray-600 mb-4">{error}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  </div>
);

export const InvoiceForm = () => {
  const { user, currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);
  const { mode } = useParams();
  const navigate = useNavigate();
  const clientsData = useRealtimePortalClients(user, portal);
  const [open, setOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  const settings = portal?.settings;

  const { 
    invoiceState, 
    setInvoiceState, 
    saveInvoice, 
    updateInvoice,
    validationErrors,
    isSubmitting,
    fetchError,
 
  } = useInvoice({ settings });

  // Handle form submission
  const handleSubmit = async () => {
    try {
      let result;
      
      if (mode === 'edit') {
        result = await updateInvoice();
      } else {
        result = await saveInvoice();
      }
 

      if (result.success) {
        toast.success(result.message);
        navigate('/billing');
      } else if (result.errors) {
        // Validation errors are already set in the hook
        toast.error('Please fix the validation errors and try again.');
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleSelectUser = user => {
    setInvoiceState(prevState => ({ ...prevState, client: user, client_id: user.id }));
    setOpen(false);
  };

  const handleSettingUpdate = (key, value) => {
    setInvoiceState(prevState => ({ 
      ...prevState, 
      settings: { ...prevState.settings, [key]: value } 
    }));
  };

  // Handle input changes with validation
  const handleInputChange = (field, value) => {
    setInvoiceState(prevState => ({ ...prevState, [field]: value }));
    
    // Clear specific field error when user starts typing
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      // Note: In a real implementation, you'd need a way to update validation errors
      // This would typically be handled by the useInvoice hook
    }
  };

  const formatted = invoiceState.due_date ? new Date(invoiceState.due_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }) : '';

  // Show loading state while fetching invoice data
  if (mode === 'edit' && invoiceState.isLoading && !invoiceState.title) {
    return (
      <Layout hideMobileNav={true}>
        <LoadingState />
      </Layout>
    );
  }

  // Show error state if there's a fetch error
  if (fetchError) {
    return (
      <Layout hideMobileNav={true}>
        <ErrorState 
          error={fetchError} 
          onRetry={() => window.location.reload()} 
        />
      </Layout>
    );
  }

  return (
    <Layout hideMobileNav={true}>
      <PageHeader
        title={mode === 'edit' ? 'Edit Invoice' : 'New Invoice'}
        description="Fill out the invoice details below to bill a client."
        icon={<BanknotesIcon className="h-6 w-6 text-gray-500" />}
        action={
          <div className="flex space-x-2">
            {/* Preview button for mobile view */}
            <Button
              className="lg:hidden bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              onClick={() => setPreviewDialogOpen(true)}
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              Preview
            </Button>
            
            {/* Cancel button */}
            <Button
              variant='link'
              onClick={() => navigate('/billing')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              className="bg-black hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting || invoiceState.isLoading}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  {mode === 'edit' ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                mode === 'edit' ? 'Update Invoice' : 'Create Invoice'
              )}
            </Button>
          </div>
        }
      />


      
      {/* Side by side layout with flex */}
      <div className="flex flex-col lg:flex-row gap-6 py-4 px-5">
        {/* Left column - Form */}
        <div className="w-full lg:w-1/2 lg:max-w-[700px]">
          <div className="space-y-4 mb-4">
            <div className="space-y-2">
              <Label className="text-[15px]" htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter title"
                value={invoiceState.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={cn(validationErrors.title && "border-red-500 focus:border-red-500")}
              />
              <ErrorMessage error={validationErrors.title} />
            </div>

            <div className="space-y-2">
              <Label className="text-[15px]" htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter description"
                value={invoiceState.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={cn(validationErrors.description && "border-red-500 focus:border-red-500")}
              />
              <ErrorMessage error={validationErrors.description} />
            </div>
          </div>

          <div className="space-y-2 my-4">
            <Label className="text-[15px]" htmlFor="client-select">Select Client</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !invoiceState.client && "text-muted-foreground",
                    validationErrors.client && "border-red-500"
                  )}
                >
                  {invoiceState.client
                    ? `${invoiceState.client.name} (${invoiceState.client.email})`
                    : "Select client"}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-white">
                <Command>
                  <CommandInput
                    placeholder="Search clients..." 
                    className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                  />
                  <CommandEmpty>No client found.</CommandEmpty>
                  <ScrollArea className="max-h-72">
                    <CommandGroup>
                      {clientsData?.map((client) => (
                        <CommandItem
                          key={client.id}
                          value={client.id}
                          onSelect={() => handleSelectUser(client)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{client.name}</span>
                            <span className="text-sm text-muted-foreground">{client.email}</span>
                          </div>
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              invoiceState.client?.id === client.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </ScrollArea>
                </Command>
              </PopoverContent>
            </Popover>
            <ErrorMessage error={validationErrors.client} />
          </div>

          <div className="space-y-2 my-4">
            <Label className="text-[15px]" htmlFor="due-date">Select Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !invoiceState.due_date && "text-muted-foreground",
                    validationErrors.due_date && "border-red-500"
                  )}
                >
                  <CalendarIcon />
                  {invoiceState.due_date ? formatted : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto bg-white p-0" align="start">
                <Calendar
                  mode="single"
                  selected={invoiceState.due_date} 
                  onSelect={(date) => handleInputChange('due_date', date)}
                  initialFocus
                  classNames={{
                    day_selected: "bg-black text-white hover:bg-gray-800 hover:text-white focus:bg-black focus:text-white"
                  }}
                />
              </PopoverContent>
            </Popover>
            <ErrorMessage error={validationErrors.due_date} />
          </div>
          
          <InvoiceLineItemsTable 
            lineItems={invoiceState.line_items} 
            setLineItems={(val) => handleInputChange('line_items', val)}
            errors={validationErrors.line_items}
          />

          <div className="space-y-3 mt-6">
            <Label className="text-[15px]" htmlFor="comment">Add your comment</Label>
            <Textarea
              id="comment"
              placeholder="Enter any additional information for this invoice"
              value={invoiceState.memo} 
              onChange={(e) => handleInputChange('memo', e.target.value)}
              className={cn(
                "min-h-[120px] resize-y",
                validationErrors.memo && "border-red-500 focus:border-red-500"
              )}
            />
            <ErrorMessage error={validationErrors.memo} />
          </div>

          <UploadAttachmentComponent
            setAttachments={val => handleInputChange('attachments', val)}
          /> 

          <Disclosure>
            <DisclosureButton className="py-2 group flex items-center space-x-2">
              <p className="text-[15px] font-semibold">Advanced Settings</p>
              <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel transition className="text-gray-500 origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0">
              <InvoicePaymentSettings 
                handleSettingUpdate={handleSettingUpdate} 
                settings={invoiceState?.settings} 
              />
            </DisclosurePanel>
          </Disclosure>
        </div>

        {/* Right column - Preview (only visible on larger screens) */}
        <div className="hidden lg:block w-full lg:w-1/2 mt-8 lg:mt-0 lg:sticky lg:top-4 lg:self-start">
          <div className="bg-white rounded-md shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium p-4 border-b border-gray-100">Preview</h3>
            <div className="p-4">
              <InvoicePreview billingAddress={{
                ...portal?.billing_address,
                company_name: portal?.brand_settings?.brandName,
              }}   invoiceData={invoiceState} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for preview on mobile */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[90%] bg-white   p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-gray-100">
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto h-full px-6 py-4 pb-16">
            <InvoicePreview billingAddress={{
                ...portal?.billing_address,
                company_name: portal?.brand_settings?.brandName,
              }} invoiceData={invoiceState} />
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};