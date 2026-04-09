import React, { useState, useMemo, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/shadcn/ui/dialog'
import { Button } from '@/components/shadcn/ui/button'
import { Checkbox } from '@/components/shadcn/ui/checkbox'
import { RECORD_TYPE_CONFIG } from '@/configs/rims.config'
import { exportToExcel, exportToPDF, resolveMediaLinks } from '@/utils/exportUtils'
import { Download, Table, FileText, Check, X, Loader2, ExternalLink } from 'lucide-react'
import { cn } from '@/components/shadcn/utils'
import { RecordType } from '@/@types/rims.types'

interface ExportModalProps {
    isOpen: boolean
    onClose: () => void
    records: any[]
    domain: string
}

export const ExportModal: React.FC<ExportModalProps> = ({
    isOpen,
    onClose,
    records,
    domain
}) => {
    const config = RECORD_TYPE_CONFIG[domain.toLowerCase() as RecordType]
    const [selectedFields, setSelectedFields] = useState<string[]>([])
    const [isExporting, setIsExporting] = useState(false)
    const [previewMediaMap, setPreviewMediaMap] = useState<Record<number, { name: string, url: string }[]>>({})
    const [isLoadingMedia, setIsLoadingMedia] = useState(false)

    // Initialize all fields as selected by default
    useEffect(() => {
        if (isOpen && config) {
            const initial = config.fields.filter(f => f.type !== 'file').map(f => f.key)
            initial.push('documents_link') // Add documents link by default
            setSelectedFields(initial)
        }
    }, [isOpen, config])

    // Load media links for preview
    useEffect(() => {
        const loadPreviewMedia = async () => {
            if (!isOpen || records.length === 0) return
            setIsLoadingMedia(true)
            const map: Record<number, { name: string, url: string }[]> = {}
            
            const previewRecords = records.slice(0, 5)
            await Promise.all(previewRecords.map(async (record, idx) => {
                const links = await resolveMediaLinks(record)
                if (links.length > 0) {
                    map[idx] = links
                }
            }))
            
            setPreviewMediaMap(map)
            setIsLoadingMedia(false)
        }

        loadPreviewMedia()
    }, [isOpen, records])

    const availableFields = useMemo(() => {
        if (!config) return []
        return [
            ...config.fields.filter(f => f.type !== 'file'),
            { key: 'documents_link', label: 'Supporting Documents' }
        ]
    }, [config])

    const toggleField = (key: string) => {
        setSelectedFields(prev => 
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        )
    }

    const selectAll = () => setSelectedFields(availableFields.map(f => f.key))
    const deselectAll = () => setSelectedFields([])

    const handleExport = async (format: 'pdf' | 'excel') => {
        setIsExporting(true)
        try {
            if (format === 'pdf') {
                await exportToPDF(records, domain, selectedFields)
            } else {
                await exportToExcel(records, domain, selectedFields)
            }
        } catch (err) {
            console.error(err)
            alert('Export failed.')
        } finally {
            setIsExporting(false)
        }
    }

    if (!config) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-zinc-800 border-none rounded-[32px] shadow-2xl">
                <DialogHeader className="p-6 bg-zinc-100 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-700/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <Download className="w-6 h-6 text-primary" />
                                </div>
                                Export Data: {config.label}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Customize fields and preview your archive export.
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {/* Field Selection Area */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500" />
                                Select Fields to Include
                            </h3>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={selectAll} className="h-7 text-[10px] font-bold uppercase">Select All</Button>
                                <Button variant="ghost" size="sm" onClick={deselectAll} className="h-7 text-[10px] font-bold uppercase text-rose-500 hover:text-rose-600">Clear All</Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {availableFields.map((field) => (
                                <div 
                                    key={field.key}
                                    onClick={() => toggleField(field.key)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all duration-300",
                                        selectedFields.includes(field.key)
                                            ? "bg-primary/5 border-primary shadow-sm"
                                            : "bg-zinc-50 dark:bg-zinc-900/40 border-transparent hover:border-zinc-300 dark:hover:border-zinc-600"
                                    )}
                                >
                                    <Checkbox 
                                        checked={selectedFields.includes(field.key)}
                                        onCheckedChange={() => toggleField(field.key)}
                                        className="rounded-md"
                                    />
                                    <span className={cn(
                                        "text-xs font-bold leading-none",
                                        selectedFields.includes(field.key) ? "text-primary" : "text-zinc-600 dark:text-zinc-400"
                                    )}>
                                        {field.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Preview Area */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Table className="w-4 h-4 text-primary" />
                            Data Preview (First 5 records)
                        </h3>
                        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-inner bg-zinc-50/50 dark:bg-black/20">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-zinc-100 dark:bg-zinc-900/40">
                                            {availableFields.filter(f => selectedFields.includes(f.key)).map(field => (
                                                <th key={field.key} className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 whitespace-nowrap">
                                                    {field.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.slice(0, 5).map((record, i) => (
                                            <tr key={i} className="border-t border-zinc-200 dark:border-zinc-700/50 hover:bg-white dark:hover:bg-zinc-800/50 transition-colors">
                                                {availableFields.filter(f => selectedFields.includes(f.key)).map(field => {
                                                    let val = record[field.key] || record.data?.[field.key]
                                                    
                                                    // Specialized document link preview
                                                    if (field.key === 'documents_link') {
                                                        const media = previewMediaMap[i]
                                                        if (isLoadingMedia) {
                                                            return (
                                                                <td key={field.key} className="p-4 text-xs font-medium text-zinc-400 italic flex items-center gap-2">
                                                                    <div className="w-3 h-3 border border-current border-t-transparent animate-spin rounded-full" />
                                                                    Resolving...
                                                                </td>
                                                            )
                                                        }
                                                        
                                                        if (media && media.length > 0) {
                                                            return (
                                                                <td key={field.key} className="p-4 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                                                    <div className="flex flex-col gap-1.5">
                                                                        {media.map((m, mIdx) => (
                                                                            <a 
                                                                                key={mIdx}
                                                                                href={m.url} 
                                                                                target="_blank" 
                                                                                rel="noopener noreferrer"
                                                                                className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-bold"
                                                                            >
                                                                                <FileText className="w-3 h-3" />
                                                                                <span className="truncate max-w-[120px]">{m.name}</span>
                                                                                <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                            )
                                                        }
                                                        return (
                                                            <td key={field.key} className="p-4 text-xs font-medium text-zinc-400">
                                                                None
                                                            </td>
                                                        )
                                                    }

                                                    const displayVal = val || '---'
                                                    
                                                    return (
                                                        <td key={field.key} className="p-4 text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[200px]">
                                                            {typeof displayVal === 'string' || typeof displayVal === 'number' ? displayVal : 'Ref/Object'}
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>

                <DialogFooter className="p-6 bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-700/50 flex flex-row items-center justify-end gap-4">
                    <Button 
                        variant="outline" 
                        onClick={onClose}
                        className="rounded-xl font-bold border-zinc-200 dark:border-zinc-700"
                    >
                        Cancel
                    </Button>
                    <div className="flex items-center gap-3">
                        <Button 
                            onClick={() => handleExport('excel')}
                            disabled={isExporting || selectedFields.length === 0}
                            className="rounded-xl px-6 font-bold flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                        >
                            {isExporting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Table className="w-4 h-4" />}
                            Export Excel
                        </Button>
                        <Button 
                            onClick={() => handleExport('pdf')}
                            disabled={isExporting || selectedFields.length === 0}
                            className="rounded-xl px-6 font-bold flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20"
                        >
                            {isExporting ? <Loader2 className="w-4 h-4 animate-spin"/> : <FileText className="w-4 h-4" />}
                            Export PDF
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
