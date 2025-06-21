// Remove useFetch import if present
import { useQuery } from '@tanstack/react-query';
import { TeamType } from "./TeamType.ts"; // Uncomment and adjust as needed
import { GetCount } from '@components/CountMatches.tsx';
import LeagueClass from "@components/LeagueClass";
import UserClass from "@components/UserClass";
import { Link } from 'react-router-dom';
import Layout from '@layouts/Layout.tsx';

// Example fetch function for team data
const fetchTeam = async (id: number): Promise<TeamType[]| undefined> => {
    const response = await fetch(`/api/teams/${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};



const Team = () => {
    const league = new LeagueClass();
    const user = new UserClass();
    const permission: string = user.role;
    const updateAllowed: boolean = (permission == "SiteAdmin" || permission == "Admin");
    const allowed: boolean = updateAllowed && GetCount() == 0;

    // Replace useFetch with useQuery
    const { data, isLoading, error } = useQuery<TeamType[] | undefined>({
        queryKey: ['teamlist', league.id],
        queryFn: () => fetchTeam(league.id),
        enabled: !!league.id,
    });

    if (isLoading)
        return <div>Loading...</div>;

    if (error)
        return <div>Error: {(error as Error).message}</div>;


    if (data != undefined) {
        return (
            <Layout>
                <h3 id="tableLabel">Teams for League {league.leagueName}</h3>
                <Link to="/league/Teams/Create" hidden={!allowed}>Add</Link><br />
                <Link to="/league/Teams/Report" target="blank">Teams Report</Link>
                <table className="table table-striped" aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            <th>Team No</th>
                            <th>Skip</th>
                            <th hidden={league.teamSize < 3}>Vice Skip</th>
                            <th hidden={league.teamSize < 2}>Lead</th>
                            <th>Division</th>
                            <td hidden={allowed}></td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item =>
                            <tr key={item.id}>
                                <td>{item.teamNo}</td>
                                <td>{item.skip}</td>
                                <td hidden={league.teamSize < 3}>{item.viceSkip}</td>
                                <td hidden={league.teamSize < 2}>{item.lead}</td>
                                <td>{item.division}</td>
                                <td hidden={!updateAllowed}><Link to={`/league/Teams/Update`} state={item.id.toString()} >Update</Link><span hidden={!allowed}>|</span>
                                    <Link hidden={!allowed} to={`/league/Teams/Delete`} state={item.id.toString()} >Delete</Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Layout>
        );
    }
};

export default Team;