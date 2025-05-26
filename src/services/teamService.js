import axiosInstance from '../api/axiosConfig';
import { supabase } from '../lib/supabase';

export const fetchTeamSeats = async portalId => {
  try {
    const { data, error } = await supabase
      .from('seats')
      .select('*,  user: user_id(*), team_member: team_member_id(*)')
      .order('seat_number')
      .eq('portal_id', portalId);
    if (error) {
      console.error('Error fetching team seats:', error);
      return { success: false, message: 'Error fetching team seats', error };
    }
    console.log('Fetched team seats:', data);
    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, message: 'Unexpected error occurred', error: err };
  }
};

export const inviteMemberToTeam = async (
  seatId,
  memberData,
  subscriptionId
) => {
  console.log(seatId);
  const { data, error } = await supabase.rpc('invite_team_member', {
    p_member_data: memberData,
    p_seat_id: seatId,
  });

  if (error) {
    console.error('Error inviting team member:', error);
    throw error;
  }

  if (!seatId) {
    // stripe sync
    const { data: seats, error: seatsError } = await supabase
      .from('seats')
      .select('*')
      .eq('portal_id', memberData.portal_id);

    if (seatsError) {
      console.error('Error fetching seats:', seatsError);
      throw seatsError;
    }

    const { data } = await axiosInstance.patch(
      `/subscription/${subscriptionId}/seats`,
      {
        newSeatCount: seats.length,
      }
    );
  }

  return { success: true, data };
};
