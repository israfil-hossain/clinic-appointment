'use client';

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as ReactTableInstance,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ActionButton<TData> {
  label: string;
  icon?: React.ElementType;
  iconClassName?: string;
  className?: string;
  onClick: (table: ReactTableInstance<TData>) => void;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  DataTableToolbar?: (props: { table: ReactTableInstance<TData> }) => JSX.Element;
  actionButtons?: ActionButton<TData>[];
  isPaginate?: boolean;
  pagination?: any; // Add specific type if pagination object structure is known
  className?: string;
  classNameHeader?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  DataTableToolbar,
  actionButtons = [],
  isPaginate = true,
  pagination,
  className,
  classNameHeader,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnFilters, setColumnFilters] = React.useState<any[]>([]);
  const [sorting, setSorting] = React.useState<any[]>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className={cn("border rounded-b-lg overflow-hidden", className)}>
      <div className="flex justify-between">
        {Object.keys(rowSelection)?.length > 0 ? (
          <div className="w-full h-12 flex items-center px-4 bg-gray-100 border-b">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
              className="translate-y-[2px] mr-4"
            />

            {actionButtons.map((button, index) => (
              <button
                key={index}
                className={cn(
                  "ml-2 font-semibold flex justify-center items-center w-32 text-[15px] bg-white shadow-md hover:shadow-lg px-2 rounded-full border",
                  button.className
                )}
                onClick={() => button?.onClick(table)}
              >
                {button.icon && (
                  <button.icon
                    className={cn("w-8 h-8 px-2", button.iconClassName)}
                  />
                )}
                {button.label}
              </button>
            ))}
          </div>
        ) : (
          DataTableToolbar && <DataTableToolbar table={table} />
        )}
      </div>
      <div>
        <Table>
          {Object.keys(rowSelection)?.length === 0 && (
            <TableHeader className={cn("", classNameHeader)}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          )}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="data-[state=selected]:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="py-2.5" key={cell.id}>
                      {flexRender(
                        cell?.column?.columnDef.cell,
                        cell?.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-16 text-base text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {isPaginate && pagination && (
        <DataTablePagination pagination={pagination} table={table} />
      )}
    </div>
  );
}
