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
        <div className="flex flex-col h-full rounded-2xl bg-card border border-muted/50 shadow-soft overflow-hidden">
            <Table wrapperClassName="flex-auto overflow-y-auto custom-scrollbar min-h-0">
                <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm border-b backdrop-blur-md">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="hover:bg-transparent border-0">
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} className="h-12 text-xs font-bold uppercase tracking-wider text-muted-foreground px-6 bg-muted/30">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                            {rowActions && <TableHead className="w-[50px] bg-muted/30"></TableHead>}
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

            {/* Footer / Pagination - Locked outside scroll area */}
            <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-2 h-auto sm:h-12 bg-muted/30 border-t border-muted/50">
                {/* Left side: Stats & Page size */}
                <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground/80 lowercase tracking-tight">
                    <div className="flex items-center gap-2 px-2 py-1 rounded-lg border border-muted/50 bg-background/50 shadow-sm">
                        <span className="text-primary text-xs">{table.getFilteredRowModel().rows.length}</span>
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60">Total</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 hidden sm:inline">Show</span>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => table.setPageSize(Number(value))}
                        >
                            <SelectTrigger className="h-7 w-[60px] rounded-md bg-background border-muted/50 font-bold text-[10px] ring-offset-background focus:ring-1 focus:ring-primary/20 transition-all shadow-sm translate-y-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent side="top" className="rounded-xl border-muted/30 shadow-premium">
                                {[5, 10, 20, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`} className="text-[10px] font-bold rounded-lg">
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Right side: Minimal Pagination */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground tabular-nums">
                        <span className="text-foreground">{table.getState().pagination.pageIndex + 1}</span>
                        <span className="text-muted-foreground/30 font-medium">/</span>
                        <span>{table.getPageCount() || 1}</span>
                    </div>

                    <div className="flex items-center gap-1 p-0.5 bg-background/50 border border-muted/50 rounded-lg shadow-sm">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-md hover:bg-primary/5 hover:text-primary disabled:opacity-20 transition-all duration-200"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-3 w-3" />
                        </Button>
                        <div className="w-px h-3 bg-muted/50 mx-0.5" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-md hover:bg-primary/5 hover:text-primary disabled:opacity-20 transition-all duration-200"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
