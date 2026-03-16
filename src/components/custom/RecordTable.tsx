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
import { DataTable } from './DataTable'
import { RECORD_TYPE_CONFIG, getStatusColor } from '@/configs/rims.config'
import { RecordType } from '@/@types/rims.types'
import { cn } from '@/components/shadcn/utils'
import { ColumnDef } from '@tanstack/react-table'
import { doc, getDoc, DocumentReference } from 'firebase/firestore'
import { db } from '@/configs/firebase.config'

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

// A small component to resolve user references in table cells
const UserCell: React.FC<{ value: any }> = ({ value }) => {
    const [name, setName] = React.useState<string | null>(null)

    React.useEffect(() => {
        const resolve = async () => {
            if (!value) return;
            
            // Handle array of references
            if (Array.isArray(value)) {
                if (value.length === 0) {
                    setName('None');
                    return;
                }
                const names = await Promise.all(value.map(async (item) => {
                    if (item instanceof DocumentReference || (item && item.path)) {
                        const ref = item instanceof DocumentReference ? item : doc(db, item.path);
                        const snap = await getDoc(ref);
                        return snap.exists() ? (snap.data()?.name || snap.data()?.email) : 'Unknown';
                    }
                    return String(item);
                }));
                setName(names.join(', '));
                return;
            }

            // Handle single reference
            if (value instanceof DocumentReference || (value && value.path)) {
                const ref = value instanceof DocumentReference ? value : doc(db, value.path);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    setName(snap.data()?.name || snap.data()?.email || 'Unknown');
                } else {
                    setName('Deleted');
                }
            } else {
                setName(String(value));
            }
        }
        resolve().catch(() => setName('Unresolved'));
    }, [value])

    if (!name) return <span className="animate-pulse text-muted-foreground/20 italic">Loading...</span>
    return <span className="line-clamp-1">{name}</span>
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
    // Shared safety helper for rendering basic strings/dates
    const renderCellContent = (val: any, field?: any): React.ReactNode => {
        if (val === null || val === undefined || val === '') return <span className="text-muted-foreground/30 italic">N/A</span>;
        
        if (field?.type === 'user_select' || val instanceof DocumentReference || (val && val.path) || (Array.isArray(val) && val.length > 0 && (val[0] instanceof DocumentReference || val[0]?.path))) {
            return <UserCell value={val} />;
        }

        if (typeof val === 'object') {
            if (val.seconds !== undefined) {
                return new Date(val.seconds * 1000).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
            }
            return <span className="text-xs font-mono">{JSON.stringify(val)}</span>;
        }

        if (field?.type === 'select' && field.options) {
            const opt = field.options.find((o: any) => o.value === val);
            return opt ? opt.label : String(val);
        }
        
        return String(val);
    }

    const columns = useMemo(() => {
        const baseColumns: ColumnDef<any>[] = [
            {
                accessorKey: 'title',
                header: () => (
                    <div className="flex items-center gap-2 px-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>Resource Title</span>
                    </div>
                ),
                cell: ({ row }) => {
                    const category = row.original.category || row.original.type || 'journal';
                    const config = RECORD_TYPE_CONFIG[String(category).toLowerCase() as RecordType] || RECORD_TYPE_CONFIG.journal;
                    const displayTitle = String(row.original.title || row.original.title_of_paper || row.original.title_of_book || row.original.award_name || row.original.project_title || row.original.topic_title || row.original.name_of_student || 'Untitled Record');

                    return (
                        <div className="flex items-center gap-4 py-2 min-w-[250px]">
                            <div className={cn(
                                "h-11 w-11 rounded-2xl flex items-center justify-center shadow-soft border border-muted/30 transition-all duration-300 group-hover:scale-110 shrink-0",
                                config.color
                            )}>
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col gap-0.5 overflow-hidden">
                                <span className="font-bold text-sm tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                                    {displayTitle}
                                </span>
                                <span className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-widest flex items-center gap-1.5 underline decoration-primary/20 decoration-2 underline-offset-4">
                                    {config?.label || category}
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
                    accessorKey: 'domain',
                    header: () => <div className="text-center font-bold">Research Domain</div>,
                    cell: ({ row }) => {
                        const category = row.original.category || row.original.type || 'journal';
                        const config = RECORD_TYPE_CONFIG[String(category).toLowerCase() as RecordType];
                        return (
                            <div className="flex justify-center px-4">
                                <Badge variant="secondary" className="rounded-lg h-7 text-[10px] uppercase font-extrabold tracking-wider bg-background shadow-soft border border-muted/50 px-3">
                                    {config?.shortLabel || category}
                                </Badge>
                            </div>
                        )
                    }
                },
                {
                    accessorKey: 'owner',
                    header: () => <div className="text-center font-bold">Submitter / Ref</div>,
                    cell: ({ row }) => (
                        <div className="text-center px-4 max-w-[150px] mx-auto">
                            <div className="text-xs font-bold text-foreground/80 truncate">
                                {renderCellContent(row.original.faculty_ref || row.original.author || row.original.authors || row.original.inventors || row.original.principal_investigator_ref || row.original.submittedBy?.name || 'N/A')}
                            </div>
                        </div>
                    )
                }
            ];
        } else {
            const config = RECORD_TYPE_CONFIG[selectedDomain.toLowerCase() as RecordType];
            if (config) {
                // Determine which fields to skip in the middle columns
                middleColumns = config.fields
                    .filter((f: any) => 
                        !['title', 'title_of_paper', 'title_of_book', 'award_name', 'project_title', 'topic_title', 'name_of_student', 'file'].includes(f.key) && 
                        f.type !== 'textarea'
                    )
                    .map((field: any) => ({
                        accessorKey: field.key,
                        header: () => <div className="text-center font-bold">{field.label}</div>,
                        cell: ({ row }: any) => {
                            const rawVal = row.original[field.key] || row.original.data?.[field.key];
                            return (
                                <div className="text-center px-4 text-xs font-bold text-foreground/70">
                                    {renderCellContent(rawVal, field)}
                                </div>
                            )
                        }
                    }));
            }
        }

        const endColumns: ColumnDef<any>[] = [
            {
                accessorKey: 'created_at',
                header: () => <div className="text-center font-bold text-muted-foreground/40 font-mono text-[9px]">Last Updated</div>,
                cell: ({ row }) => (
                    <div className="text-center text-[10px] font-bold text-muted-foreground/60 tabular-nums">
                        {renderCellContent(row.original.updated_at || row.original.created_at)}
                    </div>
                )
            },
            {
                accessorKey: 'status',
                header: () => <div className="text-center font-bold">Audit Status</div>,
                cell: ({ row }) => {
                    const status = String(row.original.approval_status || row.original.status || 'pending').toLowerCase();
                    const displayStatus = String(row.original.approval_status || row.original.status || 'Pending');

                    return (
                        <div className="flex justify-center px-4">
                            <Badge className={cn(
                                "rounded-full gap-2 px-3 py-1 font-bold text-[9px] uppercase tracking-widest shadow-none border-none pointer-events-none",
                                getStatusColor(status)
                            )}>
                                <span className={cn(
                                    "h-1.5 w-1.5 rounded-full shrink-0",
                                    status === 'pending' ? 'bg-amber-500' : (status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500')
                                )} />
                                {displayStatus}
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
                    label: 'Update Record',
                    onClick: () => onEdit(record),
                    icon: <Edit2 className="h-4 w-4" />
                });
            }

            if (onDelete) {
                items.push({
                    label: 'Archive / Delete',
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
        <div className="overflow-hidden border-none h-full">
            <DataTable
                columns={columns}
                data={records}
                onRowClick={onView}
                rowActions={rowActions}
            />
        </div>
    );
}
