import { supabase } from "@/lib/supabase";
import { queryKeys } from "./queryKeys";
import { useQuery } from "react-query";
 

const fetchTeamMember = async (user_id, currentSelectedPortal) => {
    const { data, error } = await supabase
    .from('team_members')
    .select('*, user: user_id(name,avatar_url,email)')
    .eq('user_id', user_id)
    .eq('portal_id', currentSelectedPortal)
    .single();
    if (error) {    
        throw new Error(error.message);
    }
    return data;
};



const  useCurrentTeamMember = (user_id, currentSelectedPortal) => {
    return useQuery(
        queryKeys.teamMember(user_id, currentSelectedPortal),
        () => fetchTeamMember(user_id, currentSelectedPortal),
        {
            enabled: !!user_id && !!currentSelectedPortal,
        }
    );
 }

export default useCurrentTeamMember;