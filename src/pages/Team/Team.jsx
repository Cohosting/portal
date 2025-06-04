import { useSelector } from "react-redux";
import { useTeamSeats } from "../../hooks/react-query/useTeamSeats";
import TeamOverview from "./components/TeamOverview";
import { usePortalData } from "../../hooks/react-query/usePortalData";
import PortalAccessUnavailable from "../../components/internal/PortalAccessUnavailable";
import TeamMembers from "./components/TeamMembers";
import { useTeamMembers } from "../../hooks/react-query/useTeamMembers";
import { Loader } from "lucide-react";
import PageHeader from "@/components/internal/PageHeader";
import { Layout } from "../Dashboard/Layout";
import DashboardSkeleton, { CustomSkeleton } from "@/components/SkeletonLoading";
 

let headingText = "Subscription Required - Access Restricted"
let message = "It looks like this account does not have an active subscription. To gain access to team functionality, please subscribe or contact your account administrator for assistance."

export const Team = () => {
  const { user, currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal, isLoading: portalLoading } = usePortalData(currentSelectedPortal);
  const { data: teamSeats, isLoading } = useTeamSeats(currentSelectedPortal);
  const { data: teamMembers, isLoading: teamMemberLoading } = useTeamMembers(currentSelectedPortal);

  if (portalLoading || isLoading || teamMemberLoading)  return  (
    <Layout>
            <header className="bg-white border-b px-3 sm:px-[18px] border-gray-200 py-4 sm:py-5 lg:py-6">
              <div className="flex flex-col">
                {/* icon skeleton  */}
                <div className="flex items-center mb-0 lg:mb-2  ">
                  <div className="animate-pulse rounded-sm block lg:hidden h-6 w-6 bg-gray-200 mr-4" />
                  <CustomSkeleton className="h-6 w-32" />
                </div>
                <CustomSkeleton className="h-4 w-80 hidden lg:block" />
              </div>
            </header>
            <div className="mt-6">
                <div className="flex items-center justify-center">
                <Loader className="animate-spin" />
                <p className="ml-2">Loading...</p>
              </div>
            </div>
    </Layout>
  )

  if (!portal?.subscription_id) {
    return <Layout> <PortalAccessUnavailable heading={headingText} message={message} /> </Layout>

  }


  return (
    <Layout hideMobileNav headerName="Team">
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

    </Layout>

  );
}
