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
    XCircle,
    User
} from 'lucide-react'
import { DocumentReference, getDoc, doc } from 'firebase/firestore'
import { db } from '@/configs/firebase.config'
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
    className?: string
}

const CardUserDisplay: React.FC<{ reference: any }> = ({ reference }) => {
    const [name, setName] = React.useState<string>('...')

    React.useEffect(() => {
        if (!reference) {
            setName('N/A')
            return
        }
        
        const resolve = async () => {
            try {
                // If it's an array, just show "Multiple" or first name
                if (Array.isArray(reference)) {
                    if (reference.length === 0) return setName('N/A')
                    const first = reference[0]
                    if (first instanceof DocumentReference || (first?.path)) {
                        const snap = await getDoc(first instanceof DocumentReference ? first : doc(db, first.path))
                        setName(snap.exists() ? (snap.data()?.name || 'User') : 'User')
                        if (reference.length > 1) setName(prev => `${prev} +${reference.length - 1}`)
                    } else {
                        setName(String(first))
                    }
                } else if (reference instanceof DocumentReference || (reference?.path)) {
                    const snap = await getDoc(reference instanceof DocumentReference ? reference : doc(db, reference.path))
                    setName(snap.exists() ? (snap.data()?.name || 'User') : 'User')
                } else {
                    setName(String(reference))
                }
            } catch {
                setName('User')
            }
        }
        resolve()
    }, [reference])

    return <span>{name}</span>
}

export const RecordCard: React.FC<RecordCardProps> = ({
    record,
    onView,
    onEdit,
    onDelete,
    showActions = true,
    actions,
    className
}) => {
    const config = RECORD_TYPE_CONFIG[(record.category || record.type || 'journal').toLowerCase() as RecordType] || RECORD_TYPE_CONFIG.journal

    const safeString = (val: any): string => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') {
            if (val.seconds !== undefined) {
                return new Date(val.seconds * 1000).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
            }
            return '';
        }
        return String(val);
    }

    const status = (record.approval_status || 'pending').toLowerCase()
    const displayStatus = record.approval_status || 'Pending'
    const displayDate = safeString(record.published_date || record.date_of_publication || record.grant_date || record.date || record.event_date || record.updatedAt) || 'N/A'
    const displayTitle = String(record.title || record.title_of_paper || record.title_of_book || record.award_name || record.project_title || record.topic_title || record.name_of_student || 'Untitled Record')
    const userRef = record.authors || record.author || record.inventors || record.principal_investigator_ref || record.recipient_ref || record.faculty_ref

    return (
        <Card
            className={cn(
                "group relative overflow-hidden bg-card border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-500 rounded-[24px] cursor-pointer flex flex-col w-full sm:w-[340px] h-[220px]",
                className
            )}
            onClick={() => onView(record)}
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardContent className="p-6 flex flex-col h-full relative z-10">
                <div className="flex flex-col h-full justify-between">
                    {/* Top Row: Domain & Actions */}
                    <div className="flex items-center justify-between">
                        <Badge variant="outline" className={cn("rounded-full text-[10px] font-bold uppercase tracking-widest px-3 py-1 border-none shadow-sm flex items-center gap-2", config.badgeColor)}>
                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                            {config?.label || record.category || record.type}
                        </Badge>

                        {showActions && (onEdit || onDelete || (actions && actions.length > 0)) && (
                            <div onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-xl w-48 p-1 shadow-2xl border-slate-200 dark:border-slate-800">
                                        {onEdit && (
                                            <DropdownMenuItem onClick={() => onEdit(record)} className="cursor-pointer gap-2 rounded-lg py-2 focus:bg-primary/5 focus:text-primary">
                                                <Edit2 className="h-3.5 w-3.5" />
                                                <span className="font-bold text-xs">Edit Record</span>
                                            </DropdownMenuItem>
                                        )}
                                        {onDelete && (
                                            <DropdownMenuItem onClick={() => onDelete(record.id)} className="cursor-pointer gap-2 rounded-lg py-2 text-rose-500 focus:bg-rose-50 focus:text-rose-600">
                                                <Trash2 className="h-3.5 w-3.5" />
                                                <span className="font-bold text-xs">Delete</span>
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>

                    {/* Middle: Title */}
                    <div className="mt-4">
                        <h3 className="text-[17px] font-extrabold text-slate-900 dark:text-white leading-[1.3] line-clamp-2 group-hover:text-primary transition-colors duration-300">
                            {displayTitle}
                        </h3>
                    </div>

                    {/* Bottom: Info Row */}
                    <div className="mt-auto pt-4 flex items-end justify-between">
                        <div className="flex flex-col gap-1.5 min-w-0">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <User className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                                <span className="text-[11px] font-bold truncate max-w-[140px]">
                                    <CardUserDisplay reference={userRef} />
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                <span className="text-[10px] font-bold">{displayDate}</span>
                            </div>
                        </div>

                        <Badge className={cn(
                            "rounded-lg px-3 py-1 font-bold text-[9px] uppercase tracking-widest border-none shadow-none shrink-0 mb-0.5",
                            getStatusColor(status)
                        )}>
                            {displayStatus}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
