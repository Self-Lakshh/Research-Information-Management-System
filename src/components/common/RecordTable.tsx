import React, { useMemo } from 'react'
import {
    MoreHorizontal,
    Edit2,
    Trash2,
    FileText,
    Calendar,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/shadcn/ui/dropdown-menu'
import { Button } from '@/components/shadcn/ui/button'
import { Badge } from '@/components/shadcn/ui/badge'
import { DataTable } from '@/components/common/DataTable'
import { SUBMISSION_TYPES, getStatusColor } from '@/configs/submission.config'
import { cn } from '@/components/shadcn/utils'
import { ColumnDef } from '@tanstack/react-table'

interface RecordAction {
    label: string
    onClick: (record: any) => void
    icon?: React.ReactNode
    variant?: 'default' | 'danger' | 'success' | 'warning'
}

interface RecordTableProps {
    records: any[]
    selectedDomain: string
    onView: (record: any) => void
    onEdit?: (record: any) => void
    onDelete?: (id: string) => void
    showActions?: boolean
    actions?: RecordAction[]
}

export const RecordTable: React.FC<RecordTableProps> = ({
    records,
    selectedDomain,
    onView,
    onEdit,
    onDelete,
    showActions = true,
    actions
}) => {
    const columns = useMemo(() => {
        const baseColumns: ColumnDef<any>[] = [
            {
                accessorKey: 'title',
                header: () => (
                    <div className="flex items-center gap-2 px-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>Research Title</span>
                    </div>
                ),
                cell: ({ row }) => {
                    const category = row.original.category || row.original.type || 'journal';
                    const config = SUBMISSION_TYPES[category.toLowerCase()] || SUBMISSION_TYPES.journal;
                    return (
                        <div className="flex items-center gap-4 py-2">
                            <div className={cn(
                                "h-11 w-11 rounded-2xl flex items-center justify-center shadow-soft border border-muted/30 transition-all duration-300 group-hover:scale-110",
                                config.color
                            )}>
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-sm tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                                    {row.original.title}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1.5">
                                    {(config?.label || category)}
                                    <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                    ID: {row.original.id.slice(0, 6).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    )
                }
            }
        ];

        let middleColumns: ColumnDef<any>[] = [];

        if (selectedDomain === 'all') {
            middleColumns = [
                {
                    accessorKey: 'author',
                    header: () => <div className="text-center font-bold">Researcher</div>,
                    cell: ({ row }) => (
                        <div className="text-center px-4">
                            <span className="text-xs font-bold text-foreground/80">
                                {row.original.author || row.original.submittedBy?.name || '-'}
                            </span>
                        </div>
                    )
                },
                {
                    accessorKey: 'category',
                    header: () => <div className="text-center font-bold">Domain</div>,
                    cell: ({ row }) => {
                        const category = row.original.category || row.original.type || 'journal';
                        const config = SUBMISSION_TYPES[category.toLowerCase()]
                        return (
                            <div className="flex justify-center px-4">
                                <Badge variant="secondary" className="rounded-[10px] h-7 text-[10px] uppercase font-bold tracking-wider bg-background shadow-soft border border-muted/50 px-3">
                                    {config?.label || category}
                                </Badge>
                            </div>
                        )
                    }
                }
            ];
        } else {
            const config = SUBMISSION_TYPES[selectedDomain.toLowerCase()];
            if (config) {
                middleColumns = config.fields
                    .filter(f => f.key !== 'title' && f.type !== 'textarea')
                    .slice(0, 3)
                    .map(field => ({
                        accessorKey: field.key,
                        header: () => <div className="text-center font-bold">{field.label}</div>,
                        cell: ({ row }: any) => (
                            <div className="text-center px-4">
                                <span className="text-xs font-bold text-foreground/80">
                                    {field.type === 'number' && typeof row.original[field.key] === 'number'
                                        ? `₹${row.original[field.key].toLocaleString()}`
                                        : (row.original[field.key] || row.original.data?.[field.key] || '-')}
                                </span>
                            </div>
                        )
                    }));
            }
        }

        const endColumns: ColumnDef<any>[] = [
            {
                accessorKey: 'date',
                header: () => (
                    <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-bold">Date</span>
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="text-center px-4 flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground tabular-nums">
                            {row.original.date || row.original.startDate || row.original.filingDate || row.original.year || '-'}
                        </div>
                    </div>
                )
            },
            {
                accessorKey: 'status',
                header: () => <div className="text-center font-bold">Status</div>,
                cell: ({ row }) => {
                    const status = (row.original.status || 'pending').toLowerCase();
                    return (
                        <div className="flex justify-center px-4">
                            <Badge className={cn(
                                "rounded-full gap-2 px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest shadow-soft border-none pointer-events-none",
                                getStatusColor(row.original.status)
                            )}>
                                <span className="relative flex h-2 w-2">
                                    <span className={cn(
                                        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                                        status === 'pending' ? 'bg-amber-400' : (status === 'approved' ? 'bg-emerald-400' : 'bg-rose-400')
                                    )}></span>
                                    <span className={cn(
                                        "relative inline-flex rounded-full h-2 w-2",
                                        status === 'pending' ? 'bg-amber-500' : (status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500')
                                    )}></span>
                                </span>
                                {row.original.status}
                            </Badge>
                        </div>
                    )
                }
            }
        ];

        return [...baseColumns, ...middleColumns, ...endColumns];
    }, [selectedDomain]);

    const rowActions = useMemo(() => {
        if (!showActions) return undefined;

        return (record: any) => {
            const items: any[] = [];

            if (onEdit) {
                items.push({
                    label: 'Edit Content',
                    onClick: () => onEdit(record),
                    icon: <Edit2 className="h-4 w-4" />
                });
            }

            if (onDelete) {
                items.push({
                    label: 'Remove Record',
                    onClick: () => onDelete(record.id),
                    icon: <Trash2 className="h-4 w-4" />,
                    variant: 'danger'
                });
            }

            if (actions) {
                actions.forEach(action => {
                    items.push({
                        ...action,
                        onClick: () => action.onClick(record)
                    });
                });
            }

            return items;
        };
    }, [onEdit, onDelete, actions, showActions]);

    return (
        <div className="overflow-hidden border-none">
            <DataTable
                columns={columns}
                data={records}
                onRowClick={onView}
                rowActions={rowActions}
            />
        </div>
    );
}
