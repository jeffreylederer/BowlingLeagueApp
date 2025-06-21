import LeagueClass from "@components//LeagueClass.tsx";
import Layout from "@layouts/Layout.tsx";
import UserClass from "@components/UserClass";
import { SetCount } from '@components/CountMatches.tsx';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from "flowbite-react";

function Welcome() {
    const league = new LeagueClass();
    const user = new UserClass();

    const { data, isLoading, isError, error } = useQuery<number>({
        queryKey: ['all-matches-count', league.id],
        queryFn: async () => {
            const response = await fetch(`api/matches/GetAllMatches/${league.id}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }
            return response.json();
        },
        retry: 3
    });

    if (isLoading)
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spinner size="xl" />
                </div>
            </Layout>
        );

    if (isError)
        return (
            <p aria-label="Error">
                {error instanceof Error ? error.message : "An error occurred while loading match count."}
            </p>
        );

    if (data != null) {
        SetCount(data);
        return (
            <Layout>
                <h3>Welcome to {league.leagueName}</h3>
                <div className="toLeft">
                    <h4>Current Role: {user.role} </h4>
                    <dl>
                        <dt>Observers</dt>
                        <dd>They can view all screens and reports in the league </dd>
                    </dl>
                    <dl>
                        <dt>Scorers</dt>
                        <dd>They can score matches and view all screens and reports in the league </dd>
                    </dl>
                    <dl>
                        <dt>League Administrators</dt>
                        <dd>They can edit the membership, players and schedule in the league, create and score matches </dd>
                    </dl>
                    <dl>
                        <dt>Site Administrators</dt>
                        <dd>They can be league administrator for any league and create leagues and users. </dd>
                    </dl>
                </div>
            </Layout>
        );
    }

    return null;
}

export default Welcome;