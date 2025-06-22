import { Link } from 'react-router-dom';
import { TableData } from './TableData.ts';
import UserClass from "@components/UserClass.tsx";
import Layout from '@layouts/Layout.tsx';
import styles from "@styles/Table.module.css";
import { useQuery } from '@tanstack/react-query';
import { Spinner } from "flowbite-react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    HeaderGroup,
    Row
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

function Membership() {
    const user = new UserClass();
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

    // Pagination state
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 12;

    const table = useReactTable({
        data: data ?? [],
        columns,
        state: { pagination: { pageIndex, pageSize } },
        onPaginationChange: updater => {
            if (typeof updater === 'function') {
                const newState = updater({ pageIndex, pageSize });
                setPageIndex(newState.pageIndex);
            } else {
                setPageIndex(updater.pageIndex);
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: false,
        pageCount: Math.ceil((data?.length ?? 0) / pageSize),
    });

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

    // Filter out hidden columns for rendering
    const visibleHeaders = (headerGroup: HeaderGroup<TableData>) =>
        headerGroup.headers.filter(header => !header.column.columnDef.meta?.hidden);


    const visibleCells = (row: Row<TableData>) =>
        row.getVisibleCells().filter(cell => !cell.column.columnDef.meta?.hidden);

    return (
        <Layout>
            <h3 aria-label="Membership table">Membership</h3>
            <Link to="/Membership/Create" hidden={hideAddButton} aria-label="Add Membership">Add</Link>
            <table className={styles.table}>
                <thead className={styles.tableRowHeader}>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {visibleHeaders(headerGroup).map(header => (
                                <th className={styles.tableHeader} key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr className={styles.tableRowItems} key={row.id}>
                            {visibleCells(row).map(cell => (
                                <td className={styles.tableCell} key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                </button>
                <span>
                    Page{' '}
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>
                </span>
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                </button>
            </div>
        </Layout>
    );
}

export default Membership;