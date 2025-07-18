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
import { useEffect } from "react";




const useTeamManagement = (portal, shouldFetchCurrentTeamMember = false) => {
    let portalId = portal?.id;
    const queryClient = useQueryClient();

    const [loading, setLoading] = useState(false);
    const [loadingCurrentTeamMember, setLoadingCurrentTeamMember] = useState(false);
    const [currentTeamMember, setCurrentTeamMember] = useState(null);
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
                invitation_id: invitationId,
              },
            },
          });
      
          const response = await inviteMemberToTeam(null, {
            ...memberData,
            ...tokenObject,
            invited_by: user.id,
            invitation_id: invitationId,
          }, portal?.subscription_id);
      
          await queryClient.invalidateQueries(queryKeys.teamSeats(portalId));
      
          await sendEmail(
            memberData.email,
            `Invitation to join team`,
            `You have been invited to join the team. Please click <a href="${window.location.origin}/invitations/${invitationId}/accept/${tokenObject.invitation_token}">here</a> to accept the invitation.`
          );
      
          toast.success('Team member invited successfully');
        } catch (error) {
          console.log(`Error inviting team member: ${error.message}. Please try again`);
          setError(error);
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };

      const removeTeamMember = async (teamMemberId) => {
        try {
          setLoading(true);
          setError(null);
      
          // Step 1: Call Supabase RPC to remove team member and their seat
          const { data, error } = await supabase.rpc('remove_team_member', {
            team_member_id: teamMemberId
          });

          console.log('remove_team_member RPC data:', data);
      
          if (error || !data || !data[0]) {
            throw new Error(error?.message || 'RPC failed to return subscription info');
          }
      
          const { team_subscription_id } = data[0];
      
          // Step 2: Call backend to decrement Stripe seat count by -1
          await axiosInstance.patch(`/subscription/${team_subscription_id}/seats/remove`);
      
          // Step 3: Refresh seats + team member views
          await queryClient.invalidateQueries(queryKeys.teamSeats(portalId));
          await queryClient.invalidateQueries(queryKeys.teamMembers(portalId));
      
          toast.success('Team member removed successfully');
        } catch (error) {
          setError(error);
          console.error('Error removing team member:', error);
          toast.error('Error removing team member');
        } finally {
          setLoading(false);
        }
      };
      

    const fetchCurrentTeamMember = async () => {
        try {
            setLoadingCurrentTeamMember(true);
            setError(null);
            const { data, error } = await supabase.from('team_members').select('*').eq('portal_id', portalId).eq('user_id', user.id);
            if (error) {
                throw new Error(error.message);
            }
            setCurrentTeamMember(data[0]);
        } catch (error) {
            setError(error);
        } finally {
            setLoadingCurrentTeamMember(false);
        }
    }


    useEffect(() => {
        if (shouldFetchCurrentTeamMember) {
            fetchCurrentTeamMember();
        }
    }, [shouldFetchCurrentTeamMember]);



    return {
        loading,
        loadingCurrentTeamMember,
        error,
        invite,
        removeTeamMember,
        fetchCurrentTeamMember,
        currentTeamMember
    }



}

export default useTeamManagement;