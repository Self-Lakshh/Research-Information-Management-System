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
import { SUBMISSION_TYPES, getStatusColor } from '@/configs/submission.config'
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
    const config = SUBMISSION_TYPES[record.category?.toLowerCase() || record.type?.toLowerCase() || 'journal'] || SUBMISSION_TYPES.journal

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved': return <CheckCircle2 className="h-3 w-3" />
            case 'rejected': return <XCircle className="h-3 w-3" />
            default: return <Clock className="h-3 w-3" />
        }
    }

    return (
        <Card
            className="group relative overflow-hidden border-none bg-background/40 backdrop-blur-md shadow-premium hover:shadow-hover transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.02] hover:-translate-y-2 rounded-[2rem] cursor-pointer h-full min-h-[280px] flex flex-col"
            onClick={() => onView(record)}
        >
            {/* Animated Gradient Background on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardContent className="p-0 relative z-10 flex flex-col h-full">
                {/* Visual Status Indicator (Left side glow) */}
                <div className={cn(
                    "absolute left-0 top-6 bottom-6 w-1 rounded-r-full transition-all duration-500 group-hover:w-1.5",
                    getStatusColor(record.status).split(' ')[0].replace('bg-', 'bg-opacity-50 bg-')
                )} />

                <div className="p-7 space-y-5 flex-1 flex flex-col">
                    {/* Header: Category & Status */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={cn("p-2 rounded-xl bg-background shadow-soft border border-muted/50 transition-transform duration-500 group-hover:scale-110", config.color)}>
                                <FileText className="h-4 w-4" />
                            </div>
                            <Badge variant="secondary" className="rounded-lg text-[10px] font-bold uppercase tracking-widest bg-muted/50 border-none px-2.5 h-6 pointer-events-none">
                                {config?.label || record.category || record.type}
                            </Badge>
                        </div>

                        {showActions && (onEdit || onDelete || (actions && actions.length > 0)) && (
                            <div onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 bg-background/50 backdrop-blur-sm border transition-all duration-300">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-2xl w-52 p-2 shadow-premium border-primary/5">
                                        {/* Standard Actions */}
                                        {onEdit && (
                                            <DropdownMenuItem onClick={() => onEdit(record)} className="cursor-pointer gap-3 rounded-xl py-2.5">
                                                <Edit2 className="h-4 w-4 text-amber-500" />
                                                <span className="font-semibold text-sm">Edit Content</span>
                                            </DropdownMenuItem>
                                        )}
                                        {onDelete && (
                                            <DropdownMenuItem onClick={() => onDelete(record.id)} className="cursor-pointer gap-3 rounded-xl py-2.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30">
                                                <Trash2 className="h-4 w-4" />
                                                <span className="font-semibold text-sm">Remove Record</span>
                                            </DropdownMenuItem>
                                        )}

                                        {/* Custom Actions Divider */}
                                        {(onEdit || onDelete) && actions && actions.length > 0 && (
                                            <div className="h-px bg-muted my-1 mx-2" />
                                        )}

                                        {/* Custom Actions */}
                                        {actions?.map((action, idx) => (
                                            <DropdownMenuItem
                                                key={idx}
                                                onClick={() => action.onClick(record)}
                                                className={cn(
                                                    "cursor-pointer gap-3 rounded-xl py-2.5",
                                                    action.variant === 'danger' && "text-rose-500 hover:text-rose-600 hover:bg-rose-50",
                                                    action.variant === 'success' && "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50",
                                                    action.variant === 'warning' && "text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                                                )}
                                            >
                                                {action.icon && <span className="h-4 w-4">{action.icon}</span>}
                                                <span className="font-semibold text-sm">{action.label}</span>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-3 flex-1">
                        <h3 className="text-xl font-bold leading-tight line-clamp-2 transition-colors duration-300 group-hover:text-primary">
                            {record.title}
                        </h3>
                        <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2 font-medium">
                            {record.journalName || record.conferenceName || record.client || record.agency || record.author || record.publisher || 'Detailed record for research evaluation.'}
                        </p>
                    </div>

                    {/* Metadata Footer */}
                    <div className="flex items-center justify-between pt-5 border-t border-muted/30">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className="text-[11px] font-bold uppercase tracking-wider">{record.date || record.year || 'N/A'}</span>
                            </div>
                        </div>

                        <Badge className={cn(
                            "rounded-full gap-1.5 px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest shadow-soft pointer-events-none",
                            getStatusColor(record.status)
                        )}>
                            <span className="relative flex h-2 w-2">
                                <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", record.status.toLowerCase() === 'pending' ? 'bg-amber-400' : (record.status.toLowerCase() === 'approved' ? 'bg-emerald-400' : 'bg-rose-400'))}></span>
                                <span className={cn("relative inline-flex rounded-full h-2 w-2", record.status.toLowerCase() === 'pending' ? 'bg-amber-500' : (record.status.toLowerCase() === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'))}></span>
                            </span>
                            {record.status}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
