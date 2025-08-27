import { Link } from 'react-router-dom';
import UpdateFormData from "./UpdateFormData.tsx";
import useLeague from "@hooks/useLeague";
import useLogin from '@hooks/useLogin';;
import Layout from '@layouts/Layout.tsx';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import fetchData from '@components/fetchData';
import DisplayTablePaging from '@components/DisplayTablePaging';
import { ColumnDef } from '@tanstack/react-table';
import { Spinner } from "flowbite-react";

function Players() {
   const {user} = useLogin();
   const {league} = useLeague();
    const permission: string = user.role;
    const display: boolean = (permission == "SiteAdmin" || permission == "Admin");

    const { data, isLoading, error } = useQuery<UpdateFormData[], Error>({
        queryKey: ['playerslist', league.id],
        queryFn: () => fetchData<UpdateFormData[]>(`/api/players/${league.id}`),
    });

    const columns = useMemo<ColumnDef<UpdateFormData, unknown>[]>(() => [
        {
            header: 'Name',
            accessorKey: 'fullName',
        },
        {
            header: '',
            id: 'actions',
            cell: ({ row }) => (
                <>
                    <Link to="/league/Players/Delete" state={row.original.id.toString()}>Delete</Link>
                </>
            ),
            meta: { hidden: !display }
        },
    ], [display]);

    if (isLoading)
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spinner size="xl" />
                </div>
            </Layout>
        );

    if (error)
        return <p aria-label="Error">Return Error: {error.message}</p>;

    if (!data || data.length === 0)
        return <Layout>
            <h3>Players in league {league.leagueName}</h3>
            <Link to="/League/Players/Create" hidden={!display}>Add</Link>
            No Players
            <p>Number of players: {data && data.length}</p>
        </Layout>;

    return (
        <Layout>
            <h3>Players in league {league.leagueName}</h3>
            <Link to="/League/Players/Create" hidden={!display}>Add</Link>
            <DisplayTablePaging<UpdateFormData> data={data} columns={columns} />
            <p>Number of players: {data && data.length}</p>
        </Layout>
    );
}

export default Players;