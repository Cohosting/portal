import { useSelector } from "react-redux";
import { useTeamSeats } from "../../hooks/react-query/useTeamSeats";
import { Layout } from "../Dashboard/Layout";
import TeamOverview from "./components/TeamOverview";
import TeamSeating from "./components/TeamSeating";
import { Spinner } from "@phosphor-icons/react";
import { usePortalData } from "../../hooks/react-query/usePortalData";
import PortalAccessUnavailable from "../../components/internal/PortalAccessUnavailable";
import { useState } from "react";
import TeamMembers from "./components/TeamMembers";
import { useTeamMembers } from "../../hooks/react-query/useTeamMembers";


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
        <Spinner className="w-12 h-12" />
      </div>
    )
  }

  if (!portal?.subscription_id) {
    return <PortalAccessUnavailable heading={headingText} message={message} />

  }


  return (
    <div >



      <div className="  px-4 sm:px-6 lg:px-8 py-4">
        <div className="py-4">
          <header>
            <div className="max-w-7xl   px-4 sm:px-6 lg:px-8">
              <h1 className="text-xl font-bold leading-tight text-gray-900">Team Management</h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl    ">
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
          </main>
        </div>


        {/* <TeamSeating portal={portal} seats={teamSeats} /> */}
      </div>

    </div>

  );
}
