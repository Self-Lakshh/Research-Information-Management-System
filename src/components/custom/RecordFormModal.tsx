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
import { doc } from 'firebase/firestore'
import { db } from '@/configs/firebase.config'

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
                setFormData({
                    ...initialData,
                    ...(initialData.data || {})
                })
            } else {
                // Pre-fill user_select fields for regular users
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
    }, [initialData, isOpen, typeKey, isAdmin, user])

    if (!config) return null

    const handleFieldChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }))
        if (validationError) setValidationError(null)
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
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-slate-950 border-none rounded-[32px] shadow-2xl">
                <DialogHeader className="p-6 bg-blue-200 dark:bg-blue-900/30">
                    <DialogTitle className="text-xl font-black tracking-tight text-blue-900 dark:text-blue-100">
                        {initialData ? 'Update' : 'Create'} {config.label}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
                    <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-6">
                        <DynamicForm
                            fields={config.fields}
                            data={formData}
                            onChange={handleFieldChange}
                            isAdmin={isAdmin}
                            users={users}
                        />
                    </div>
                </div>

                <DialogFooter className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between gap-3">
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
