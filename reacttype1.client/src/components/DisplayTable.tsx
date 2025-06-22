import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    HeaderGroup,
    Row,
} from '@tanstack/react-table';

interface DisplayTableProps<T extends object> {
    data: T[];
    columns: ColumnDef<T, unknown>[];
}

function DisplayTable<T extends object>({ data, columns }: DisplayTableProps<T>) {
    const table = useReactTable({
        data: data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // If you want to support meta.hidden, keep these helpers, otherwise remove them and use all headers/cells
    const visibleHeaders = (headerGroup: HeaderGroup<T>) =>
        headerGroup.headers.filter(header => !header.column.columnDef.meta?.hidden);

    const visibleCells = (row: Row<T>) =>
        row.getVisibleCells().filter(cell => !cell.column.columnDef.meta?.hidden);

    return (
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
    );
}

export default DisplayTable;