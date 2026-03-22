import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/shadcn/ui/dialog"
import { Button } from "@/components/shadcn/ui/button"
import { Calendar, User, FileText, ExternalLink, Download, Clock, CheckCircle2, XCircle, Copy, Link as LinkIcon, Trash2, Edit2 } from 'lucide-react'
import { AssetRow } from './AssetRow'
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
    onEdit?: (record: any) => void
    onDelete?: (id: string) => void
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


const DocumentRefAsset: React.FC<{ reference: any }> = ({ reference }) => {
    const [data, setData] = React.useState<any | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const resolveToken = async () => {
            if (!reference) return
            try {
                // Determine the correct reference regardless of whether it was passed as ID or Path
                let resolvedRef = reference;
                if (typeof reference === 'string') {
                    // It's likely a document ID or a full path string
                    resolvedRef = reference.includes('/') ? doc(db, reference) : doc(db, 'documents', reference);
                }

                const snap = await getDoc(resolvedRef as DocumentReference)
                if (snap.exists()) {
                    const dData = snap.data();
                    setData({
                        ...dData,
                        id: snap.id,
                        name: dData.document_name || dData.name || 'Supporting Document',
                        url: dData.file_url || dData.url || dData.media_url || ''
                    })
                } else {
                    setData({ id: 'missing', name: 'Document Not Found', type: 'error' })
                }
            } catch (err) {
                console.error("Asset resolution failed:", err)
                setData({ id: 'error', name: 'Resolution Error', type: 'error' })
            } finally {
                setLoading(false)
            }
        }
        resolveToken()
    }, [reference])

    if (loading) return (
        <div className="h-[180px] rounded-[24px] bg-slate-50/50 dark:bg-slate-900/50 animate-pulse border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resolving Asset...</span>
        </div>
    )
    
    if (!data || data.type === 'error' || data.id === 'missing') {
        const isMissing = data?.id === 'missing';
        return (
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-700/50 bg-zinc-50/50 dark:bg-zinc-700/50 grayscale opacity-60">
                <XCircle className="w-5 h-5 text-rose-400" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{isMissing ? 'Missing Reference' : 'Broken Link'}</span>
                    <span className="text-[12px] font-bold text-zinc-500 italic">Reference could not be resolved</span>
                </div>
            </div>
        )
    }

    return (
        <AssetRow 
            url={data.file_url || data.url || data.media_url || ''} 
            fileName={data.document_name || data.name || 'Supporting Document'} 
            label={data.document_type || 'Research Resource'}
            isExisting={true}
        />
    )
}


