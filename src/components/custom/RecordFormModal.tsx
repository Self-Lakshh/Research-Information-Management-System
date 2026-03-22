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

    const handleSubmit = () => {
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

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-zinc-800 border-none rounded-[32px] shadow-2xl">
                <DialogHeader className="p-6 bg-zinc-100 dark:bg-zinc-900/40">
                    <DialogTitle className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                        {initialData ? 'Update' : 'Create'} {config.label}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Form for entering research record details for {config.label}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar transition-colors">
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
                </div>

                <DialogFooter className="p-6 bg-zinc-50 dark:bg-zinc-700/50 border-t border-zinc-200 dark:border-zinc-700 flex flex-row items-center justify-between gap-3 transition-colors">
                    <div className="flex-1">
                        {validationError && (
                            <span className="text-rose-500 text-xs font-bold animate-in fade-in slide-in-from-left-2 duration-300">
                                {validationError}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
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
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
