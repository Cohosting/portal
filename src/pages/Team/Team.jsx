import { useSelector } from "react-redux";
import { useTeamSeats } from "../../hooks/react-query/useTeamSeats";
import { Layout } from "../Dashboard/Layout";
import TeamOverview from "./components/TeamOverview";
import TeamSeating from "./components/TeamSeating";
import { Spinner } from "@phosphor-icons/react";
import { usePortalData } from "../../hooks/react-query/usePortalData";
import PortalAccessUnavailable from "../../components/UI/PortalAccessUnavailable";


let headingText = "Subscription Required - Access Restricted"
let message = "It looks like this account does not have an active subscription. To gain access to team functionality, please subscribe or contact your account administrator for assistance."

export const Team = () => {
  const { user, currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal, isLoading: portalLoading } = usePortalData(currentSelectedPortal);
  const { data: teamSeats, isLoading } = useTeamSeats(currentSelectedPortal);



  if (portalLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="w-12 h-12" />
      </div>
    )
  }

  if (!portal?.subscription_id) {
    return <PortalAccessUnavailable heading={headingText} message={message} />

  }
  console.log({
    seats: teamSeats
  })

  return (
    <div>



      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-[500px]">
          <TeamOverview
            companyName={portal?.brand_settings?.brandName}
            totalSeats={teamSeats?.length}
            filledSeats={teamSeats?.filter(seat => seat.status === 'occupied').length}
            freeSeatsLimit={5}
            additionalSeatCost={20}
          />
        </div>

        <TeamSeating portal={portal} seats={teamSeats} />
      </div>

    </div>

  );
}
