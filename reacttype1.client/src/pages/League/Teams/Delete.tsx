import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useLeague from '@hooks/useLeague';
import { TeamType } from "./TeamType.ts";
import DeleteButton from '@components/DeleteButton.tsx'
import { Spinner } from "flowbite-react";
import fetchData from '@components/fetchData.tsx';

const deleteTeam = async (id: number) => {
    const response = await fetch(`/api/teams/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};


const TeamDelete = () => {
    const location = useLocation();
    const id: number = location.state;
  
    const navigate = useNavigate();
    const queryClient = useQueryClient();
   const {league} = useLeague();

    // useMutation for deleting team
    const mutation = useMutation({
        mutationFn: () => deleteTeam(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['team', id] });
            queryClient.invalidateQueries({ queryKey: ['teamlist', league.id] });
            queryClient.invalidateQueries({ queryKey: ['teammembership', league.id] });
            navigate("/League/Teams");
        },
        
    });

    // Fetch the team data
    const { data: team, isLoading, error } = useQuery<TeamType | undefined>({
        queryKey: ['team', id],
        queryFn: () => fetchData<TeamType>(`/api/Teams/getOne/${id}`),
        enabled: !!id,
    });

    function deleteItem() {
        mutation.mutate();
    }

    if (error)
        return (
            <div>
                <h3>Delete Team</h3>
                <p className="errorMessage">{(error as Error).message}</p>
            </div>
        );

    if (isLoading)
        return (
            <div>
                <h3>Delete Team</h3>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spinner size="xl" />
                </div>
            </div>
        );

    if (team) {
        return (
            <div>
                <h3>Delete team {team.teamNo}</h3>
                <table>
                    <tbody>
                        <tr>
                            <td className="Label">Team No:</td>
                            <td className="Field">{team.teamNo}</td>
                        </tr>
                        <tr>
                            <td style={{ width: "200px" }}>Skip:</td>
                            <td className="Field">{team.skip}</td>
                        </tr>
                        <tr hidden={league.teamSize < 3}>
                            <td style={{ width: "200px" }}>Vice Skip:</td>
                            <td className="Field">{team.viceSkip}</td>
                        </tr>
                        <tr hidden={league.teamSize < 2}>
                            <td style={{ width: "200px" }}>Lead:</td>
                            <td className="Field">{team.lead}</td>
                        </tr>
                        <tr>
                            <td style={{ width: "200px" }}>Division:</td>
                            <td className="Field">{team.division}</td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{ textAlign: "center" }}>
                                <DeleteButton DeleteItem={deleteItem} disabled={mutation.isPending} />
                            </td>
                            <td colSpan={2}>

                                {mutation.isError && (
                                    <p className="errorMessage">
                                        {mutation.error instanceof Error
                                            ? mutation.error.message
                                            : "An error occurred while deleting team record."}
                                    </p>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
             
            </div>
        );
    }

    return null;
};

export default TeamDelete;