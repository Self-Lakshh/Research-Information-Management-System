import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/shadcn/ui/dialog"
import { Button } from "@/components/shadcn/ui/button"
import { Calendar, User, FileText, ExternalLink, Download, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { RECORD_TYPE_CONFIG, getStatusColor } from '@/configs/rims.config'
import { RecordType } from '@/@types/rims.types'
import { cn } from "@/components/shadcn/utils"
import { Badge } from '@/components/shadcn/ui/badge'

interface RecordDetailModalProps {
    isOpen: boolean
    onClose: () => void
    record: any | null
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
    isOpen,
    onClose,
    record
}) => {
    if (!record) return null

    const category = (record.category || record.type || 'journal').toLowerCase() as RecordType
    const typeConfig = RECORD_TYPE_CONFIG[category] || RECORD_TYPE_CONFIG.journal

    const status = (record.approval_status || record.status || 'pending').toLowerCase()
    const displayStatus = record.approval_status || record.status || 'Pending'

    const getStatusIcon = (st: string) => {
        switch (st?.toLowerCase()) {
            case 'approved': return <CheckCircle2 className="h-4 w-4" />
            case 'rejected': return <XCircle className="h-4 w-4" />
            default: return <Clock className="h-4 w-4" />
        }
    }

    // A robust helper to prevent "Objects are not valid as a React child"
    // and correctly handle Firestore Timestamps.
    const safeString = (val: any): string => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') {
            if (val.seconds !== undefined) {
                return new Date(val.seconds * 1000).toLocaleDateString();
            }
            // If it's some other Firestore reference or complex object, hide it.
            return '';
        }
        return String(val);
    }

    // Alias to prevent ReferenceErrors if any old logic expects it
    const formatDate = safeString;

    const displayDate = safeString(record.data?.date || record.date || record.data?.year || record.year) || 'N/A'
    const displayFaculty = safeString(record.data?.faculty || record.faculty || record.data?.author || record.author) || 'Unspecified'

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-card border border-muted/20 rounded-2xl shadow-premium">
                <DialogHeader className="p-8 border-b border-muted/10 bg-muted/5">
                    <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold border-primary/20 bg-primary/5 text-primary rounded-md px-2 py-0.5">
                            {typeConfig?.label || category || 'Audit Record'}
                        </Badge>
                        <Badge className={cn("rounded-full gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-none shadow-none", getStatusColor(status))}>
                            <span className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                status === 'pending' ? 'bg-amber-500' : (status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500')
                            )} />
                            {displayStatus}
                        </Badge>
                    </div>
                    <DialogTitle className="text-xl font-bold leading-snug text-foreground">
                        {safeString(record.title || record.title_of_paper || record.title_of_book || record.award_name || record.project_title || record.topic_title || record.name_of_student || 'Untitled Audit Item')}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="space-y-10">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-2 gap-8 pb-8 border-b border-muted/10">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Primary Date</span>
                                <span className="text-sm font-semibold text-foreground/90">{displayDate}</span>
                            </div>
                            <div className="flex flex-col gap-1.5 text-right">
                                <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Submitter / Faculty</span>
                                <span className="text-sm font-semibold text-foreground/90">{displayFaculty}</span>
                            </div>
                        </div>

                        {/* Detailed Specs */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-primary/60" />
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Verification Details</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-y-6 gap-x-8">
                                {typeConfig ? (
                                    typeConfig.fields.map((field) => {
                                        const rawVal = record[field.key] || record.data?.[field.key]
                                        if (!rawVal && field.type === 'textarea') return null; // Skip empty textareas

                                        return (
                                            <div key={field.key} className={cn("flex flex-col gap-1.5", field.gridSpan === 2 && "sm:col-span-2")}>
                                                <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tight">{field.label}</span>
                                                <div className="text-sm font-medium text-foreground/80">
                                                    {field.type === 'url' ? (
                                                        <a href={safeString(rawVal)} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1.5 bg-primary/5 px-2 py-1 rounded-lg border border-primary/10">
                                                            External Resource <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    ) : (
                                                        safeString(rawVal) || <span className="text-muted-foreground/30 italic">Not recorded</span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    record.data && Object.entries(record.data).map(([key, value]) => (
                                        <div key={key} className="flex flex-col gap-1.5">
                                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tight">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="text-sm font-medium text-foreground/80">{safeString(value)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Audit Trail */}
                        <div className="pt-8 border-t border-muted/10 space-y-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-muted-foreground/40" />
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40">Audit Information</h3>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/5 border border-muted/10">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Entry ID</span>
                                    <span className="text-[11px] font-mono text-muted-foreground">{(record.id || 'N/A').toUpperCase()}</span>
                                </div>
                                <div className="text-right flex flex-col gap-0.5">
                                    <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">System Timestamp</span>
                                    <span className="text-[11px] text-muted-foreground">{record.updatedAt?.toDate ? record.updatedAt.toDate().toLocaleString() : 'Recent Activity'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 border-t border-muted/5 bg-muted/5">
                    <Button variant="ghost" className="rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground" onClick={onClose}>Dismiss Audit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
