import React, { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ArrowRight,
  CheckCircle,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/SectionHeader';

const StripeConnectStatus = ({
  stripeUser,
  isLoading,
  createStripeAccount
}) => {
  const [isOpen, setIsOpen] = useState(true);
  if (!stripeUser) return null;

  // Pull disabled_reason from requirements instead of top‐level stripeUser
  const {
    details_submitted,
    charges_enabled,
    requirements: {
      currently_due: currentlyDue = [],
      past_due:      pastDue    = [],
      disabled_reason
    } = {}
  } = stripeUser;

  const needsMoreInfo = currentlyDue.length > 0 || pastDue.length > 0;
  const allRequirements = [...new Set([...currentlyDue, ...pastDue])];
  const isReviewing =
    details_submitted &&
    disabled_reason === 'requirements.pending_verification';
  const isVerified = details_submitted && charges_enabled;

  const getButtonText = () => {
    if (isLoading) return 'Processing...';
    if (isVerified) return 'Manage Account';
    if (needsMoreInfo) return 'Update Information';
    return 'Connect Stripe Account';
  };

  const getRequirementLabel = (req) => {
    let key = req.replace(/^person_[^.]+\./, 'person.');
    const labels = {
      'business_profile.product_description': 'Product or service description',
      'business_profile.support_phone':      'Support phone number',
      'business_profile.url':                'Business website URL',
      external_account:                      'Bank account details',
      'tos_acceptance.date':                 'Terms of Service acceptance date',
      'tos_acceptance.ip':                   'IP address for Terms of Service acceptance',
      'company.address.line1':               'Company address',
      'company.address.city':                'Company city',
      'company.address.state':               'Company state/province',
      'company.address.postal_code':         'Company postal code',
      'person.address.line1':                'Personal address',
      'person.address.city':                 'City',
      'person.address.state':                'State/province',
      'person.address.postal_code':          'Postal code',
      'person.id_number':                    'Government ID number',
      'person.verification.document':        'Identity verification document',
      'person.first_name':                   'First name',
      'person.last_name':                    'Last name',
      'person.dob.day':                      'Date of birth (day)',
      'person.dob.month':                    'Date of birth (month)',
      'person.dob.year':                     'Date of birth (year)',
      'person.email':                        'Email address',
      'person.phone':                        'Phone number',
      'person.ssn_last_4':                   'SSN last 4 digits'
    };
    if (labels[key]) return labels[key];
    return key
      .split('.')
      .map(segment =>
        segment
          .replace(/_/g, ' ')
          .replace(/\b\w/g, char => char.toUpperCase())
      )
      .join(' ');
  };

  const renderRequirementItem = (req) => (
    <div key={req} className="mb-4 flex items-start">
      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
      <div>
        <div className="text-sm font-medium text-gray-800">
          {getRequirementLabel(req)}
        </div>
        <div className="text-xs text-gray-500 font-mono mt-1">{req}</div>
      </div>
    </div>
  );

  // If Stripe is still reviewing
  if (isReviewing) {
    return (
      <>
        <SectionHeader
          hideButton
          heading="Connect your Stripe Account"
          description="Connect your Stripe account to get started with payments."
        />
        <div className="bg-white border border-gray-200 rounded p-4 mb-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm font-medium text-amber-500">
                Pending Verification
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Your account is currently pending verification.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-semibold text-gray-800">
            Stripe Connect Status
          </h2>
          {needsMoreInfo && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
              Action Required
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Manage your Stripe account connection
        </p>

        {needsMoreInfo && (
          <div className="border border-gray-200 rounded mb-4">
            <div className="flex items-start p-4 bg-white">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-amber-800">
                  Action Required
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  Additional information or documents are needed to complete
                  your account verification.
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
                  {isOpen
                    ? 'Hide required information'
                    : 'Show required information'}
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {isOpen && (
                <div className="p-4 pt-2 bg-amber-50">
                  <p className="text-sm mb-4">
                    Please provide the following information to complete
                    verification:
                  </p>
                  {allRequirements.map(renderRequirementItem)}
                </div>
              )}
            </div>
          </div>
        )}

        {isVerified && (
          <div className="bg-white border border-gray-200 rounded p-4 mb-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Account Verified
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  Your Stripe account is fully verified and ready to accept
                  payments.
                </p>
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
