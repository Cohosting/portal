import { useSelector } from "react-redux";
import { useTeamSeats } from "../../hooks/react-query/useTeamSeats";
import TeamOverview from "./components/TeamOverview";
import { usePortalData } from "../../hooks/react-query/usePortalData";
import PortalAccessUnavailable from "../../components/internal/PortalAccessUnavailable";
import TeamMembers from "./components/TeamMembers";
import { useTeamMembers } from "../../hooks/react-query/useTeamMembers";
import { Loader } from "lucide-react";
import PageHeader from "@/components/internal/PageHeader";
 

let headingText = "Subscription Required - Access Restricted"
let message = "It looks like this account does not have an active subscription. To gain access to team functionality, please subscribe or contact your account administrator for assistance."

export const Team = () => {
  const { user, currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal, isLoading: portalLoading } = usePortalData(currentSelectedPortal);
  const { data: teamSeats, isLoading } = useTeamSeats(currentSelectedPortal);
  const { data: teamMembers, isLoading: teamMemberLoading } = useTeamMembers(currentSelectedPortal);

  if (portalLoading || isLoading || teamMemberLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-12 h-12" />
      </div>
    )
  }

  if (!portal?.subscription_id) {
    return <PortalAccessUnavailable heading={headingText} message={message} />

  }


  return (
    <div className=" " >
      <PageHeader
        title="Team Management"
        description="Manage your team members and seats."
      />



      <div className="  ">
        <div className="py-4">
              
            <div className="w-full  ">
              <TeamOverview   
            companyName={portal?.brand_settings?.brandName}
            totalSeats={teamSeats?.length}
            filledSeats={teamSeats?.filter(seat => seat.status === 'reserved').length}
            freeSeatsLimit={5}
            additionalSeatCost={20}
                teamMembers={teamMembers}
              />
              <TeamMembers portal={portal} teamMembers={teamMembers} />

            </div>
            
        </div>
       </div>

    </div>

  );
}
