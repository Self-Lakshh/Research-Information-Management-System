import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/shadcn/ui/dialog'
import { Button } from '@/components/shadcn/ui/button'
import { DynamicForm } from './DynamicForm'
import { RECORD_TYPE_CONFIG } from '@/configs/rims.config'
import { RecordType } from '@/@types/rims.types'
import { useAuth } from '@/auth'
import { getAllUsers } from '@/services/firebase/users/user.services'
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from '@/configs/firebase.config'
import { getStorage, ref, deleteObject } from 'firebase/storage'
import * as XLSX from 'xlsx'
import { getTemplateByType, generateExcelTemplateBlob, setupTemplates } from '@/services/firebase/templates/template.services'
import { Checkbox } from '@/components/shadcn/ui/checkbox'
import { Download, Upload, AlertCircle, CheckCircle2, Loader2, Settings } from 'lucide-react'

interface RecordFormModalProps {
    isOpen: boolean
    onClose: () => void
    type: string
    initialData?: any
    onSubmit: (data: any) => void
    loading?: boolean
}

export const RecordFormModal: React.FC<RecordFormModalProps> = ({
    isOpen,
    onClose,
    type,
    initialData,
    onSubmit,
    loading
}) => {
    const { user } = useAuth()
    const isAdmin = user?.user_role === 'admin'
    const [formData, setFormData] = React.useState<any>(initialData || {})
    const [users, setUsers] = React.useState<any[]>([])
    const [validationError, setValidationError] = React.useState<string | null>(null)
    
    // Bulk Upload State
    const [isBulk, setIsBulk] = React.useState(false)
    const [bulkFile, setBulkFile] = React.useState<File | null>(null)
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [bulkProgress, setBulkProgress] = React.useState({ current: 0, total: 0, success: 0, failed: 0 })
    const [bulkResults, setBulkResults] = React.useState<{ failedRows: any[] } | null>(null)
    const [initLoading, setInitLoading] = React.useState(false)
    
    const typeKey = (type || 'journal').toLowerCase() as RecordType
    const config = RECORD_TYPE_CONFIG[typeKey] || RECORD_TYPE_CONFIG.journal

    React.useEffect(() => {
        if (isOpen) {
            if (isAdmin) {
                getAllUsers().then(allUsers => {
                    // Ensure current user is always in the list even if missing from fetch
                    if (user && !allUsers.some(u => u.id === user.id)) {
                        setUsers([...allUsers, user])
                    } else {
                        setUsers(allUsers)
                    }
                }).catch(console.error)
            } else if (user) {
                // For non-admins, the 'users' list just needs to contain themselves for name resolution
                setUsers([user])
            }
        }
    }, [isOpen, isAdmin, user])

    React.useEffect(() => {
        if (isOpen) {
            setValidationError(null)
            if (initialData) {
                // Pre-resolve any sources (references) or document IDs into URLs for the form
                const sources = initialData.sources || initialData.documents || []
                
                const resolveExistingFiles = async () => {
                    const resolved = await Promise.all(sources.map(async (ref: any) => {
                        try {
                            let resolvedRef = ref;
                            if (typeof ref === 'string') {
                                resolvedRef = ref.includes('/') ? doc(db, ref) : doc(db, 'documents', ref);
                            }
                            
                            const snap = await getDoc(resolvedRef);
                            if (snap.exists()) {
                                const dData = snap.data() as any;
                                return dData.file_url || dData.url || dData.media_url;
                            }
                        } catch (e) { console.error("Error resolving initial file:", e) }
                        return null;
                    }))
                    
                    const existingFileUrls = resolved.filter(Boolean);
                    if (existingFileUrls.length > 0) {
                        setFormData((prev: any) => ({
                            ...prev,
                            // If form field exists, check if it's multiple
                            file: config.fields.find(f => f.key === 'file')?.multiple ? existingFileUrls : existingFileUrls[0]
                        }))
                    }
                }

                setFormData({
                    ...initialData,
                    ...(initialData.data || {})
                })
                
                if (sources.length > 0) resolveExistingFiles();
            } else {
                // Pre-fill user_select fields for regular users for NEW records
                const initial: any = {}
                if (!isAdmin && user) {
                    const userRef = doc(db, 'users', user.id || (user as any).uid)
                    config.fields.forEach(field => {
                        if (field.type === 'user_select') {
                            initial[field.key] = field.multiple ? [userRef] : userRef
                        }
                    })
                }
                setFormData(initial)
            }
        }
    }, [initialData, isOpen, typeKey, isAdmin, user, config.fields])

    if (!config) return null

    const handleFieldChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }))
        if (validationError) setValidationError(null)
    }

    const handleDeleteAsset = async (url: string) => {
        try {
            // 1. Delete Firestore metadata entries
            const q = query(collection(db, 'documents'), where('file_url', '==', url))
            const snap = await getDocs(q)
            
            await Promise.all(snap.docs.map(d => deleteDoc(d.ref)))
            
            // 2. Delete from Storage
            const storage = getStorage()
            const storageRef = ref(storage, url)
            await deleteObject(storageRef).catch(e => {
                console.warn("Storage deletion failed or file already gone:", e)
            })

            // 3. Update parent record state (if sources exist in initialData)
            // This is effectively handled by DynamicForm's state change, but we ensure persistence
            console.log(`Resource ${url} purged successfully.`)
        } catch (err) {
            console.error("Critical error during asset purge:", err)
        }
    }

    const handleSubmit = async () => {
        if (isBulk) {
            handleBulkUpload();
            return;
        }

        // Validate required fields
        const missingFields = config.fields.filter(f => {
            if (!f.required) return false;
            const val = formData[f.key];
            return val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);
        });

        if (missingFields.length > 0) {
            setValidationError(`Please complete: ${missingFields[0].label}`);
            return;
        }

        onSubmit(formData)
    }

    const handleDownloadTemplate = async () => {
        try {
            const template = await getTemplateByType(typeKey);
            if (template) {
                window.open(template.file_url, '_blank');
            } else {
                // Generate and download on the fly if not in Firestore
                const blob = generateExcelTemplateBlob(typeKey);
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${typeKey}_template.xlsx`;
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to download template.');
        }
    }
    const handleInitializeTemplates = async () => {
        if (!isAdmin) return;
        try {
            setInitLoading(true);
            await setupTemplates();
            alert('All templates synchronized successfully.');
        } catch (err) {
            console.error(err);
            alert('Failed to sync templates.');
        } finally {
            setInitLoading(false);
        }
    }

    const handleBulkUpload = async () => {
        if (!bulkFile) {
            setValidationError('Please select an Excel file.');
            return;
        }

        setIsProcessing(true);
        setBulkResults(null);
        setValidationError(null);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                if (jsonData.length === 0) {
                    setValidationError('The Excel file is empty.');
                    setIsProcessing(false);
                    return;
                }

                const total = jsonData.length;
                setBulkProgress({ current: 0, total, success: 0, failed: 0 });

                const failedRows: any[] = [];
                let successCount = 0;
                let failedCount = 0;

                for (let i = 0; i < jsonData.length; i++) {
                    const row: any = jsonData[i];
                    setBulkProgress(prev => ({ ...prev, current: i + 1 }));

                    // basic validation
                    const missingRequired = config.fields.filter(f => f.required && f.type !== 'file' && f.type !== 'user_select' && !row[f.key]);
                    
                    if (missingRequired.length > 0) {
                        failedRows.push({ ...row, error: `Missing: ${missingRequired.map(f => f.label).join(', ')}` });
                        failedCount++;
                        setBulkProgress(prev => ({ ...prev, failed: failedCount }));
                        continue;
                    }

                    try {
                        // Normalize select values (Case-insensitive matching)
                        const normalizedRow = { ...row };
                        config.fields.forEach(field => {
                            if (field.type === 'select' && field.options && row[field.key]) {
                                const excelVal = String(row[field.key]).trim().toLowerCase();
                                const match = field.options.find(opt => 
                                    opt.value.toLowerCase() === excelVal || 
                                    opt.label.toLowerCase() === excelVal
                                );
                                if (match) {
                                    normalizedRow[field.key] = match.value;
                                }
                            }
                        });

                        // Pass to the same onSubmit as single record
                        await new Promise<void>((resolve, reject) => {
                            try {
                                onSubmit({ ...normalizedRow, type: typeKey, _isBulk: true });
                                resolve();
                            } catch (err) {
                                reject(err);
                            }
                        });
                        successCount++;
                        setBulkProgress(prev => ({ ...prev, success: successCount }));
                    } catch (err) {
                        failedRows.push({ ...row, error: (err as any).message || 'API Error' });
                        failedCount++;
                        setBulkProgress(prev => ({ ...prev, failed: failedCount }));
                    }
                }

                if (failedRows.length > 0) {
                    setBulkResults({ failedRows });
                    generateErrorExcel(failedRows);
                }

                // If all successful, we can auto-close if desired, but user said "stops when all are done with directly failed"
                // So we keep open to show results
                if (failedCount === 0) {
                    alert(`Successfully uploaded ${successCount} records.`);
                    onClose();
                }

            } catch (err) {
                console.error(err);
                setValidationError('Failed to parse Excel file.');
            } finally {
                setIsProcessing(false);
            }
        };
        reader.readAsArrayBuffer(bulkFile);
    }

    const generateErrorExcel = (failedRows: any[]) => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(failedRows);
        XLSX.utils.book_append_sheet(wb, ws, 'Failed Records');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `failed_uploads_${typeKey}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
    }


    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-zinc-800 border-none rounded-[32px] shadow-2xl">
                <DialogHeader className="p-6 bg-zinc-100 dark:bg-zinc-900/40">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                                {isBulk ? 'Bulk Upload' : (initialData ? 'Update' : 'Create')} {config.label}
                            </DialogTitle>
                            <DialogDescription className="sr-only">
                                Form for entering research record details for {config.label}
                            </DialogDescription>
                        </div>
                        {isAdmin && !initialData && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleInitializeTemplates}
                                disabled={initLoading}
                                className="text-[10px] text-muted-foreground flex items-center gap-1"
                            >
                                {initLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Settings className="w-3 h-3" />}
                                Sync Templates
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar transition-colors">
                    {isBulk ? (
                        <div className="space-y-6 py-4">
                            <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center text-center transition-all hover:border-primary/50">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <Upload className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Upload Template</h3>
                                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                                    Upload the completed Excel template. We will process each row as a new record.
                                </p>
                                
                                <input
                                    type="file"
                                    id="bulk-file-upload"
                                    className="hidden"
                                    accept=".xlsx, .xls"
                                    onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
                                />
                                <label
                                    htmlFor="bulk-file-upload"
                                    className="cursor-pointer bg-white dark:bg-zinc-800 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all font-bold text-sm flex items-center gap-2"
                                >
                                    {bulkFile ? bulkFile.name : 'Select Excel File'}
                                </label>
                            </div>

                            {isProcessing && (
                                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-primary flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Processing {bulkProgress.current} / {bulkProgress.total} records...
                                        </span>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {Math.round((bulkProgress.current / bulkProgress.total) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary transition-all duration-300" 
                                            style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex gap-4 mt-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{bulkProgress.success} Success</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                                            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">{bulkProgress.failed} Failed</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {bulkResults && (
                                <div className="bg-rose-50 dark:bg-rose-950/20 rounded-2xl p-4 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400">Processing Completed with Errors</h4>
                                        <p className="text-xs text-rose-600 dark:text-rose-500 mt-1">
                                            {bulkResults.failedRows.length} records failed to upload. An Excel file containing the errors has been downloaded for your review.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-zinc-50/50 dark:bg-zinc-700/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 mb-6 transition-colors">
                            <DynamicForm
                                fields={config.fields}
                                data={formData}
                                onChange={handleFieldChange}
                                onDeleteAsset={handleDeleteAsset}
                                isAdmin={isAdmin}
                                users={users}
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 bg-zinc-50 dark:bg-zinc-700/50 border-t border-zinc-200 dark:border-zinc-700 flex flex-row items-center justify-between gap-3 transition-colors">
                    <div className="flex-1 flex flex-col gap-2">
                        {!initialData && typeKey !== 'other' && (
                            <div className="flex items-center gap-2">
                                <Checkbox 
                                    id="allow-multiple" 
                                    checked={isBulk} 
                                    onCheckedChange={(checked) => setIsBulk(checked === true)}
                                    className="rounded-md"
                                />
                                <label htmlFor="allow-multiple" className="text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer">
                                    Allow Multiple (Bulk Upload)
                                </label>
                            </div>
                        )}
                        {validationError && (
                            <span className="text-rose-500 text-xs font-bold animate-in fade-in slide-in-from-left-2 duration-300">
                                {validationError}
                            </span>
                        )}
                    </div>
                                        <div className="flex items-center gap-3">
                        {isBulk ? (
                            <>
                                <Button 
                                    variant="outline" 
                                    onClick={handleDownloadTemplate}
                                    className="rounded-xl font-bold flex items-center gap-2 border-primary/20 hover:bg-primary/5"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Template
                                </Button>
                                <Button 
                                    onClick={handleSubmit} 
                                    disabled={isProcessing || !bulkFile} 
                                    className="rounded-xl px-10 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            Start Upload
                                        </>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button 
                                    variant="ghost" 
                                    onClick={onClose} 
                                    className="rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 transition-all"
                                >
                                    Discard Changes
                                </Button>
                                <Button 
                                    onClick={handleSubmit} 
                                    disabled={loading} 
                                    className="rounded-xl px-10 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {loading ? 'Processing...' : initialData ? 'Apply Changes' : 'Save Record'}
                                </Button>
                            </>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
