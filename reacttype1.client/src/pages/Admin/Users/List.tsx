import { Link } from 'react-router-dom';
import { DetailsType } from "./DetailsType.tsx";
import Layout from "@layouts/Layout.tsx";
import useLogin from '@hooks/useLogin';
import { useQuery } from '@tanstack/react-query';
import DisplayTable from '@components/DisplayTable';
import { ColumnDef } from '@tanstack/react-table';
import fetchData from '@components/fetchData.tsx';
import { useMemo } from 'react';
import { Spinner } from "flowbite-react";

function Users() {
   const {user} = useLogin();
    const permission: string = user.role;
    const allowed: boolean = permission !== "SiteAdmin";

    const { data, isLoading, isError, error } = useQuery<DetailsType[]>({
        queryKey: ['userslist'],
        queryFn: () => fetchData<DetailsType[]>('/api/Users')
    });

    const columns = useMemo<ColumnDef<DetailsType, unknown>[]>(() => [
        {
            header: 'Users Name',
            accessorKey: 'userName',
        },
        {
            header: 'Active',
            accessorKey: 'isActive',
            cell: info => info.getValue() ? "Yes" : "No",
        },
        {
            header: 'Display Name',
            accessorKey: 'displayName',
        },
        {
            header: 'Role',
            accessorKey: 'role',
        },
        {
            header: '',
            id: 'actions',
            cell: ({ row }) => (
                <>
                    <Link to="/Admin/Users/Update" state={row.original.id.toString()}>Update</Link>|
                    <Link to="/Admin/Users/Delete" state={row.original.id.toString()}>Delete</Link>
                    <span hidden={allowed}>|</span>
                    <Link hidden={allowed} to="/Admin/Users/ChangePassword" state={row.original.id.toString()}>Change Password</Link>
                </>
            ),
            meta: { hidden: false }
        },
    ], [allowed]);

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
                <h3 id="tableLabel">Users</h3>
                <p className="errorMessage">
                    {error instanceof Error ? error.message : "Unknown error"}
                </p>
            </Layout>
        );

    if (data) {
        return (
            <Layout>
                <h3 id="tableLabel">Users</h3>
                <Link to="/Admin/Users/Create">Add</Link>
                <DisplayTable<DetailsType> data={data} columns={columns} />
            </Layout>
        );
    }
}

export default Users;