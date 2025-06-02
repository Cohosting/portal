
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



  if (loading) {
    return (
      <div className="flex mt-36 items-center justify-center">
        <Loader size={36} className="animate-spin m-5 " />
      </div>

    )
  }



  if (subscription?.portal && subscription.portal.created_by !== user.id) {
    return <RestrictedAccess />
  }

  let title = "Subscription";
  let description = "Manage your subscription, billing, and payment settings.";

  return (
    <div >
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





    </div>
  );
}

export default SubscriptionPage;
