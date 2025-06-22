import { useLocation, Link } from "react-router-dom";
import { FormData } from "./FormData.tsx";
import { useNavigate } from "react-router-dom";
import Layout from "@layouts/Layout.tsx";
import { Button, Spinner } from "flowbite-react";
import { useQuery } from '@tanstack/react-query';
import fetchData from '@components/fetchData.tsx';

const LeagueDetails = () => {
    const location = useLocation();
    const id: number = location.state;
    const navigate = useNavigate();

    // useQuery with fetchData
    const { data, isLoading, error } = useQuery<FormData>({
        queryKey: ['league', id],
        queryFn: () => fetchData<FormData>(`/api/leagues/${id}`),
        enabled: !!id,
    });

    if (error)
        return (
            <p>{(error as Error).message}</p>
        );

    if (isLoading)
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spinner size="xl" />
                </div>
            </Layout>
        );

    if (data) {
        return (
            <Layout>
                <h3>Details for league {data.leagueName}</h3>
                <table >
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
                    {/*    <td className="Field">{data.startWeek}</td>*/}
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
                        <td colSpan={2}>
                            <Link to="/Admin/League/Update" state={id.toString()}>
                                <Button outline color="Default">Update</Button></Link>
                            <Button outline color="Default" onClick={() => navigate(-1)}>Go back to list</Button>
                        </td>
                    </tr>
                </table>
            </Layout>
        );
    }
}

export default LeagueDetails;