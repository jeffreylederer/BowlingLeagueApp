import { useLocation, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { FormData } from "./FormData.tsx";
import {DeleteButton} from '@components/Buttons.tsx';
import Layout from "@layouts/Layout.tsx";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchLeague = async (id: number): Promise<FormData> => {
    const response = await fetch(`/api/leagues/${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const deleteLeague = async (id: number) => {
    const response = await fetch(`/api/leagues/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const LeagueDelete = () => {
    const location = useLocation();
    const id: number = location.state;
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // useQuery for fetching league data
    const { data, isLoading, error } = useQuery<FormData>({
        queryKey: ['league', id],
        queryFn: () => fetchLeague(id),
        enabled: !!id,
    });

    // useMutation for deleting league
    const mutation = useMutation({
        mutationFn: () => deleteLeague(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leagueslist'] });
            navigate("/Admin/leagues");
        },
        onError: (error: unknown) => {
            setErrorMsg(error instanceof Error ? error.message : String(error));
        }
    });

    function DeleteItem() {
        mutation.mutate();
    }

    if (error)
        return (
            <Layout>
                <h3>Update membership record</h3>
                {(error as Error).message}
            </Layout>
        );

    if (isLoading)
        return (
            <Layout>
                <h3>Update membership record</h3>
                <p>Loading...</p>
            </Layout>
        );

    if (data) {
        return (
            <Layout>
                <h3>Delete league {data.leagueName}</h3>
                <table className="toLeft">
                    <tr>
                        <td className="Label">Active:</td>
                        <td className="Field">{data.active ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                        <td className="Label">Team Size:</td>
                        <td className="Field">{data.teamSize}</td>
                    </tr>
                    <tr>
                        <td className="Label">Ties Allowed:</td>
                        <td className="Field">{data.tiesAllowed ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                        <td className="Label">Points Count:</td>
                        <td className="Field">{data.pointsCount ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                        <td className="Label">Points for a Win:</td>
                        <td className="Field">{data.winPoints}</td>
                    </tr>
                    <tr>
                        <td className="Label">Points for a Tie:</td>
                        <td className="Field">{data.tiePoints}</td>
                    </tr>
                    <tr>
                        <td className="Label">Points for a Bye:</td>
                        <td className="Field">{data.byePoints}</td>
                    </tr>
                    {/*<tr>*/}
                    {/*    <td className="Label">Start Week:</td>*/}
                    {/*    <td className="Field">data.startWeek}</td>*/}
                    {/*</tr>*/}
                    <tr>
                        <td className="Label">Points Limit:</td>
                        <td className="Field">{data.pointsLimit ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                        <td className="Label">Divisions:</td>
                        <td className="Field">{data.divisions}</td>
                    </tr>
                    <tr>
                        <td className="Label">Playoffs:</td>
                        <td className="Field">{data.playOffs ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                        <td colSpan={2} >
                            <DeleteButton DeleteItem={DeleteItem} disabled={mutation.isPending} />
                        </td>
                    </tr>
                </table>
                <p className="errorMessage">{errorMsg}</p>
                {mutation.isError && <p className="errorMessage">{(mutation.error as Error).message}</p>}
            </Layout>
        );
    }
}

export default LeagueDelete;