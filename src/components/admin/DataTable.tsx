import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shadcn/ui/table"
import { cn } from "@/components/shadcn/utils"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu"
import { Button } from "@/components/shadcn/ui/button"

interface Column<T> {
    key: string
    label: string
    render?: (value: any, row: T) => React.ReactNode
    width?: string
    align?: 'left' | 'center' | 'right'
}

interface Action {
    label: string
    onClick: () => void
    icon?: React.ReactNode
    variant?: 'default' | 'danger'
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    onRowClick?: (row: T) => void
    rowActions?: (row: T) => Action[]
    className?: string
}

export function DataTable<T extends { id: string | number }>({
    columns,
    data,
    onRowClick,
    rowActions,
    className
}: DataTableProps<T>) {
    return (
        <div className={cn("rounded-md border bg-card", className)}>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col) => (
                            <TableHead
                                key={col.key}
                                style={{ width: col.width }}
                                className={cn(
                                    col.align === 'center' && "text-center",
                                    col.align === 'right' && "text-right"
                                )}
                            >
                                {col.label}
                            </TableHead>
                        ))}
                        {rowActions && <TableHead className="w-[50px]"></TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((row) => (
                            <TableRow
                                key={row.id}
                                className={cn(onRowClick && "cursor-pointer")}
                                onClick={() => onRowClick?.(row)}
                            >
                                {columns.map((col) => (
                                    <TableCell
                                        key={col.key}
                                        className={cn(
                                            col.align === 'center' && "text-center",
                                            col.align === 'right' && "text-right"
                                        )}
                                    >
                                        {col.render
                                            ? col.render((row as any)[col.key], row)
                                            : (row as any)[col.key]
                                        }
                                    </TableCell>
                                ))}
                                {rowActions && (
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {rowActions(row).map((action, i) => (
                                                    <DropdownMenuItem
                                                        key={i}
                                                        onClick={action.onClick}
                                                        className={cn(action.variant === 'danger' && "text-destructive focus:text-destructive")}
                                                    >
                                                        {action.icon && <span className="mr-2">{action.icon}</span>}
                                                        {action.label}
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
                            <TableCell colSpan={columns.length + (rowActions ? 1 : 0)} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
