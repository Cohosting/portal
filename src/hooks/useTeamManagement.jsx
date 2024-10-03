import { useState } from "react";
import { inviteMemberToTeam } from "../services/teamService";
import axiosInstance from "../api/axiosConfig";
import { useSelector } from "react-redux";


import { v4 as uuidv4 } from 'uuid';
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { queryKeys } from "./react-query/queryKeys";
import { useSendEmail } from "./useEmailApi";




const useTeamManagement = (portal) => {
    let portalId = portal?.id;
    const queryClient = useQueryClient();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useSelector(state => state.auth);
    const { sendEmail } = useSendEmail();
    const invite = async (seatId, memberData) => {
        try {
            setLoading(true);
            setError(null);
            const invitationId = uuidv4();

            const { data: tokenObject } = await axiosInstance.get('/generate-jwt-token', {
                params: {
                    memberData: {
                        email: memberData.email,
                        portal_id: memberData.portal_id,
                        invitation_id: invitationId
                    }
                }
            });

            // Invite member to team
            const response = await inviteMemberToTeam(seatId, {
                ...memberData,
                ...tokenObject,
                invited_by: user.id,
                invitation_id: invitationId
            }, portal?.subscription_id);
            await queryClient.invalidateQueries(queryKeys.teamSeats(portalId));
            await sendEmail(memberData.email, `Invitation to join team`, `You have been invited to join the team. Please use the following link: ${window.location.origin}/invitations/${invitationId}/accept/${tokenObject.invitation_token}`);
            toast.success('Team member invited successfully');
        } catch (error) {
            console.log(`Error inviting team member: ${error.message}. Please try again`);
            setError(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }


    const removeTeamMember = async (teamMemberId) => {
        try {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase.rpc('remove_team_member', {
                team_member_id: teamMemberId
            });
            if (error) {
                throw new Error(error.message);
            };

            await queryClient.invalidateQueries(queryKeys.teamSeats(portalId));

            toast.success('Team member removed successfully');


        } catch (error) {
            setError(error);
            toast.error('Error removing team member');
        } finally {
            setLoading(false);
        }
    }



    console.log({ error })
    return {
        loading,
        error,
        invite,
        removeTeamMember
    }



}

export default useTeamManagement;