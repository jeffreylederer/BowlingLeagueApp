import { Link } from 'react-router-dom';
import UpdateFormData from "./UpdateFormData.tsx";
import LeagueClass from "@components/LeagueClass";
import UserClass from "@components/UserClass";
import Layout from '@layouts/Layout.tsx';
import styles from "@styles/Table.module.css";
import { useQuery } from '@tanstack/react-query';
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

const fetchPlayers = async (leagueId: number): Promise<UpdateFormData[]> => {
    const response = await fetch(`/api/players/${leagueId}`);
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return response.json();
};

function Players() {
    const user = new UserClass();
    const league = new LeagueClass();
    const permission: string = user.role;
    const display: boolean = (permission == "SiteAdmin" || permission == "Admin");

    const { data, isLoading, error } = useQuery<UpdateFormData[], Error>({
        queryKey: ['playerslist', league.id],
        queryFn: () => fetchPlayers(league.id),
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

    // Filter out hidden columns for rendering
    const visibleHeaders = (headerGroup: HeaderGroup<UpdateFormData>) =>
        headerGroup.headers.filter(header => !header.column.columnDef.meta?.hidden);

    const visibleCells = (row: Row<UpdateFormData>) =>
        row.getVisibleCells().filter(cell => !cell.column.columnDef.meta?.hidden);

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
            <p>Number of players: {data && data.length}</p>
        </Layout>
    );
}

export default Players;