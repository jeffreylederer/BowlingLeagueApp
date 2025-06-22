import { useQuery } from '@tanstack/react-query';
import { TeamType } from "./TeamType.ts";
import { GetCount } from '@components/CountMatches.tsx';
import LeagueClass from "@components/LeagueClass";
import UserClass from "@components/UserClass";
import { Link } from 'react-router-dom';
import Layout from '@layouts/Layout.tsx';
import { Spinner } from "flowbite-react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    HeaderGroup,
    Row
} from '@tanstack/react-table';
import { useMemo } from 'react';

const fetchTeam = async (id: number): Promise<TeamType[] | undefined> => {
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
    const deleteAllowed: boolean = updateAllowed && GetCount() == 0;

    const { data, isLoading, error } = useQuery<TeamType[] | undefined>({
        queryKey: ['teamlist', league.id],
        queryFn: () => fetchTeam(league.id),
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

    const table = useReactTable({
        data: data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

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

    // Filter out hidden columns for rendering
    const visibleHeaders = (headerGroup: HeaderGroup<TeamType>) =>
        headerGroup.headers.filter(header => !header.column.columnDef.meta?.hidden);


    const visibleCells = (row: Row<TeamType>) =>
        row.getVisibleCells().filter(cell => !cell.column.columnDef.meta?.hidden);

    return (
        <Layout>
            <h3 id="tableLabel">Teams for League {league.leagueName}</h3>
            <Link to="/league/Teams/Create" hidden={!deleteAllowed}>Add</Link><br />
            <Link to="/league/Teams/Report" target="blank">Teams Report</Link>
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    {table.getHeaderGroups().map(headerGroup  => (
                        <tr key={headerGroup.id}>
                            {visibleHeaders(headerGroup).map(header => (
                                <th key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {visibleCells(row).map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
};



export default Team;