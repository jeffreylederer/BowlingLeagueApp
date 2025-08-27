import { useQuery } from '@tanstack/react-query';
import { TeamType } from "./TeamType.ts";
import GetCount from '@components/CountMatches';
import useLeague from "@hooks/useLeague";
import useLogin from '@hooks/useLogin';;
import { Link } from 'react-router-dom';
import Layout from '@layouts/Layout.tsx';
import { Spinner } from "flowbite-react";
import { ColumnDef } from '@tanstack/react-table';
import fetchData from '@components/fetchData.tsx'; // Assuming you have a fetchData utility function

import { useMemo } from 'react';
import DisplayTable from '@components/DisplayTable.tsx'; // Assuming you have a DisplayTable component


const Team = () => {
   const {league} = useLeague();
    const { user } = useLogin();
    const permission: string = user.role;
    const updateAllowed: boolean = (permission == "SiteAdmin" || permission == "Admin");
    const deleteAllowed: boolean = updateAllowed && !GetCount();
   

    const { data, isLoading, error } = useQuery<TeamType[] | undefined>({
        queryKey: ['teamlist', league.id],
        queryFn: () => fetchData(`/api/teams/${league.id}`),
        enabled: !!league.id,
    });

    const columns = useMemo<ColumnDef<TeamType, unknown>[]>(() => [
        {
            header: 'Team No',
            accessorKey: 'teamNo',
        },
        {
            header: 'Skip',
            accessorKey: 'skip',
        },
        {
            header: 'Vice Skip',
            accessorKey: 'viceSkip',
            cell: info => league.teamSize < 3 ? null : info.getValue(),
            meta: { hidden: league.teamSize < 3 }
        },
        {
            header: 'Lead',
            accessorKey: 'lead',
            cell: info => league.teamSize < 2 ? null : info.getValue(),
            meta: { hidden: league.teamSize < 2 }
        },
        {
            header: 'Division',
            accessorKey: 'division',
        },
        {
            header: '',
            id: 'actions',
            cell: ({ row }) => (
                <span hidden={!updateAllowed}>
                    <Link to={`/league/Teams/Update`} state={row.original.id.toString()} hidden={!updateAllowed} >Update</Link>
                    <span hidden={!deleteAllowed}>|</span>
                    <Link hidden={!deleteAllowed} to={`/league/Teams/Delete`} state={row.original.id.toString()}>Delete</Link>
                </span>
            ),
            meta: { hidden: !(deleteAllowed || updateAllowed)  }
        },
    ], [deleteAllowed, updateAllowed, league.teamSize]);

    

    if (isLoading)
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <Spinner size="xl" />
                </div>
            </Layout>
        );

    if (error)
        return (
            <Layout>
                <h3 id="tableLabel">Teams for League {league.leagueName}</h3>
                <p className="errorMessage">
                    {error instanceof Error ? error.message : "An error occurred while loading teams."}
                </p>
            </Layout>
        );

    if (!data || data.length === 0) {
        return (
            <Layout>
                <h3 id="tableLabel">Teams for League {league.leagueName}</h3>
                <Link to="/league/Teams/Create" hidden={!deleteAllowed}>Add</Link><br />
                <Link to="/league/Teams/Report" target="blank">Teams Report</Link>
                <p>No teams found.</p>
            </Layout>
        );
    }

   

    return (
        <Layout>
            <h3 id="tableLabel">Teams for League {league.leagueName}</h3>
            <Link to="/league/Teams/Create" hidden={!deleteAllowed}>Add</Link><br />
            <Link to="/league/Teams/Report" target="blank">Teams Report</Link>
            <DisplayTable<TeamType> data={data} columns={columns } />
        </Layout>
    );
};



export default Team;