import { useEffect } from 'react';
import LeagueClass, { LeagueType } from "@components/LeagueClass.tsx";
import UserClass from '@components/UserClass';
import { useNavigate } from "react-router-dom";
import Layout from "@layouts/Layout.tsx";
import { SetCount } from '@components/CountMatches.tsx';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from "flowbite-react";
import fetchData from '@components/fetchData.tsx'; // Adjust the import path as necessary
import DisplayTable from '@components/DisplayTable';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

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
        queryFn: () => fetchData<LeagueType[]>('/api/leagues'),

        retry: 3, // Retry up to 3 times on failure
    });

    
    const columns = useMemo<ColumnDef<LeagueType, unknown>[]>(() => [
        {
            header: 'League Name',
            accessorKey: 'leagueName'
        },
        {
            header: 'Team Size',
            accessorKey: 'teamSize'
        },
        {
            header: 'Divisions',
            accessorKey: 'divisions'
        },
        {
            header: 'Playoffs',
            accessorKey: 'playOffs',
            cell: info => info.getValue() ? "yes" : "no",
        },
        {
            header: '',
            id: 'actions',
            cell: ({ row }) => (
                <button onClick={() => {
                    if (data === undefined || data.length === 0) {
                        return;
                    }
                    const record = data.find((item) => item.id === row.original.id);
                    if (record != undefined) {
                        const league = new LeagueClass();
                        league.Initialize(record);
                    }
                    navigate("/Welcome");
                }}>Select</button>


            ),
        }
    ], [navigate, data]);
       
  

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
                <DisplayTable<LeagueType> data={leagues} columns={columns} />
            </Layout>
        );
    }

    return null;
}

export default Home;