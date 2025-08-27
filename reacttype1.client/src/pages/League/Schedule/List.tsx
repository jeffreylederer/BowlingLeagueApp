import { Link } from 'react-router-dom';
import { UpdateFormData } from "./UpdateFormData.tsx";
import useLeague from "@hooks/useLeague";
import useLogin from '@hooks/useLogin';;
import Layout from '@layouts/Layout.tsx';
import GetCount from '@components/CountMatches';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Spinner } from "flowbite-react";
import DisplayTable from '@components/DisplayTable';
import { ColumnDef } from '@tanstack/react-table';
import fetchData from '@components/fetchData';

function Schedule() {
   const {user} = useLogin();
    const { league } = useLeague();
    const permission: string = user.role;
    const updateAllowed: boolean = (permission == "SiteAdmin" || permission == "Admin");
    const allowed: boolean = updateAllowed && !GetCount();

    const { data, isLoading, error } = useQuery<UpdateFormData[]>({
        queryKey: ['schedules', league.id],
        queryFn: ()=> fetchData<UpdateFormData[]>(`/api/schedules/${league.id}`),
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
            <DisplayTable<UpdateFormData> data={data} columns={columns} />
        </Layout>
    );
}

export default Schedule;