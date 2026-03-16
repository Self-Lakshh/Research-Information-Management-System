import React, { useState, useEffect, useRef } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/shadcn/ui/dialog'
import { Button } from '@/components/shadcn/ui/button'
import { Input } from '@/components/shadcn/ui/input'
import { Textarea } from '@/components/shadcn/ui/textarea'
import { Partner, CreatePartnerData, UpdatePartnerData } from '@/services/firebase/partners/types'
import { uploadFile } from '@/services/firebase/storage.service'
import useAuth from '@/auth/useAuth'
import { X } from 'lucide-react'

interface PartnerFormModalProps {
    isOpen: boolean
    onClose: () => void
    initialData?: Partner | null
    onSubmit: (data: any) => Promise<void>
    loading?: boolean
}

export const PartnerFormModal = ({
    isOpen,
    onClose,
    initialData,
    onSubmit,
    loading = false,
}: PartnerFormModalProps) => {
    const { user } = useAuth()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [link, setLink] = useState('')
    const [logoUrl, setLogoUrl] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name || '')
                setDescription(initialData.description || '')
                setLink(initialData.link || '')
                setLogoUrl(initialData.logo_url || '')
            } else {
                setName('')
                setDescription('')
                setLink('')
                setLogoUrl('')
            }
            setFile(null)
        }
    }, [isOpen, initialData])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setLogoUrl('')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        let finalLogoUrl = logoUrl
        let finalMediaId = initialData?.logo_media || ''

        try {
            if (file) {
                setUploading(true)
                // Just use user.id and an arbitrary recordId for partners to bypass strict paths 
                // and keeping it simple. Or use 'system' if no user.
                const userId = user?.id || 'admin'
                const res = await uploadFile(file, userId, initialData?.id || 'new_partner_' + Date.now())
                finalLogoUrl = res.fileUrl
                finalMediaId = res.fileName
                setUploading(false)
            }

            const payload: any = {
                name,
                description,
                link,
                logo_url: finalLogoUrl,
                logo_media: finalMediaId,
            }

            if (!initialData) {
                payload.created_by = `users/${user?.id || 'admin'}`
                payload.updated_by = `users/${user?.id || 'admin'}`
            } else {
                payload.updated_by = `users/${user?.id || 'admin'}`
            }

            await onSubmit(payload)
            onClose()
        } catch (error) {
            console.error(error)
            setUploading(false)
            alert('Error saving partner')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-slate-950 border-none rounded-[32px] shadow-2xl transition-all duration-300">
                <DialogHeader className="relative p-8 overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-primary/5 to-transparent -z-10" />
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
                    
                    <div className="flex flex-col gap-1">
                        <DialogTitle className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {initialData ? 'Update Partner' : 'Onboard New Partner'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 font-medium">
                            {initialData ? 'Refine the partnership details and branding.' : 'Establish a new institutional relationship.'}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
                    <div className="flex flex-col gap-6 mb-6">
                        {/* Info Section (Top) */}
                        <div className="w-full space-y-6">
                            <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Partner Name</label>
                                    <Input
                                        placeholder="e.g. Google Research"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="h-12 rounded-xl border-slate-300 focus:ring-4 focus:ring-primary/10 font-medium px-4"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Website Presence</label>
                                    <Input
                                        placeholder="https://research.google"
                                        type="url"
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        className="h-12 rounded-xl border-slate-300 focus:ring-4 focus:ring-primary/10 font-medium px-4"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Collaboration Extract</label>
                                    <Textarea
                                        placeholder="Briefly describe the nature of this partnership..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        className="min-h-[140px] rounded-xl border-slate-300 focus:ring-4 focus:ring-primary/10 font-medium px-4 py-3 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Branding Section (Bottom & Minimal) */}
                        <div className="w-full">
                            <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col items-center">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 self-start mb-4 ml-1">Institutional Logo</label>
                                
                                <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 bg-white dark:bg-slate-950 relative min-h-[160px] transition-all group/upload hover:border-primary/50">
                                    {(logoUrl || file) ? (
                                        <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-300">
                                            <div className="relative w-full max-h-[120px] aspect-square flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl p-4 overflow-hidden shadow-inner">
                                                <img
                                                    src={file ? URL.createObjectURL(file) : logoUrl}
                                                    alt="Branding Preview"
                                                    className="w-full h-full object-contain transition-transform duration-500 group-hover/upload:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                    <Button
                                                        type="button"
                                                        onClick={() => {
                                                            setFile(null);
                                                            setLogoUrl('');
                                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                                        }}
                                                        variant="destructive"
                                                        size="sm"
                                                        className="rounded-full h-10 w-10 p-0 shadow-lg"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="text-center px-2">
                                                <p className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em]">Identity Asset Attached</p>
                                                <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-full font-medium">{file ? file.name : 'Current Branding'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="flex flex-col items-center justify-center cursor-pointer space-y-3 text-slate-400 group-hover/upload:text-primary transition-all py-6 w-full h-full"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center shadow-sm group-hover/upload:bg-primary/10 group-hover/upload:text-primary transition-all">
                                                <X className="w-6 h-6 rotate-45" />
                                            </div>
                                            <div className="text-center">
                                                <span className="text-xs font-bold block">Upload Branding Assets</span>
                                                <span className="text-[9px] uppercase font-bold tracking-widest mt-1 opacity-60">PNG preferred</span>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 gap-3 sm:gap-0 shrink-0">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={onClose} 
                        className="rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 transition-all px-6"
                        disabled={loading || uploading}
                    >
                        Discard Changes
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        disabled={loading || uploading} 
                        className="rounded-xl px-12 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        {uploading ? 'Finalizing...' : loading ? 'Saving...' : initialData ? 'Apply Updates' : 'Establish Partnership'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PartnerFormModal
