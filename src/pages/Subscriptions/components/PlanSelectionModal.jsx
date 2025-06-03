import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useSubscription from "../../../hooks/useSubscription";
import { Loader } from "lucide-react";

const plans = [
  { id: 1, name: "Starter", interval: "monthly", price: 89, priceId: "price_1Ppot2G6ekPTMWCwZM8MR58c" },
  { id: 2, name: "Starter", interval: "yearly", price: 828, priceId: "price_1Ppot2G6ekPTMWCwJP5tlcod" },
  { id: 3, name: "Pro", interval: "monthly", price: 199, priceId: "price_1PpotSG6ekPTMWCw3ulBiPa9" },
  { id: 4, name: "Pro", interval: "yearly", price: 1908, priceId: "price_1PpotxG6ekPTMWCwFjy8Gr8V" },
];

const PlanSelectionModal = ({ currentPlan = { name: "Pro", interval: "monthly" }, subscription, cancelSubscriptionDowngrade }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { upgradeSubscription, downgradeSubscription } = useSubscription();

  const getPlanChangeType = (planName, planInterval) => {
    if (planName === currentPlan.name && planInterval === currentPlan.interval) return "current";
    if (planName === "Pro" && currentPlan.name === "Starter") return "upgrade";
    if (planName === currentPlan.name && planInterval === "yearly" && currentPlan.interval === "monthly") return "upgrade";
    if (planName === "Starter" && currentPlan.name === "Pro") return "downgrade";
    if (planName === currentPlan.name && planInterval === "monthly" && currentPlan.interval === "yearly") return "downgrade";
    return "";
  };

  const getBadgeStyle = (changeType) => {
    switch (changeType) {
      case "current":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900";
      case "upgrade":
        return "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900";
      case "downgrade":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900";
      default:
        return "";
    }
  };

  const handleConfirmChange = async () => {
    setIsLoading(true);
    try {
      const plan = plans.find((p) => p.id === selectedPlan);
      const planChangeType = getPlanChangeType(plan.name, plan.interval);
      let priceId = plan.priceId;

      if (planChangeType === "upgrade") {
        await upgradeSubscription(subscription.stripe_subscription_id, priceId);
      } else if (planChangeType === "downgrade") {
        await downgradeSubscription(subscription.stripe_subscription_id, priceId);
      } else {
        throw new Error("Invalid plan change type");
      }

      toast.success("Plan changed successfully!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to change plan. Please try again.");
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    const currentPlanId = plans.find(
      (p) => p.name === currentPlan.name && p.interval === currentPlan.interval
    )?.id;
    setSelectedPlan(currentPlanId || null);
  };

  const hasScheduledDowngrade = !!subscription?.next_phase?.start_date;

  const handleCancelDowngrade = async () => {
    try {
      setIsCancelLoading(true);
      await cancelSubscriptionDowngrade(subscription.stripe_subscription_id);
      toast.success("Scheduled downgrade canceled successfully!");
    } catch (error) {
      toast.error("Failed to cancel scheduled downgrade. Please try again.");
    } finally {
      setIsCancelLoading(false);
      setIsOpen(false);
    }
  };


  return (
    <>
      <Button variant="outline" onClick={handleOpen}>
        Change Plan
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-black">Change Plan</DialogTitle>
          </DialogHeader>

          {hasScheduledDowngrade ? (
            <div className="mt-4 bg-neutral-100 border border-neutral-300 text-gray-800 p-4 rounded-md text-sm">
  <p className="mb-2">
    <strong>Heads up:</strong> You currently have a scheduled downgrade to the{" "}
    <strong>{subscription?.next_phase?.plan?.nickname || "Starter"}</strong> plan on{" "}
    <strong>
      {new Date(subscription.next_phase.start_date * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })}
    </strong>.
  </p>
  <p>
    To change your plan, please cancel the scheduled downgrade first.
  </p>
  <Button
    variant="outline"
    onClick={handleCancelDowngrade}
    disabled={isCancelLoading}
    className="mt-4 w-full bg-gray-800 hover:bg-gray-900 text-white"
  >
    {isCancelLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : "Cancel Downgrade"}
  </Button>
</div>

          ) : (
            <>
              <div className="mt-4 space-y-2">
                {plans.map((plan) => {
                  const changeType = getPlanChangeType(plan.name, plan.interval);
                  const badgeStyle = getBadgeStyle(changeType);

                  return (
                    <div
                      key={plan.id}
                      className={`p-3 rounded-lg border ${
                        selectedPlan === plan.id ? "border-indigo-500" : "border-gray-200"
                      } transition-all duration-200 ease-in-out`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div>
                            <h3 className="text-sm font-semibold">{plan.name}</h3>
                            <p className="text-xs text-gray-500 capitalize">{plan.interval}</p>
                          </div>
                          {changeType && (
                            <span
                              className={`${badgeStyle} px-2 py-1 rounded-full text-xs font-medium capitalize transition-colors duration-200`}
                            >
                              {changeType}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-bold">
                            ${plan.price}/{plan.interval === "monthly" ? "mo" : "yr"}
                          </p>
                          {changeType !== "current" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedPlan(plan.id)}
                              disabled={isLoading}
                              className="text-xs bg-black text-white hover:bg-gray-800"
                            >
                              {selectedPlan === plan.id ? "Selected" : "Select"}
                            </Button>
                          ) : (
                            <span className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-md">
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmChange}
                  disabled={
                    !selectedPlan ||
                    isLoading ||
                    selectedPlan ===
                      plans.find((p) => p.name === currentPlan.name && p.interval === currentPlan.interval)?.id
                  }
                  className="bg-black text-white hover:bg-black/80"
                >
                  {isLoading ? "Changing..." : "Confirm Change"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};

export default PlanSelectionModal;
