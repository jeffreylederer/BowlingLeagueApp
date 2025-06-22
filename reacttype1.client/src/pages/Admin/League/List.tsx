import { Link } from 'react-router-dom';
import { UpdateFormData } from "./UpdateFormData.tsx";
import Layout from "@layouts/Layout.tsx";
import { useQuery } from '@tanstack/react-query';
import DisplayTable from '@components/DisplayTable';
import { ColumnDef } from '@tanstack/react-table';
import fetchData from '@components/fetchData.tsx';
import { useMemo } from 'react';
import { Spinner } from "flowbite-react";

function League() {
    const { data, isLoading, error } = useQuery<UpdateFormData[]>({
        queryKey: ['leagueslist'],
        queryFn: () => fetchData<UpdateFormData[]>('/api/leagues'),    
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

    if (isLoading)
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spinner size="xl" />
                </div>
            </Layout>
        );

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
            <DisplayTable<UpdateFormData> data={data} columns={columns} />
        </Layout>
    );
}

export default League;