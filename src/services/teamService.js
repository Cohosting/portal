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
  _seatId, // no longer used
  memberData,
  subscriptionId
) => {
  // Step 1: Call Supabase RPC to create a new seat + team member + invitation
  const { data, error } = await supabase.rpc('invite_team_member', {
    p_member_data: memberData,
    p_seat_id: null, // Always null – we no longer reuse seats
  });

  if (error) {
    console.error('Error inviting team member:', error);
    throw error;
  }

  // Step 2: Trigger Stripe to increment the seat count by +1
  // This endpoint internally retrieves the Stripe seat item and increases quantity by 1
  try {
    await axiosInstance.patch(`/subscription/${subscriptionId}/seats`);
  } catch (stripeError) {
    console.error('Stripe seat sync failed:', stripeError);
    // Optional: send to a logging table or error tracker for reconciliation
    // await supabase.from('stripe_update_errors').insert([...])
  }

  return { success: true, data };
};
