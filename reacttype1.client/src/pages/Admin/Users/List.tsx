import { Link } from 'react-router-dom';
import { DetailsType } from "./DetailsType.tsx";
import Layout from "@layouts/Layout.tsx";
import UserClass from "@components/UserClass.tsx";
import { useQuery } from '@tanstack/react-query';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    HeaderGroup,
    Row,
} from '@tanstack/react-table';
import { useMemo } from 'react';

function Users() {
    const user = new UserClass();
    const permission: string = user.role;
    const allowed: boolean = permission !== "SiteAdmin";

    const { data, isLoading, isError, error } = useQuery<DetailsType[]>({
        queryKey: ['userslist'],
        queryFn: async () => {
            const response = await fetch('/api/Users');
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to fetch users');
            }
            return response.json();
        },
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

    const table = useReactTable({
        data: data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // Helper to filter out hidden columns (if needed in future)
    const visibleHeaders = (headerGroup: HeaderGroup<DetailsType>) =>
        headerGroup.headers.filter(header => !header.column.columnDef.meta?.hidden);

    const visibleCells = (row: Row<DetailsType>) =>
        row.getVisibleCells().filter(cell => !cell.column.columnDef.meta?.hidden);

    if (isLoading)
        return (
            <Layout>
                <p aria-label="Loading">Loading...</p>
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

    if (!data || data.length === 0)
        return (
            <Layout>
                <h3 id="tableLabel">Users</h3>
                <Link to="/Admin/Users/Create">Add</Link>
                <p>No Users</p>
            </Layout>
        );

    return (
        <Layout>
            <h3 id="tableLabel">Users</h3>
            <Link to="/Admin/Users/Create">Add</Link>
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
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
}

export default Users;