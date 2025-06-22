import { Link } from 'react-router-dom';
import { UpdateFormData } from "./UpdateFormData.tsx";
import LeagueClass from "@components/LeagueClass";
import UserClass from "@components/UserClass";
import Layout from '@layouts/Layout.tsx';
//import convertDate from '@components/convertDate.tsx';
import { GetCount } from '@components/CountMatches.tsx';
import { useQuery } from '@tanstack/react-query';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { Spinner } from "flowbite-react";

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

    const columns = useMemo<ColumnDef<UpdateFormData, unknown>[]>(() => [
        {
            header: 'Game Date',
            accessorKey: 'gameDate'
        },
        {
            header: 'Cancelled',
            accessorKey: 'cancelled',
            cell: info => info.getValue() ? "yes" : "no",
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
                <span hidden={!updateAllowed}>
                    <Link to={'/league/schedule/Update'} state={row.original.id.toString()} >Update</Link>
                    <span hidden={!allowed}>|</span>
                    <Link to="/League/Schedule/Delete" state={row.original.id.toString()} hidden={!allowed}>Delete</Link>
                </span>
            ),
        },
    ], [allowed, updateAllowed]);

    const table = useReactTable({
        data: data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading)
        return (
            <Layout>
                <h3 aria-label="Membership table">Schedule for League {league.leagueName}</h3>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <Spinner size="xl" />
                </div>
            </Layout>
        );

    if (error)
        return (
            <Layout>
                <h3 aria-label="Membership table">Schedule for League {league.leagueName}</h3>
                <p className="errorMessage">{(error as Error).message}</p>
            </Layout>
        );

    if (!data || data.length === 0)
        return (
            <Layout>
                <h3 aria-label="Membership table">Schedule for League {league.leagueName}</h3>
                <Link to="/League/Schedule/Create" hidden={!allowed}>Add</Link>
                <p>No Leagues</p>
            </Layout>
        );

    localStorage.setItem("schedule", JSON.stringify(data));

    return (
        <Layout>
            <h3 id="tableLabel">Schedule for League {league.leagueName}</h3>
            <Link to="/League/Schedule/Create" hidden={!allowed}>Add</Link>
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
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
                            {row.getVisibleCells().map(cell => (
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
}

export default Schedule;