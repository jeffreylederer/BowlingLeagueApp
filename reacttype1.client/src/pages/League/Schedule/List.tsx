import { Link } from 'react-router-dom';
import { UpdateFormData } from "./UpdateFormData.tsx";
import LeagueClass from "@components/LeagueClass";
import UserClass from "@components/UserClass";
import Layout from '@layouts/Layout.tsx';
import convertDate from '@components/convertDate.tsx';
import { GetCount } from '@components/CountMatches.tsx';
import { useQuery } from '@tanstack/react-query'; // Add useQuery import

const fetchSchedules = async (leagueId: number): Promise<UpdateFormData[]> => {
    const response = await fetch(`/api/schedules/${leagueId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

function Schedule() {
    const user = new UserClass();
    const league = new LeagueClass();
    const permission: string = user.role;
    const updateAllowed: boolean = (permission == "SiteAdmin" || permission == "Admin");
    const allowed: boolean = updateAllowed && GetCount() == 0;

    const { data, isLoading, error } = useQuery<UpdateFormData[]>({
        queryKey: ['schedules', league.id],
        queryFn: () => fetchSchedules(league.id),
        enabled: !!league.id,
    });

    if (isLoading)
        return <p aria-label="Loading">Loading...</p>;

    if (error)
        return <p aria-label="Error">Return Error: {(error as Error).message}</p>;

    if (data === null || (Array.isArray(data) && data.length === 0))
        return (
            <Layout>
                <h3 aria-label="Membership table">Schedule for League {league.leagueName}</h3>
                <Link to="/League/Schedule/Create" hidden={!allowed}>Add</Link>
                <p>No Leagues</p>
            </Layout>
        );

    if (data) {
        localStorage.setItem("schedule", JSON.stringify(data));
        return (
            <Layout>
                <h3 id="tableLabel">Schedule for League {league.leagueName}</h3>
                <Link to="/League/Schedule/Create" hidden={!allowed}>Add</Link>
                <table className="table table-striped" aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            <th>Game Date</th>
                            <th>Cancelled</th>
                            <th>Playoffs</th>
                            <td hidden={updateAllowed}></td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item =>
                            <tr key={item.id}>
                                <td>{convertDate(item.gameDate)}</td>
                                <td>{item.cancelled ? "yes" : "no"}</td>
                                <td>{item.playOffs ? "yes" : "no"}</td>
                                <td hidden={!updateAllowed}>
                                    <Link to={'/league/schedule/Update'} state={item.id.toString()} >Update</Link><span hidden={!allowed}>|</span>
                                    <Link to="/League/Schedule/Delete" state={item.id.toString()} hidden={!allowed}>Delete</Link></td>
                            </tr>
                        )}

                    </tbody>
                </table>

            </Layout>
        );
    }
}

export default Schedule;