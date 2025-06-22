import { Link } from 'react-router-dom';
import UpdateFormData from "./UpdateFormData.tsx";
import LeagueClass from "@components/LeagueClass";
import UserClass from "@components/UserClass";
import Layout from '@layouts/Layout.tsx';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import fetchData from '@components/fetchData';
import DisplayTablePaging from '@components/DisplayTablePaging';
import { ColumnDef } from '@tanstack/react-table';


function Players() {
    const user = new UserClass();
    const league = new LeagueClass();
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
        return <p aria-label="Loading">Loading...</p>;

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