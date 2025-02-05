import { useQuery } from "react-query";
import { queryKeys } from "./queryKeys";
import { fetchTeamSeats } from "../../services/teamService";


export const useTeamSeats = (portalId) => {
    return useQuery(queryKeys.teamSeats(portalId), () => fetchTeamSeats(portalId), {
        enabled: !!portalId,
    });

}