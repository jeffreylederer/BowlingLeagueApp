import { Link } from 'react-router-dom';
import { UpdateFormData } from "./UpdateFormData.tsx";
import Layout from "@layouts/Layout.tsx";
import { useQuery } from '@tanstack/react-query';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table';
import { useMemo } from 'react';

// Fetch function for leagues
const fetchLeagues = async (): Promise<UpdateFormData[]> => {
    const response = await fetch('/api/leagues');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

function League() {
    const { data, isLoading, error } = useQuery<UpdateFormData[]>({
        queryKey: ['leagueslist'],
        queryFn: fetchLeagues,
        staleTime: 1000 * 60,
    });

    const columns = useMemo<ColumnDef<UpdateFormData, unknown>[]>(() => [
        {
            header: 'League Name',
            accessorKey: 'leagueName',
        },
        {
            header: 'Active',
            accessorKey: 'active',
            cell: info => info.getValue() ? "Yes" : "No",
        },
        {
            header: 'Team Size',
            accessorKey: 'teamSize',
        },
        {
            header: 'Divisions',
            accessorKey: 'divisions',
        },
        {
            header: 'Playoffs',
            accessorKey: 'playOffs',
            cell: info => info.getValue() ? "Yes" : "No",
        },
        {
            header: '',
            id: 'actions',
            cell: ({ row }) => (
                <>
                    <Link to="/Admin/League/Details" state={row.original.id.toString()}>Details</Link>|
                    <Link to="/Admin/League/Update" state={row.original.id.toString()}>Update</Link>|
                    <Link to="/Admin/League/Delete" state={row.original.id.toString()}>Delete</Link>
                </>
            ),
        },
    ], []);

    const table = useReactTable({
        data: data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading)
        return <p aria-label="Loading">Loading...</p>;

    if (error)
        return <p aria-label="Error">Return Error: {(error as Error).message}</p>;

    if (!data || data.length === 0)
        return (
            <Layout>
                <h3 id="tableLabel">Leagues</h3>
                <Link to="/Admin/League/Create">Add</Link>
                <p>No leagues</p>
            </Layout>
        );

    return (
        <Layout>
            <h3 id="tableLabel">Leagues</h3>
            <Link to="/Admin/League/Create">Add</Link>
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

export default League;