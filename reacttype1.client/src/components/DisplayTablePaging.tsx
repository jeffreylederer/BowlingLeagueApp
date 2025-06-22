import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    HeaderGroup,
    Row,
    getPaginationRowModel

} from '@tanstack/react-table';
import { useState } from 'react';


interface DisplayTableProps<T extends object> {
    data: T[];
    columns: ColumnDef<T, unknown>[];
}

function DisplayTablePaging<T extends object>({ data, columns }: DisplayTableProps<T>) {

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

    // If you want to support meta.hidden, keep these helpers, otherwise remove them and use all headers/cells
    const visibleHeaders = (headerGroup: HeaderGroup<T>) =>
        headerGroup.headers.filter(header => !header.column.columnDef.meta?.hidden);

    const visibleCells = (row: Row<T>) =>
        row.getVisibleCells().filter(cell => !cell.column.columnDef.meta?.hidden);

    


    return (
        <>
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
        </> 
    );


}

export default DisplayTablePaging;