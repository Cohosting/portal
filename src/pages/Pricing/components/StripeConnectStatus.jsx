import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ArrowRight, CheckCircle, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/SectionHeader';

const StripeConnectStatus = ({ stripeUser, isLoading, createStripeAccount }) => {
    const [isOpen, setIsOpen] = useState(true); // Default to open based on the screenshot
    
    // Return null if stripeUser is not provided
    if (!stripeUser) return null;

    // Logic from original component
    const isVerified = stripeUser?.details_submitted && stripeUser?.charges_enabled;
    const needsMoreInfo = stripeUser?.requirements?.currently_due?.length > 0 || stripeUser?.requirements?.past_due?.length > 0;
    
    // Get all requirements that need attention - removing duplicates
    const currentlyDue = stripeUser?.requirements?.currently_due || [];
    const pastDue = stripeUser?.requirements?.past_due || [];
    // Use Set to automatically remove duplicates, then convert back to array
    const allRequirements = [...new Set([...currentlyDue, ...pastDue])];

    // Determine button text based on account status
    const getButtonText = () => {
        if (isLoading) return "Processing...";
        if (isVerified) return "Manage Account";
        if (needsMoreInfo) return "Update Information";
        return "Connect Stripe Account";
    };

    // Function to render a requirement item
    const renderRequirementItem = (requirement) => {
        return (
            <div key={requirement} className="mb-4">
                <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                        <div className="text-sm font-medium text-gray-800">
                            {getRequirementLabel(requirement)}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-1">
                            {requirement}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Function to get a human-readable label for a requirement
    const getRequirementLabel = (requirement) => {
        const labels = {
            'business_profile.product_description': 'Product or service description',
            'business_profile.support_phone': 'Support phone number',
            'business_profile.url': 'Business website URL',
            'external_account': 'Bank account details',
            'tos_acceptance.date': 'Terms of Service acceptance date',
            'tos_acceptance.ip': 'IP address for Terms of Service acceptance'
        };
        
        return labels[requirement] || requirement.replace(/\./g, ' ').replace(/_/g, ' ');
    };
    console.log({
        isVerified, needsMoreInfo
    })

    if (stripeUser?.requirements?.disabled_reason === "pending_verification") {
        return (
            <>

            <SectionHeader
                hideButton
                heading={"Connect your Stripe Account"}
                description={"Connect your Stripe account to get started with payments."}
            />
            <div className="bg-white border border-gray-200 rounded p-4 mb-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">Pending Verification</p>
                        <p className="mt-1 text-sm text-gray-700">Your account is currently pending verification.</p>
                    </div>
                </div>
            </div>
            </>

        )
    }
    return (
        <div className="w-full">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-gray-800">Stripe Connect Status</h2>
                    {needsMoreInfo && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                            Action Required
                        </span>
                    )}
                </div>
                
                <p className="text-sm text-gray-600 mb-4">Manage your Stripe account connection</p>
                
                {needsMoreInfo && (
                    <div className="border border-gray-200 rounded mb-4">
                        <div className="flex items-start p-4 bg-white">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                                <div className="text-sm font-medium text-amber-800">Action Required</div>
                                <div className="text-sm text-gray-700 mt-1">
                                    Additional information or documents are needed to complete your account verification.
                                </div>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-200">
                            <button 
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center justify-between w-full px-4 py-2 text-sm text-amber-700 hover:bg-gray-50"
                            >
                                <div className="flex items-center">
                                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                                    {isOpen ? 'Hide required information' : 'Show required information'}
                                </div>
                                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                            
                            {isOpen && (
                                <div className="p-4 pt-2 bg-amber-50">
                                    <p className="text-sm mb-4">Please provide the following information to complete verification:</p>
                                    <div>
                                        {allRequirements.map(renderRequirementItem)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {isVerified && (
                    <div className="bg-white border border-gray-200 rounded p-4 mb-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">Account Verified</p>
                                <p className="mt-1 text-sm text-gray-700">Your Stripe account is fully verified and ready to accept payments.</p>
                            </div>
                        </div>
                    </div>
                )}
                
 
                <div className="mb-4">
                    <Button
                        onClick={createStripeAccount}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center px-4 py-2 bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                    >
                        {getButtonText()}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StripeConnectStatus;