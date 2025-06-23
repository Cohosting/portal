import React from 'react'
import BillingActivityList from './BillingActivityList'
import { Loader } from 'lucide-react'

const BillingActivity = ({ 
  invoices, 
  isLoading, 
  colorSettings, 
  lastInvoiceElementRef, 
  isLoadingMore, 
  hasMore 
}) => {

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader className=" animate-spin w-12 h-12 text-primary" />
            </div>
        )
    }

    if (!invoices.length) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-lg text-gray-500">No invoices found</p>
            </div>
        )
    }
    
    return (
        <div className="relative">
            <div className="mt-6 overflow-hidden border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-2xl sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-none">
        <BillingActivityList 
            colorSettings={colorSettings} 
            invoices={invoices}
            lastInvoiceElementRef={lastInvoiceElementRef}
            isLoadingMore={isLoadingMore}
        />
    </div>
</div>
            </div>
            
            {/* Loading overlay when fetching more data */}
            {isLoadingMore && (
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none">
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
                            <Loader className="w-4 h-4 animate-spin" />
                            <span className="text-sm font-medium">Loading...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BillingActivity