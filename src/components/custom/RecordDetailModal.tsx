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
import { doc, getDoc, DocumentReference } from 'firebase/firestore'
import { db } from '@/configs/firebase.config'

interface RecordDetailModalProps {
    isOpen: boolean
    onClose: () => void
    record: any | null
}

const UserRefDisplay: React.FC<{ reference: DocumentReference }> = ({ reference }) => {
    const [name, setName] = React.useState<string | null>(null)

    React.useEffect(() => {
        if (reference) {
            getDoc(reference).then(snap => {
                if (snap.exists()) {
                    setName(snap.data()?.name || snap.data()?.email || 'Unknown User')
                } else {
                    setName('Deleted User')
                }
            }).catch(() => setName('Unresolved'))
        }
    }, [reference])

    if (!name) return <span className="animate-pulse text-muted-foreground/40">Loading...</span>
    return <span>{name}</span>
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
    // and correctly handle Firestore Timestamps, References, and Arrays.
    const renderValue = (val: any): React.ReactNode => {
        if (val === null || val === undefined || val === '') return <span className="text-slate-300 italic">N/A</span>;
        
        if (Array.isArray(val)) {
            if (val.length === 0) return <span className="text-slate-300 italic">None</span>;
            return val.map((item, idx) => (
                <span key={idx}>
                    {renderValue(item)}
                    {idx < val.length - 1 ? ', ' : ''}
                </span>
            ));
        }

        if (typeof val === 'string' && (val.startsWith('http') || val.startsWith('https'))) {
            return (
                <a href={val} target="_blank" rel="noreferrer" className="text-primary hover:underline group inline-flex items-center gap-1.5 font-bold">
                    View Link <ExternalLink className="w-3 h-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
            )
        }

        if (typeof val === 'object') {
            if (val.seconds !== undefined) {
                return new Date(val.seconds * 1000).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
            }
            if (val instanceof DocumentReference || (val.type === 'document' && val.path)) {
                return <UserRefDisplay reference={val} />;
            }
            if (val.path && typeof val.path === 'string' && val.path.includes('/')) {
                const ref = doc(db, val.path);
                return <UserRefDisplay reference={ref} />;
            }
            return String(val);
        }
        
        return String(val);
    }

    const displayTitle = String(record.title || record.title_of_paper || record.title_of_book || record.award_name || record.project_title || record.topic_title || record.name_of_student || 'Research Documentation');

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-slate-950 border-none rounded-[32px] shadow-3xl">
                {/* Minimized Visual Header */}
                <div className="relative p-8 overflow-hidden shrink-0 border-b border-slate-100 dark:border-slate-800">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent -z-10" />
                    
                    <div className="flex flex-col gap-4 relative">
                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className={cn("rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] border-none shadow-sm", typeConfig.badgeColor)}>
                                {typeConfig.label}
                            </Badge>

                            <Badge className={cn("rounded-full gap-2 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border-none shadow-sm", getStatusColor(status))}>
                                <div className={cn(
                                    "h-1.5 w-1.5 rounded-full animate-pulse",
                                    status === 'pending' ? 'bg-amber-400' : (status === 'approved' ? 'bg-emerald-400' : 'bg-rose-400')
                                )} />
                                {displayStatus}
                            </Badge>
                        </div>

                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                            {displayTitle}
                        </h2>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                    <div className="grid grid-cols-1 gap-10">
                        {/* Full Width Main Content Area */}
                        <div className="space-y-10">
                            <section className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">Record Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    {typeConfig.fields.map((field) => {
                                        const val = record[field.key];
                                        // Skip file fields as they are handled in the specific assets section below
                                        if (field.type === 'file') return null;

                                        return (
                                            <div key={field.key} className={cn("flex flex-col gap-1", field.gridSpan === 2 && "md:col-span-2")}>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-0.5">{field.label}</span>
                                                <div className="text-[14px] font-bold text-slate-700 dark:text-slate-200">
                                                    {renderValue(val)}
                                                </div>
                                            </div>
                                        )
                                    })}
                                    
                                    {/* Entry Lifecycle Info */}
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Entry ID</span>
                                        <span className="text-[12px] font-mono font-bold text-slate-500 break-all uppercase">{(record.id || 'N/A')}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Last Activity</span>
                                        <span className="text-[14px] font-bold text-slate-700 dark:text-slate-200">
                                            {record.updatedAt?.toDate ? record.updatedAt.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* Unified Asset Collection Logic */}
                            {(() => {
                                // Gather all files from 'file' type fields defined in the domain config
                                const configFileInputs = typeConfig.fields
                                    .filter(f => f.type === 'file')
                                    .map(f => record[f.key])
                                    .flat()
                                    .filter(Boolean);

                                // Merge with the generic 'sources' field if it exists
                                const allAssets = [...new Set([...configFileInputs, ...(Array.isArray(record.sources) ? record.sources : [])])];

                                if (allAssets.length === 0) return null;

                                return (
                                    <section className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                                <Download className="w-4 h-4" />
                                            </div>
                                            <h3 className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">Supporting Assets</h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {allAssets.map((src: any, idx: number) => {
                                                // Robust URL search in the asset object or string
                                                const url = typeof src === 'string' 
                                                    ? src 
                                                    : (src?.url || src?.fileUrl || src?.media_url || src?.document_url || src?.downloadURL || src?.link || '');
                                                
                                                if (!url) return null;

                                                let fileName = (typeof src === 'object' && src?.name) ? src.name : 'Supporting Document';
                                                try {
                                                    const decoded = decodeURIComponent(url);
                                                    const parts = decoded.split('/');
                                                    const filenameWithParams = parts[parts.length - 1];
                                                    const extractedName = filenameWithParams.split('?')[0].split('%2F').pop();
                                                    if (extractedName) fileName = extractedName;
                                                } catch (e) {}

                                                return (
                                                    <div 
                                                        key={idx} 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(url, '_blank', 'noopener,noreferrer');
                                                        }}
                                                        className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all shadow-sm group active:scale-95"
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-red-500 border border-slate-100 dark:border-slate-700 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                                <FileText className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate pr-2">
                                                                    {fileName}
                                                                </span>
                                                                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Open Resource</span>
                                                            </div>
                                                        </div>
                                                        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white transition-all">
                                                            <Download className="w-3 h-3" />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </section>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-8 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                    <Button variant="ghost" className="rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all h-12 px-8" onClick={onClose}>
                        Close Detail View
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
