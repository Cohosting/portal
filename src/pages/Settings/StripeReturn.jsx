import React, { useEffect, useState } from 'react';
import { createStripeConnectAccount } from '../../utils/stripe';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/axiosConfig';
import { Button } from '@headlessui/react';
import DashboardSkeleton from '@/components/SkeletonLoading';
import { Layout } from '../Dashboard/Layout';
import PageHeader from '@/components/internal/PageHeader';
import { CheckCircle, XCircle, Spinner, CreditCard, ArrowClockwise } from '@phosphor-icons/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const StripeReturn = () => {
  const [stripeUser, setStripeUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFill, setIsLoadingFill] = useState(false);
  const [isRequirementsOpen, setIsRequirementsOpen] = useState(true);
  const { currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);

  const getStripeUser = async stripeConnectAccountId => {
    if (!stripeConnectAccountId) throw new Error('No stripe connect account id found');
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get(`/stripe/connect/account/${stripeConnectAccountId}`);
      setStripeUser(data.stripeAccount);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (portal) getStripeUser(portal.stripe_connect_account_id);
  }, [portal]);

  if (isLoading && !portal && !stripeUser) return <DashboardSkeleton />;

  let pageTitle = "Payment Account Setup";
  let pageDescription = "Review and complete your Stripe account verification";

  if (stripeUser) {
    if (stripeUser.details_submitted && stripeUser.charges_enabled) {
      pageTitle = "Payment Account Verified";
      pageDescription = "Your Stripe account is fully verified and ready to accept payments";
    } else if (stripeUser.details_submitted && !stripeUser.charges_enabled) {
      pageTitle = "Payment Account Under Review";
      pageDescription = "Your information has been submitted and is pending verification";
    } else {
      pageTitle = "Complete Payment Setup";
      pageDescription = "Additional information required to activate your payment account";
    }
  }

  const currentlyDue = stripeUser?.requirements?.currently_due || [];
  const pastDue = stripeUser?.requirements?.past_due || [];
  const pendingVerification = stripeUser?.requirements?.pending_verification || [];
  const allRequirements = [...new Set([...currentlyDue, ...pastDue])];
  const needsMoreInfo = allRequirements.length > 0;

  const isVerificationPending =
    stripeUser?.disabled_reason === 'requirements.pending_verification' ||
    pendingVerification.length > 0;

  const getRequirementLabel = (requirement) => {
    const labels = {
      'business_profile.product_description': 'Product or service description',
      'business_profile.support_phone': 'Support phone number',
      'business_profile.url': 'Business website URL',
      'external_account': 'Bank account details',
      'tos_acceptance.date': 'Terms of Service acceptance date',
      'tos_acceptance.ip': 'IP address for Terms of Service acceptance',
      'company.tax_id': 'Company tax ID',
      'company.address.line1': 'Company address',
      'company.address.city': 'Company city',
      'company.address.state': 'Company state/province',
      'company.address.postal_code': 'Company postal code',
      'person.address.line1': 'Personal address',
      'person.address.city': 'City',
      'person.address.state': 'State/province',
      'person.address.postal_code': 'Postal code',
      'person.id_number': 'Government ID number',
      'person.verification.document': 'Identity verification document',
      'person.first_name': 'First name',
      'person.last_name': 'Last name',
      'person.dob.day': 'Date of birth (day)',
      'person.dob.month': 'Date of birth (month)',
      'person.dob.year': 'Date of birth (year)',
      'person.email': 'Email address',
      'person.phone': 'Phone number'
    };
    return labels[requirement] || requirement.replace(/\./g, ' ').replace(/_/g, ' ');
  };

  const getSetupButtonText = () => {
    if (needsMoreInfo) return 'Update Information';
    return 'Complete Setup';
  };

  return (
    <Layout hideMobileNav>
      <PageHeader title={pageTitle} description={pageDescription} />
      <div className="max-w-3xl mx-auto p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner size={32} className="animate-spin text-gray-600" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center">
              <CreditCard size={32} weight="duotone" className="text-gray-700 mr-3" />
              <h2 className="text-2xl font-medium">Stripe Account Status</h2>
            </div>

            {stripeUser && (
              <div className="space-y-6">
                <div className="flex items-center">
                  {stripeUser.details_submitted ? (
                    <CheckCircle size={24} weight="fill" className="text-green-500 mr-3" />
                  ) : (
                    <XCircle size={24} weight="fill" className="text-red-500 mr-3" />
                  )}
                  <span className="text-lg">
                    {stripeUser.details_submitted
                      ? "Account information successfully submitted"
                      : "Account information incomplete"}
                  </span>
                </div>

                <div className="flex items-center">
                  {stripeUser.charges_enabled ? (
                    <CheckCircle size={24} weight="fill" className="text-green-500 mr-3" />
                  ) : (
                    <XCircle size={24} weight="fill" className="text-red-500 mr-3" />
                  )}
                  <span className="text-lg">
                    {stripeUser.charges_enabled
                      ? "Your account is fully verified and ready to accept payments"
                      : "Your account cannot process payments yet"}
                  </span>
                </div>

                {isVerificationPending && (
                  <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                    <div className="flex items-start">
                      <ArrowClockwise size={24} className="text-amber-500 mr-3 mt-1" />
                      <div>
                        <p className="text-amber-700 font-medium mb-1">Verification in progress</p>
                        <p className="text-gray-600 text-sm">
                          We're currently reviewing your submitted documents. This typically takes 1–2 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!isVerificationPending && needsMoreInfo && (
                  <div className="border border-gray-200 rounded-lg p-5 bg-gray-50 space-y-6">
                    <div className="flex items-start">
                      <XCircle size={24} weight="fill" className="text-red-500 mr-3 mt-1" />
                      <div>
                        <p className="text-red-700 font-medium">Additional information required</p>
                        <p className="text-gray-600">
                          Some required information is missing or needs to be corrected. Please complete your profile to enable payments.
                        </p>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded">
                      <button
                        onClick={() => setIsRequirementsOpen(!isRequirementsOpen)}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-amber-700 hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <XCircle size={18} weight="fill" className="text-red-500 mr-2" />
                          {isRequirementsOpen ? 'Hide required information' : 'Show required information'}
                        </div>
                        {isRequirementsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>

                      {isRequirementsOpen && (
                        <div className="p-4 pt-2 bg-amber-50">
                          <p className="text-sm mb-4">Please provide the following information to complete verification:</p>
                          {allRequirements.map(requirement => (
                            <div key={requirement} className="mb-4 flex items-start">
                              <XCircle size={18} weight="fill" className="text-red-500 mt-0.5 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-gray-800">{getRequirementLabel(requirement)}</div>
                                <div className="text-xs text-gray-500 font-mono mt-1">{requirement}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <Button
                        className={`bg-black text-white px-5 py-2.5 rounded-md hover:bg-gray-800 ${
                          isLoadingFill ? 'opacity-70 cursor-not-allowed' : ''
                         }`}
                        disabled={isLoadingFill}
                        onClick={() =>
                          createStripeConnectAccount(
                            portal.uid,
                            portal.stripe_connect_account_id,
                            portal.id,
                            setIsLoadingFill
                          )
                        }
                      >
                        {isLoadingFill ? (
                          <span className="flex items-center">
                            <Spinner size={18} className="animate-spin mr-2" />
                            Processing...
                          </span>
                        ) : (
                          getSetupButtonText()
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};
