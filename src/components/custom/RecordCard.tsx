import React from 'react'
import { Card, CardContent } from '@/components/shadcn/ui/card'
import { Badge } from '@/components/shadcn/ui/badge'
import { Button } from '@/components/shadcn/ui/button'
import {
    FileText,
    MoreHorizontal,
    Calendar,
    Edit2,
    Trash2,
    CheckCircle2,
    Clock,
    XCircle
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/shadcn/ui/dropdown-menu'
import { RECORD_TYPE_CONFIG, getStatusColor } from '@/configs/rims.config'
import { RecordType } from '@/@types/rims.types'
import { cn } from '@/components/shadcn/utils'

interface RecordAction {
    label: string
    onClick: (record: any) => void
    icon?: React.ReactNode
    variant?: 'default' | 'danger' | 'success' | 'warning'
}

interface RecordCardProps {
    record: any
    onView: (record: any) => void
    onEdit?: (record: any) => void
    onDelete?: (id: string) => void
    showActions?: boolean
    actions?: RecordAction[]
}

export const RecordCard: React.FC<RecordCardProps> = ({
    record,
    onView,
    onEdit,
    onDelete,
    showActions = true,
    actions
}) => {
    const config = RECORD_TYPE_CONFIG[(record.category || record.type || 'journal').toLowerCase() as RecordType] || RECORD_TYPE_CONFIG.journal

    const safeString = (val: any): string => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') {
            if (val.seconds !== undefined) return new Date(val.seconds * 1000).toLocaleDateString();
            return ''; // Hide complex Firestore objects/references
        }
        return String(val);
    }

    const status = safeString(record.approval_status || record.status || 'pending').toLowerCase()
    const displayStatus = safeString(record.approval_status || record.status || 'Pending')
    const displayDate = safeString(record.date || record.year || record.data?.date || record.data?.year || record.date_of_publication || record.published_date || record.grant_date || record.month_year || record.year_of_publication || record.publicationYear) || 'N/A'
    const displayTitle = safeString(record.title || record.title_of_paper || record.title_of_book || record.award_name || record.project_title || record.topic_title || record.name_of_student || 'Untitled Record')
    const displayDescription = safeString(record.data?.journalName || record.data?.conferenceName || record.data?.client || record.data?.agency || record.data?.author || record.data?.publisher || record.journal_name || record.name_of_conference || record.client || record.agency || record.author || record.publisher || record.institution_body || 'Detailed record for research evaluation.')

    return (
        <Card
            className="group relative overflow-hidden bg-card border border-muted/30 shadow-xs hover:border-primary/30 transition-all duration-300 rounded-2xl cursor-pointer h-full min-h-[220px] flex flex-col"
            onClick={() => onView(record)}
        >
            <CardContent className="p-0 relative z-10 flex flex-col h-full">
                <div className="p-5 space-y-4 flex-1 flex flex-col">
                    {/* Header: Category & Status */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="rounded-lg text-[9px] font-bold uppercase tracking-widest bg-muted/5 border-muted/50 px-2 h-5 pointer-events-none text-muted-foreground">
                                {config?.label || record.category || record.type}
                            </Badge>
                        </div>

                        {showActions && (onEdit || onDelete || (actions && actions.length > 0)) && (
                            <div onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-lg h-7 w-7 hover:bg-muted transition-all duration-300">
                                            <MoreHorizontal className="h-4 w-4 text-muted-foreground/50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-xl w-48 p-1 shadow-premium border-muted/20">
                                        {onEdit && (
                                            <DropdownMenuItem onClick={() => onEdit(record)} className="cursor-pointer gap-2 rounded-lg py-2">
                                                <Edit2 className="h-3.5 w-3.5 text-amber-500" />
                                                <span className="font-semibold text-xs text-foreground/80">Edit</span>
                                            </DropdownMenuItem>
                                        )}
                                        {onDelete && (
                                            <DropdownMenuItem onClick={() => onDelete(record.id)} className="cursor-pointer gap-2 rounded-lg py-2 text-rose-500">
                                                <Trash2 className="h-3.5 w-3.5" />
                                                <span className="font-semibold text-xs">Remove</span>
                                            </DropdownMenuItem>
                                        )}

                                        {actions?.map((action, idx) => (
                                            <DropdownMenuItem
                                                key={idx}
                                                onClick={() => action.onClick(record)}
                                                className={cn(
                                                    "cursor-pointer gap-2 rounded-lg py-2",
                                                    action.variant === 'danger' && "text-rose-500",
                                                    action.variant === 'success' && "text-emerald-500",
                                                    action.variant === 'warning' && "text-amber-500"
                                                )}
                                            >
                                                {action.icon && <span className="h-3.5 w-3.5">{action.icon}</span>}
                                                <span className="font-semibold text-xs">{action.label}</span>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2 flex-1">
                        <h3 className="text-sm font-bold leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-primary">
                            {displayTitle}
                        </h3>
                        <p className="text-[11px] text-muted-foreground/70 leading-relaxed line-clamp-2 font-medium">
                            {displayDescription}
                        </p>
                    </div>

                    {/* Metadata Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-muted/20">
                        <div className="flex items-center gap-1.5 text-muted-foreground/60">
                            <Calendar className="h-3 w-3" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">{displayDate}</span>
                        </div>

                        <Badge className={cn(
                            "rounded-full gap-1.5 px-3 py-0.5 font-bold text-[9px] uppercase tracking-widest border-none shadow-none pointer-events-none",
                            getStatusColor(status)
                        )}>
                            <span className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                status === 'pending' ? 'bg-amber-500' : (status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500')
                            )} />
                            {displayStatus}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
