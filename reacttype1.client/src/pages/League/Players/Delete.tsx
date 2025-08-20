import { useLocation, useNavigate } from "react-router-dom";
import LeagueClass from "@components/LeagueClass";
import Layout from '@layouts/Layout.tsx';
import UpdateFormData from './UpdateFormData.tsx';
import DeleteButton from '@components/DeleteButton.tsx'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spinner } from "flowbite-react";
import fetchData from '@components/fetchData.tsx';

const deletePlayer = async (id: number) => {
    const response = await fetch(`/api/players/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const PlayersDelete = () => {
    const location = useLocation();
    const id: number = location.state;
    const league = new LeagueClass();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // useQuery for fetching player data
    const { data, isLoading, error } = useQuery<UpdateFormData>({
        queryKey: ['player', id],
        queryFn: () => fetchData<UpdateFormData>(`/api/players/GetOne/${id}`),
        enabled: !!id,
    });

    // useMutation for deleting player
    const mutation = useMutation({
        mutationFn: () => deletePlayer(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['players', league.id] });
            queryClient.invalidateQueries({ queryKey: ['playerslist', league.id] });
            navigate("/league/players");
        },
        
    });

    function deleteItem() {
        mutation.mutate();
    }

    if (error)
        return (
            <Layout>
                <h3>Delete Member</h3>
                {(error as Error).message}
            </Layout>
        );

    if (isLoading)
        return (
            <Layout>
                <h3>Delete Member</h3>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spinner size="xl" />
                </div>
            </Layout>
        );

    if (data) {
        return (
            <Layout>
                <h2>Delete player from league {league.leagueName} </h2>
                <table>
                    <tr>
                        <td className="Label">Name:</td>
                        <td className="Field">{data.fullName}</td>
                    </tr>
                    <tr>
                        <td colSpan={2} >
                            <DeleteButton DeleteItem={deleteItem} disabled={mutation.isPending} />
                        </td>
                    </tr>
                </table>
                {mutation.isError && (
                    <p className="errorMessage">
                        {mutation.error instanceof Error
                            ? mutation.error.message
                            : "An error occurred while deleteing player record."}
                    </p>
                )}
            </Layout>
        );
    }

    return null;
};

export default PlayersDelete;