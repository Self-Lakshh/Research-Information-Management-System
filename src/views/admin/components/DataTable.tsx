import React, { useState, useRef, useEffect } from 'react'
import { MoreHorizontal } from 'lucide-react'

// ============================================
// TYPES
// ============================================

export interface Column<T> {
    key: keyof T | string
    label: string
    width?: string
    align?: 'left' | 'center' | 'right'
    render?: (value: any, row: T) => React.ReactNode
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    onRowClick?: (row: T) => void
    rowActions?: (row: T) => React.ReactNode
    isLoading?: boolean
    emptyMessage?: string
}

// ============================================
// DATA TABLE COMPONENT
// ============================================

export function DataTable<T extends { id: string | number }>({
    columns,
    data,
    onRowClick,
    rowActions,
    isLoading = false,
    emptyMessage = 'No records found'
}: DataTableProps<T>) {
    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            {columns.map((column) => (
                                <th
                                    key={column.key as string}
                                    style={{ width: column.width }}
                                    className={`px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${column.align === 'center'
                                            ? 'text-center'
                                            : column.align === 'right'
                                                ? 'text-right'
                                                : ''
                                        }`}
                                >
                                    {column.label}
                                </th>
                            ))}
                            {rowActions && <th className="w-10 px-6 py-4"></th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (rowActions ? 1 : 0)}
                                    className="px-6 py-12 text-center"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <p className="text-sm text-muted-foreground">Loading records...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (rowActions ? 1 : 0)}
                                    className="px-6 py-12 text-center"
                                >
                                    <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr
                                    key={row.id}
                                    onClick={() => onRowClick?.(row)}
                                    className={`group hover:bg-muted/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''
                                        }`}
                                >
                                    {columns.map((column) => {
                                        const value = (row as any)[column.key]
                                        return (
                                            <td
                                                key={column.key as string}
                                                className={`px-6 py-4 ${column.align === 'center'
                                                        ? 'text-center'
                                                        : column.align === 'right'
                                                            ? 'text-right'
                                                            : ''
                                                    }`}
                                            >
                                                {column.render ? column.render(value, row) : (
                                                    <span className="text-sm text-foreground">
                                                        {value ? String(value) : '-'}
                                                    </span>
                                                )}
                                            </td>
                                        )
                                    })}
                                    {rowActions && (
                                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            {rowActions(row)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                    Showing {data.length} records
                </span>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-xs font-medium rounded-md border border-border bg-background disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 text-xs font-medium rounded-md border border-border bg-background disabled:opacity-50" disabled>Next</button>
                </div>
            </div>
        </div>
    )
}

// ============================================
// TABLE ACTION MENU COMPONENT
// ============================================

interface Action {
    label: string
    onClick: () => void
    icon?: React.ReactNode
    variant?: 'default' | 'danger'
}

interface TableActionMenuProps {
    actions: Action[]
}

export const TableActionMenu: React.FC<TableActionMenuProps> = ({ actions }) => {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-lg hover:bg-muted border border-transparent hover:border-border transition-all"
            >
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                action.onClick()
                                setIsOpen(false)
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted ${action.variant === 'danger'
                                    ? 'text-rose-500'
                                    : 'text-foreground'
                                }`}
                        >
                            {action.icon && <span className="opacity-70">{action.icon}</span>}
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
