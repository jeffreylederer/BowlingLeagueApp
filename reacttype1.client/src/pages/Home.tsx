import { useEffect } from 'react';
import LeagueClass, { LeagueType } from "@components/LeagueClass.tsx";
import UserClass from '@components/UserClass';
import { useNavigate } from "react-router-dom";
import Layout from "@layouts/Layout.tsx";
import { SetCount } from '@components/CountMatches.tsx';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from "flowbite-react";

function Home() {
    const navigate = useNavigate();

    // User/session check and cleanup
    useEffect(() => {
        const user = new UserClass();
        if (user === undefined || user.id == 0)
            navigate("/Login");
        const league = new LeagueClass();
        league.Remove();
        SetCount(0);
    }, [navigate]);

    // Fetch leagues with TanStack Query
    const { data, isLoading, isError, error } = useQuery<LeagueType[]>({
        queryKey: ['leagues'],
        queryFn: async () => {
            
            const response = await fetch('/api/leagues');
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }
            return response.json();
        },
        retry: 3, // Retry up to 3 times on failure
    });

    if (isLoading) {
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spinner size="xl" />
                </div>
            </Layout>
        );
    }

    if (isError) {
        return (
            <Layout>
                <h3 id="tableLabel">Select League</h3>
                <p className="errorMessage">
                    {error instanceof Error ? error.message : "An error occurred while loading leagues."}
                </p>
            </Layout>
        );
    }

    if (data && data.length === 0) {
        return (
            <Layout>
                <h3 id="tableLabel">Select League</h3>
                <p>No leagues specified</p>
            </Layout>
        );
    }

    if (data) {
        const leagues: LeagueType[] = data.filter((word) => word.active);
        const league = new LeagueClass();
        league.Remove();
        return (
            <Layout>
                <h3 id="tableLabel">Select League</h3>
                <table className="table table-striped" aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            <th>League Name</th>
                            <th>Team Size</th>
                            <th>Divisions</th>
                            <th>Playoffs</th>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {leagues.map(data =>
                            <tr key={data.id.toString()}>
                                <td>{data.leagueName}</td>
                                <td>{data.teamSize}</td>
                                <td>{data.divisions}</td>
                                <td>{data.playOffs ? "Yes" : "No"}</td>
                                <td>
                                    <button onClick={() => {
                                        const league = new LeagueClass();
                                        league.Initialize(data);
                                        navigate("/Welcome");
                                    }}>
                                        select
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Layout>
        );
    }

    return null;
}

export default Home;