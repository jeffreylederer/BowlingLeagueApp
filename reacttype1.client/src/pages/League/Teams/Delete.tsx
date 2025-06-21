import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Remove deleteData import if present
import LeagueClass from '@components/LeagueClass.tsx';
// Import your TeamType as appropriate
import { TeamType } from "./TeamType.ts";
import { DeleteButton } from '@components/Buttons.tsx'; // Adjust the import path as necessary


const fetchTeam = async (id: number): Promise<TeamType | undefined> => {
    // Optionally, try to get from localStorage first if you store teams there
    // Otherwise, always fetch from API
    const response = await fetch(`/api/Teams/getOne/${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

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
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const league = new LeagueClass();

    // useMutation for deleting team
    const mutation = useMutation({
        mutationFn: () => deleteTeam(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['team', id] });
            queryClient.invalidateQueries({ queryKey: ['teamlist', league.id] });
            queryClient.invalidateQueries({ queryKey: ['teammembership', league.id] });
            navigate("/League/Teams");
        },
        onError: (error: unknown) => {
            setErrorMsg(error instanceof Error ? error.message : String(error));
        }
    });

    // Fetch the team data
    const { data: team, isLoading, error } = useQuery<TeamType | undefined>({
        queryKey: ['team', id],
        queryFn: () => fetchTeam(id),
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
                <p>Loading...</p>
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
                            <td className="Field">{team?.teamNo}</td>
                        </tr>

                        <tr>
                            <td style={{ width: "200px" }}>Skip:</td>
                            <td className="Field">{team?.skip}</td>
                        </tr>

                        <tr hidden={league.teamSize < 3}>
                            <td style={{ width: "200px" }}>Vice Skip:</td>
                            <td className="Field">{team?.viceSkip}</td>
                        </tr>

                        <tr hidden={league.teamSize < 2}>
                            <td style={{ width: "200px" }}>Lead:</td>
                            <td className="Field">{team?.lead}</td>
                        </tr>

                        <tr>
                            <td style={{ width: "200px" }}>Division:</td>
                            <td className="Field">{team?.division}</td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{ textAlign: "center" }}>
                                <DeleteButton DeleteItem={deleteItem} disabled={mutation.isPending} />
                                <button onClick={deleteItem} disabled={mutation.isPending}>Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="errorMessage">{errorMsg}</p>
                {mutation.isError && <p className="errorMessage">{(mutation.error as Error).message}</p>}
            </div>
        );
    }


};

export default TeamDelete;