export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
    isOpen,
    onClose,
    record,
    onEdit,
    onDelete
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
            if (val instanceof DocumentReference || (val.path && typeof val.path === 'string')) {
                // Heuristic: Documents live in various collections, but Users have a specific shape
                // If the path includes 'documents' or 'media' or 'proof', treat it as an asset-style reference
                const path = val.path || '';
                if (path.includes('documents') || path.includes('media')) {
                    return <DocumentRefAsset reference={val} />;
                }
                return <UserRefDisplay reference={val} />;
            }
            if (val.path && typeof val.path === 'string' && val.path.includes('/')) {
                const ref = doc(db, val.path);
                if (val.path.includes('documents')) return <DocumentRefAsset reference={ref} />;
                return <UserRefDisplay reference={ref} />;
            }
            return String(val);
        }
        
        return String(val);
    }

    const displayTitle = String(record.title || record.title_of_paper || record.title_of_book || record.award_name || record.project_title || record.topic_title || record.name_of_student || 'Research Documentation');

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-zinc-800 border-none rounded-[32px] shadow-3xl">
                <DialogHeader className="p-8 pb-4 shrink-0 border-b border-zinc-100 dark:border-zinc-700 relative overflow-hidden">
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

                        <DialogTitle className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                            {displayTitle}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            Research record details, status, and supporting assets for {displayTitle}.
                        </DialogDescription>
                    </div>
                </DialogHeader>

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
                                         <span className="text-[12px] font-mono font-bold text-slate-500 break-all uppercase underline decoration-primary/20 decoration-2 underline-offset-4">{(record.id || 'N/A')}</span>
                                     </div>
                                     <div className="flex flex-col gap-1">
                                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Registration Date</span>
                                         <span className="text-[14px] font-bold text-slate-700 dark:text-slate-200">
                                             {renderValue(record.created_at || record.createdAt || record.upload_date)}
                                         </span>
                                     </div>
                                     <div className="flex flex-col gap-1">
                                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Last Modification</span>
                                         <span className="text-[14px] font-bold text-slate-700 dark:text-slate-200">
                                            {renderValue(record.updated_at || record.updatedAt || record.last_modified)}
                                         </span>
                                     </div>
                                </div>
                            </section>

                            {/* Unified Asset Collection Logic */}
                             {(() => {
                                 // A highly aggressive harvester that checks multiple potential sources for media/files
                                 const getFrom = (obj: any) => {
                                     if (!obj) return [];
                                     return [
                                         ...(Array.isArray(obj.sources) ? obj.sources : []),
                                         ...(Array.isArray(obj.documents) ? obj.documents : []),
                                         ...(Array.isArray(obj.files) ? obj.files : []),
                                         ...(Array.isArray(obj.media) ? obj.media : []),
                                         ...(obj.document_id ? [obj.document_id] : []),
                                         ...(obj.file_url ? [obj.file_url] : []),
                                         ...(obj.url ? [obj.url] : []),
                                         ...(obj.media_url ? [obj.media_url] : []),
                                         ...(obj.ipr_proof ? [obj.ipr_proof] : []),
                                         ...(obj.certificate ? [obj.certificate] : []),
                                         ...(obj.proof_url ? [obj.proof_url] : []),
                                         ...(obj.supporting_document ? [obj.supporting_document] : []),
                                         ...(obj.attachment ? [obj.attachment] : []),
                                         ...(obj.web_link ? [obj.web_link] : []),
                                         ...(obj.link ? [obj.link] : []),
                                     ];
                                 };

                                 // Gather all files from 'file' and 'url' type fields defined in the domain config
                                 const configFileInputs = typeConfig.fields
                                     .filter(f => f.type === 'file' || f.type === 'url')
                                     .map(f => {
                                         const val = record[f.key] || record.data?.[f.key];
                                         if (!val) return null;
                                         
                                         // If it's a URL field, we might want to brand it differently
                                         if (f.type === 'url' && typeof val === 'string') {
                                             return { 
                                                 url: val, 
                                                 name: f.label,
                                                 label: f.label
                                             };
                                         }
                                         return val;
                                     })
                                     .flat()
                                     .filter(Boolean);

                                 const allPotentialSources = [
                                     ...configFileInputs,
                                     ...getFrom(record),
                                     ...getFrom(record.data)
                                 ].filter(s => {
                                     if (!s) return false;
                                     if (typeof s === 'string' && s.length < 5) return false;
                                     if (typeof s === 'object' && Object.keys(s).length === 0) return false;
                                     return true;
                                 });

                                 const seen = new Set();
                                 const allAssets = allPotentialSources.filter(s => {
                                     if (!s) return false;
                                     let key;
                                     if (typeof s === 'string') {
                                         // Normalize paths and IDs to just the ID; keep URLs as is
                                         key = (s.startsWith('http') || s.startsWith('/')) ? s : s.split('/').pop();
                                     }
                                     else if (s.path && typeof s.path === 'string') key = s.path.split('/').pop();
                                     else if (s.id && typeof s.id === 'string') key = s.id;
                                     else if (s.file_url || s.url || s.media_url) key = s.file_url || s.url || s.media_url;
                                     else key = JSON.stringify(s);

                                     if (seen.has(key)) return false;
                                     seen.add(key);
                                     return true;
                                 });

                                 if (allAssets.length === 0) {
                                     return (
                                        <div className="p-8 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No Supporting Assets</p>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">Check the domain configuration or upload data</p>
                                            </div>
                                        </div>
                                     );
                                 }

                                return (
                                    <section className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                                <Download className="w-4 h-4" />
                                            </div>
                                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Supporting Assets & Documents</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                             {allAssets.map((src: any, idx: number) => {
                                                 // Check if it's a reference or an ID (string that is NOT a URL)
                                                 const isRef = src instanceof DocumentReference || (src?.path && typeof src?.path === 'string');
                                                 const isId = typeof src === 'string' && !src.startsWith('http') && src.length > 5;

                                                 if (isRef || isId) {
                                                     const ref = isRef ? (src instanceof DocumentReference ? src : doc(db, src.path)) : src;
                                                     return <DocumentRefAsset key={idx} reference={ref} />;
                                                 }

                                                 const url = typeof src === 'string' 
                                                     ? src 
                                                     : (src?.file_url || src?.url || src?.fileUrl || src?.media_url || src?.document_url || src?.downloadURL || src?.link || '');
                                                 
                                                 if (!url) return null;

                                                 let fileName = (typeof src === 'object' && src?.name) ? src.name : 'Supporting Document';
                                                 let label = (typeof src === 'object' && src?.label) ? src.label : 'Storage Link';
                                                 
                                                 // Extract cleaner filename if possible
                                                 try {
                                                     const decoded = decodeURIComponent(url);
                                                     const parts = decoded.split('/');
                                                     const filenameWithParams = parts[parts.length - 1];
                                                     const extractedName = filenameWithParams.split('?')[0].split('%2F').pop();
                                                     if (extractedName && extractedName.includes('.')) fileName = extractedName;
                                                 } catch (e) {}

                                                 return (
                                                     <AssetRow 
                                                         key={idx}
                                                         url={url}
                                                         fileName={fileName}
                                                         label={label}
                                                         isExisting={true}
                                                     />
                                                 );
                                             })}
                                        </div>
                                    </section>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-zinc-50/50 dark:bg-zinc-700/50 border-t border-zinc-100 dark:border-zinc-700/50 flex items-center justify-between sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {onDelete && (
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-10 w-10 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl"
                                onClick={() => {
                                    onDelete(record.id);
                                    onClose();
                                }}
                            >
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        )}
                        {onEdit && (
                            <Button 
                                variant="outline" 
                                className="rounded-xl border-slate-200 dark:border-slate-700 font-bold text-xs gap-2 h-10 px-6 hover:bg-primary/5 hover:text-primary transition-all duration-300"
                                onClick={() => {
                                    onEdit(record);
                                    onClose();
                                }}
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Record
                            </Button>
                        )}
                    </div>
                    
                    <Button 
                        variant="default" 
                        className="rounded-xl font-bold text-xs h-10 px-8 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white hover:bg-primary transition-all duration-300" 
                        onClick={onClose}
                    >
                        Dismiss
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
