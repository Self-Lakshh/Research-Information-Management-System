import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/shadcn/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu"
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, ColumnDef, SortingState } from '@tanstack/react-table'
import React, { useState } from 'react'
import { cn } from '@/components/shadcn/utils'

interface Action {
    label: string
    onClick: () => void
    icon?: React.ReactNode
    variant?: 'default' | 'danger'
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onRowClick?: (row: TData) => void
    rowActions?: (row: TData) => Action[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onRowClick,
    rowActions
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
        },
    })

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-b">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="h-12 text-xs font-bold uppercase tracking-wider text-muted-foreground px-6">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                                {rowActions && <TableHead className="w-[50px]"></TableHead>}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={cn(
                                        "group transition-colors border-b last:border-0",
                                        onRowClick && "cursor-pointer hover:bg-muted/30"
                                    )}
                                    onClick={() => onRowClick?.(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-4 px-6 text-sm">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                    {rowActions && (
                                        <TableCell className="px-6 text-right" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-background/80 transition-colors">
                                                        <MoreHorizontal className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-2xl p-2 shadow-premium border-muted/50 w-52 animate-in fade-in zoom-in-95 duration-200">
                                                    {rowActions(row.original).map((action, i) => (
                                                        <DropdownMenuItem
                                                            key={i}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                action.onClick()
                                                            }}
                                                            className={cn(
                                                                "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group/item",
                                                                action.variant === 'danger'
                                                                    ? "text-rose-500 focus:bg-rose-50 focus:text-rose-600 dark:focus:bg-rose-950/30"
                                                                    : "text-foreground/80 focus:bg-primary/5 focus:text-primary"
                                                            )}
                                                        >
                                                            {action.icon && (
                                                                <div className={cn(
                                                                    "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
                                                                    action.variant === 'danger' ? "bg-rose-500/5" : "bg-primary/5 group-hover/item:bg-primary/10"
                                                                )}>
                                                                    {action.icon}
                                                                </div>
                                                            )}
                                                            <span className="font-bold text-xs">{action.label}</span>
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + (rowActions ? 1 : 0)} className="h-32 text-center text-muted-foreground font-medium italic">
                                    No records found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-muted/30 backdrop-blur-sm rounded-[1.5rem] border border-muted/20 shadow-soft">
                <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground/80 lowercase tracking-tight">
                    <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-xl border border-muted/50">
                        <span className="text-primary">{table.getFilteredRowModel().rows.length}</span>
                        <span>Total Records</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Rows per page</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="h-9 w-20 rounded-xl bg-background border-muted/50 font-bold focus:ring-primary/20 shadow-soft transition-all duration-300">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top" className="rounded-xl border-primary/5 shadow-premium">
                                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`} className="rounded-lg">
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground tabular-nums">
                        Page <span className="text-foreground">{table.getState().pagination.pageIndex + 1}</span>
                        <span className="text-muted-foreground/40 font-medium lowercase italic">of</span>
                        <span className="text-foreground">{table.getPageCount() || 1}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl bg-background border border-muted/50 shadow-soft hover:bg-primary/5 hover:text-primary disabled:opacity-30 transition-all duration-300"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl bg-background border border-muted/50 shadow-soft hover:bg-primary/5 hover:text-primary disabled:opacity-30 transition-all duration-300"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl bg-background border border-muted/50 shadow-soft hover:bg-primary/5 hover:text-primary disabled:opacity-30 transition-all duration-300"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl bg-background border border-muted/50 shadow-soft hover:bg-primary/5 hover:text-primary disabled:opacity-30 transition-all duration-300"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
