import { Link } from 'react-router-dom';
import { TableData } from './TableData.ts';
import useLogin from '@hooks/useLogin';
import Layout from '@layouts/Layout.tsx';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from "flowbite-react";
import {ColumnDef} from '@tanstack/react-table';
import { useMemo } from 'react';
import DisplayTablePaging from '@components/DisplayTablePaging.tsx'; // Assuming you have a DisplayTable component  

function Membership() {
   const {user} = useLogin();
    const hideAddButton: boolean = !(user.role == "SiteAdmin" || user.role == "Admin");

    const { data, isLoading, isError, error } = useQuery<TableData[]>({
        queryKey: ['membershiplist'],
        queryFn: async () => {
            const response = await fetch('/api/memberships');
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }
            return response.json();
        },
    });

    const columns = useMemo<ColumnDef<TableData, unknown>[]>(() => [
        {
            header: 'Name',
            accessorKey: 'fullName',
        },
        {
            header: 'Short Name',
            accessorKey: 'shortname',
        },
        {
            header: 'Nick Name',
            accessorKey: 'nickName',
        },
        {
            header: 'Wheelchair',
            accessorKey: 'wheelchair',
            cell: info => info.getValue() ? "yes" : "no",
        },
        {
            header: '',
            id: 'actions',
            cell: ({ row }) => (
                <span hidden={hideAddButton}>
                    <Link to="/Membership/Update" state={row.original.id.toString()}>Update</Link>|
                    <Link to="/Membership/Delete" state={row.original.id.toString()}>Delete</Link>
                </span>
            ),
            meta: { hidden: hideAddButton }
        },
    ], [hideAddButton]);
  

    

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
            <Layout>
                <h3 aria-label="Membership table">Membership</h3>
                <p className="errorMessage">
                    {error instanceof Error ? error.message : "An error occurred while loading memberships."}
                </p>
            </Layout>
        );

    if (!data || data.length === 0)
        return (
            <Layout>
                <h3 aria-label="Membership table">Membership</h3>
                <Link to="/Membership/Create" hidden={hideAddButton} aria-label="Add Membership">Add</Link>
                <p>No Members</p>
            </Layout>
        );

   

    return (
        <Layout>
            <h3 aria-label="Membership table">Membership</h3>
            <Link to="/Membership/Create" hidden={hideAddButton} aria-label="Add Membership">Add</Link>
            <DisplayTablePaging<TableData> data={data} columns={columns } />
        </Layout>
    );
}

export default Membership;