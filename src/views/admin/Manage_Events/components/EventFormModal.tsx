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
import { EventRecord } from '@/services/firebase/events/types'
import { uploadFile } from '@/services/firebase/storage.service'
import { useAuth } from '@/auth'
import { X } from 'lucide-react'

interface EventFormModalProps {
    isOpen: boolean
    onClose: () => void
    initialData?: EventRecord | null
    onSubmit: (data: any) => Promise<void>
    loading?: boolean
}

export const EventFormModal = ({
    isOpen,
    onClose,
    initialData,
    onSubmit,
    loading = false,
}: EventFormModalProps) => {
    const { user } = useAuth()
    const [title, setTitle] = useState('')
    const [eventDate, setEventDate] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setTitle(initialData.title || '')
                setEventDate(initialData.event_date || '')
                setImageUrl(initialData.image_url || '')
            } else {
                setTitle('')
                setEventDate('')
                setImageUrl('')
            }
            setFile(null)
        }
    }, [isOpen, initialData])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setImageUrl('')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        let finalImageUrl = imageUrl
        let finalMediaId = initialData?.image_media || ''

        try {
            if (file) {
                setUploading(true)
                const userId = user?.id || 'admin'
                const res = await uploadFile(file, userId, initialData?.id || 'new_event_' + Date.now())
                finalImageUrl = res.fileUrl
                finalMediaId = res.fileName
                setUploading(false)
            }

            const payload: any = {
                title,
                event_date: eventDate,
                image_url: finalImageUrl,
                image_media: finalMediaId,
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
            alert('Error saving event')
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
                            {initialData ? 'Update Event' : 'Schedule New Event'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 font-medium">
                            {initialData ? 'Refine the event details and promotional assets.' : 'Begin a new chapter in the institutional timeline.'}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
                    <div className="flex flex-col gap-6 mb-6">
                        {/* Info Section (Now First) */}
                        <div className="w-full space-y-6">
                            <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Event Title</label>
                                    <Input
                                        placeholder="e.g. International Research Conclave"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="h-12 rounded-xl border-slate-300 focus:ring-4 focus:ring-primary/10 font-medium px-4"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Event Date</label>
                                    <Input
                                        type="date"
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                        required
                                        className="h-12 rounded-xl border-slate-300 focus:ring-4 focus:ring-primary/10 font-medium px-4"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Banner Section (Now Minimal & Below) */}
                        <div className="w-full">
                            <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col items-center">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 self-start mb-4 ml-1">Event Banner / Poster</label>
                                
                                <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 bg-white dark:bg-slate-950 relative min-h-[160px] transition-all group/upload hover:border-primary/50">
                                    {(imageUrl || file) ? (
                                        <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-300">
                                            <div className="relative w-full aspect-21/9 max-h-[140px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden shadow-inner">
                                                <img 
                                                    src={file ? URL.createObjectURL(file) : imageUrl} 
                                                    alt="Event Preview" 
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/upload:scale-105" 
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                    <Button
                                                        type="button"
                                                        onClick={() => {
                                                            setFile(null);
                                                            setImageUrl('');
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
                                                <p className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em]">Media Attached</p>
                                                <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-full font-medium">{file ? file.name : 'Current Banner'}</p>
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
                                                <span className="text-xs font-bold block">Upload Event Media</span>
                                                <span className="text-[9px] uppercase font-bold tracking-widest mt-1 opacity-60">High-res Banner</span>
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
                        {uploading ? 'Finalizing...' : loading ? 'Saving...' : initialData ? 'Apply Updates' : 'Broadcast Event'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
