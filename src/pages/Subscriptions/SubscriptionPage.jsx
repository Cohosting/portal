
import { useSelector } from "react-redux";
import SectionHeader from "../../components/SectionHeader";

import PricingPage from "../Pricing/PricingPage";
import BillingHistory from "./components/BillingHistory";
import PaymentSettings from "./components/PaymentSettings";
import PlanSelector from "./components/PlanSelector";
import useRealtimeSubscription from "../../hooks/react-query/useRealtimeSubscription";
import { formatDate } from "../../utils/dateUtils";
import SubscriptionError from "../../components/internal/SubscriptionError";
import RestrictedAccess from "../../components/internal/RestrictedAccess";
import { useState } from "react";
import { Loader } from "lucide-react";
import PageHeader from "@/components/internal/PageHeader";
import { Layout } from "../Dashboard/Layout";
import DashboardSkeleton, { CustomSkeleton } from "@/components/SkeletonLoading";

let subscriptionStatusStyle = {
  active: "bg-green-500",
  inactive: "bg-gray-500",
  past_due: "bg-red-500",
  canceled: "bg-gray-500",
  paused: "bg-gray-500",
}
let getSubscriptionStatus = (status) => {
  switch (status) {
    case "active":
      return 'Active'
    case "inactive":
      return 'Inactive'
    case "past_due":
      return 'Past Due'
    case "canceled":
      return 'Canceled'
    case "paused":
      return 'Paused'
    default:
      return 'Unknown'
  }
}

const SubscriptionPage = () => {

  const { user, currentSelectedPortal } = useSelector((state) => state.auth);
  console.log({
    user
  })
  const [shouldShowSubscription, setShouldShowSubscription] = useState(true)
  const { subscription, loading } = useRealtimeSubscription(currentSelectedPortal);


  console.log({
    subscription,
    loading
  })

  if (loading) { return ( <Layout>
            <header className="bg-white border-b px-3 sm:px-6 border-gray-200 py-4 sm:py-5 lg:py-6">
              <div className="flex flex-col">
                {/* icon skeleton  */}
                <div className="flex items-center mb-0 lg:mb-2  ">
                  <div className="animate-pulse rounded-sm block lg:hidden h-6 w-6 bg-gray-200 mr-4" />
                  <CustomSkeleton className="h-6 w-32" />
                </div>
                <CustomSkeleton className="h-4 w-80 hidden lg:block" />
              </div>
            </header>

            <div className='flex items-center justify-center mt-6'>
              <Loader  className='animate-spin  ' />
              <p className='ml-2'>Loading...</p>
            </div>
  </Layout>
)
}
  if (subscription?.portal && subscription.portal.created_by !== user.id) {
    return <RestrictedAccess />
  }

  let title = "Subscription";
  let description = "Manage your subscription, billing, and payment settings.";

  return (
    <Layout hideMobileNav >
      <PageHeader
        title={title}
        description={description}
      />
 
      <div className="p-6">
      {
        subscription && shouldShowSubscription ? (
          <>
 
              <div className="flex items-center gap-2  ">
                <p>Subscription Status:</p>
                <div className={`bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full ${subscriptionStatusStyle[subscription.status]}`}>
                  {getSubscriptionStatus(subscription.status)}
                </div>

              </div>
            <PlanSelector subscription={subscription} />
            <PaymentSettings subscription={subscription} />
            <BillingHistory subscription={subscription} />
          </>
        ) : (
            <>
              <PricingPage shouldShowSubscription={shouldShowSubscription} setShouldShowSubscription={setShouldShowSubscription} />

            </>
        )

      }
      </div>





    </Layout>
  );
}

export default SubscriptionPage;
