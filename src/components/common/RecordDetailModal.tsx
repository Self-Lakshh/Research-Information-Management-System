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
import { SUBMISSION_TYPES, getStatusColor } from '@/configs/submission.config'
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

    const category = (record.category || record.type || 'journal').toLowerCase()
    const typeConfig = SUBMISSION_TYPES[category] || SUBMISSION_TYPES.journal

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved': return <CheckCircle2 className="h-4 w-4" />
            case 'rejected': return <XCircle className="h-4 w-4" />
            default: return <Clock className="h-4 w-4" />
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-premium">
                <DialogHeader className="p-6 bg-gradient-to-r from-primary/5 to-transparent border-b">
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="bg-background/50 backdrop-blur-sm rounded-lg border-primary/20">
                            {typeConfig?.label || category || 'Research'}
                        </Badge>
                        <Badge className={cn("rounded-lg gap-1.5 px-3 py-1", getStatusColor(record.status))}>
                            {getStatusIcon(record.status)}
                            {record.status}
                        </Badge>
                    </div>
                    <DialogTitle className="text-2xl font-bold leading-tight">{record.title}</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="space-y-8">
                        {/* Summary Section */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-4 rounded-2xl bg-muted/30 border border-muted flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Date</span>
                                <span className="text-sm font-semibold">{record.date || record.year || 'N/A'}</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-muted/30 border border-muted flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Author/Faculty</span>
                                <span className="text-sm font-semibold">{record.faculty || record.author || 'Unspecified'}</span>
                            </div>
                            <div className="col-span-2 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">Last Updated</span>
                                <span className="text-sm font-semibold text-primary/80">{record.updatedAt || 'Recently'}</span>
                            </div>
                        </div>

                        {/* Domain Specific Data */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Record Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 p-6 rounded-2xl bg-background border shadow-inner">
                                {typeConfig ? (
                                    typeConfig.fields.map((field) => (
                                        <div key={field.key} className={cn("flex flex-col gap-1 pb-4 border-b border-muted/50 last:border-0", field.gridSpan === 2 && "sm:col-span-2")}>
                                            <span className="text-[11px] font-medium text-muted-foreground">{field.label}</span>
                                            <span className="text-sm font-medium">
                                                {field.type === 'url' ? (
                                                    <a href={record[field.key] || record.data?.[field.key]} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                                                        View Link <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    record[field.key] || record.data?.[field.key] || <span className="text-muted-foreground/50 italic">Not provided</span>
                                                )}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    record.data && Object.entries(record.data).map(([key, value]) => (
                                        <div key={key} className="flex flex-col gap-1 pb-4 border-b border-muted/50 last:border-0">
                                            <span className="text-[11px] font-medium text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="text-sm font-medium">{String(value)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="space-y-4 pb-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Download className="w-4 h-4" /> Supporting Documents
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-dashed border-muted-foreground/30 hover:bg-muted/30 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-background rounded-lg border group-hover:border-primary/50 transition-colors">
                                            <FileText className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">Supporting_Document.pdf</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">PDF Document • 2.4 MB</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-muted/30 border-t">
                    <Button variant="outline" className="rounded-xl px-8" onClick={onClose}>Close Detail</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
