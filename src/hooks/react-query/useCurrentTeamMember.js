import { supabase } from "@/lib/supabase";
import { queryKeys } from "./queryKeys";
import { useQuery } from "react-query";
 

const fetchTeamMember = async (user_id) => {
    const { data, error } = await supabase
    .from('team_members')
    .select('*, user: user_id(name,avatar_url,email)')
    .eq('user_id', user_id)
    .single();
    if (error) {
        throw new Error(error.message);
    }
    return data;
};



const  useCurrentTeamMember = (user_id) => {
    return useQuery(
        queryKeys.teamMember(user_id),
        () => fetchTeamMember(user_id),
        {
            enabled: !!user_id,
        }
    );
 }

export default useCurrentTeamMember;