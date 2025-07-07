import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { Layout } from '../Dashboard/Layout';
import PageHeader from '@/components/internal/PageHeader';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const errorMessages = {
  missing_code: {
    title: 'Missing Authorization Code',
    description: 'We didn’t receive a valid authorization code from Stripe. Please try connecting again.',
  },
  no_code_received: {
    title: 'No Code Received',
    description: 'The OAuth callback didn’t include the required code from Stripe.',
  },
  portal_not_found: {
    title: 'Portal Not Found',
    description: 'We couldn’t locate your portal. Please contact your administrator or support so we can investigate.',
  },
  already_connected: {
    title: 'Already Connected',
    description: 'This portal is already linked to a Stripe account. No further action is needed.',
  },
  stripe_token_exchange_failed: {
    title: 'Stripe Token Exchange Failed',
    description: 'Something went wrong while talking to Stripe. Please try again later.',
  },
  portal_update_failed: {
    title: 'Failed to Save Connection',
    description: 'Stripe connection was successful, but we couldn’t save it to your portal.',
  },
  oauth_failed: {
    title: 'Connection Failed',
    description: 'Something went wrong while connecting your Stripe account.',
  },
};

function useQueryParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const StripeError = () => {
  const query = useQueryParams();
  const navigate = useNavigate();

  const error_reason = query.get('error_reason') || 'oauth_failed';
  const error_state = query.get('error_state') || '';

  const { title, description } = errorMessages[error_reason] || errorMessages['oauth_failed'];

  // Define which errors should NOT show retry
  const nonRetryableErrors = ['already_connected', 'portal_not_found'];

  const handleTryAgain = () => {
   // implement
  };

  return (
    <Layout hideMobileNav>
      <PageHeader title="Stripe Connection Error" description="There was an issue connecting your Stripe account." />
      <div className="max-w-2xl mx-auto p-6">
        <div className="border border-red-200 bg-red-50 rounded-lg p-6">
          <div className="flex items-start">
            <XCircle size={28} className="text-red-500 mt-0.5 mr-4" />
            <div>
              <h2 className="text-xl font-semibold text-red-700">{title}</h2>
              <p className="text-gray-700 mt-2">{description}</p>

              {error_state && (
                <p className="text-sm text-gray-500 font-mono mt-4 break-words">
                  <strong>Error Code:</strong> {error_state}
                </p>
              )}

              {!nonRetryableErrors.includes(error_reason) && (
                <Button
                  onClick={() => navigate('/dashboard/settings')}
                  className="mt-6 bg-black text-white px-5 py-2.5 rounded-md hover:bg-gray-800"
                >
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StripeError;
