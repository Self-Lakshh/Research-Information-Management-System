import React, { useRef } from 'react'
import { UploadCloud, X, FileText, Eye } from 'lucide-react'
import { cn } from '@/components/shadcn/utils'
import { FieldConfig } from '@/configs/rims.config'
import { Label } from '@/components/shadcn/ui/label'
import { Input } from '@/components/shadcn/ui/input'
import { Textarea } from '@/components/shadcn/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/ui/select'
import { Card, CardContent } from '@/components/shadcn/ui/card'
import { Button } from '@/components/shadcn/ui/button'
import { AssetRow } from './AssetRow'

interface DynamicFormProps {
    fields: FieldConfig[]
    data?: any
    onChange: (key: string, value: any) => void
    readOnly?: boolean
    isAdmin?: boolean
    users?: any[]
    onDeleteAsset?: (url: string) => void
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ 
    fields, 
    data = {}, 
    onChange, 
    readOnly = false,
    isAdmin = false,
    users = [],
    onDeleteAsset
}) => {

    const renderField = (field: FieldConfig) => {
        const { key, label, placeholder, required, options } = field
        const value = data[key] || ''

        const baseInputStyles = "rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 placeholder:text-zinc-400 font-medium px-4"

        switch (field.type) {
            case 'textarea':
                return (
                    <Textarea
                        disabled={readOnly}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(key, e.target.value)}
                        className={cn(baseInputStyles, "min-h-[120px] resize-none py-3 px-4")}
                    />
                )
            case 'user_select': {
                const optionsList = users
                const isMultiple = field.multiple
                // Normalize value to an array for easier rendering
                const rawSelectedValues = isMultiple ? (Array.isArray(value) ? value : [value].filter(Boolean)) : [value].filter(Boolean)
                
                // For non-admins, show a premium read-only display
                if (!isAdmin) {
                    return (
                        <div className="flex flex-wrap gap-2 p-3 min-h-[48px] rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-700/50 dark:border-zinc-700 shadow-inner">
                            {rawSelectedValues.map((val: any) => {
                                // Extract the string path/ID for comparison if it's a Firestore Ref
                                const targetId = (val && typeof val === 'object' && val.id) ? val.id : String(val);
                                const userObj = users.find(u => u.id === targetId || u.value === targetId || u.id === val);
                                
                                return (
                                    <div key={targetId} className="flex items-center gap-1.5 bg-primary/10 text-primary text-[11px] font-bold px-3 py-1.5 rounded-lg border border-primary/20">
                                        {userObj?.name || 'Loading Name...'}
                                    </div>
                                )
                            })}
                            {rawSelectedValues.length === 0 && <span className="text-slate-400 text-xs font-medium italic">Auto-assigned to your profile</span>}
                        </div>
                    )
                }

                // For Admins, show the selector
                return (
                    <div className="space-y-2">
                        {isMultiple && rawSelectedValues.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {rawSelectedValues.map((val: any) => {
                                    const targetId = (val && typeof val === 'object' && val.id) ? val.id : String(val);
                                    const userObj = users.find(u => u.id === targetId || u.value === targetId || u.id === val);
                                    return (
                                        <div key={targetId} className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-200">
                                            {userObj?.name || targetId}
                                            <button 
                                                type="button"
                                                onClick={() => onChange(key, rawSelectedValues.filter((v: any) => v !== val))}
                                                className="hover:text-rose-500 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                        <Select 
                            disabled={readOnly} 
                            value={isMultiple ? "" : (rawSelectedValues[0] ? (rawSelectedValues[0].id || rawSelectedValues[0]) : "")} 
                            onValueChange={(val) => {
                                // Important: We store the string ID/path which RecordFormModal/useSaveRecord converts to Ref if needed
                                // Or simply store the Ref if we have it. For simplicity, we store what we select.
                                if (isMultiple) {
                                    if (!rawSelectedValues.includes(val)) {
                                        onChange(key, [...rawSelectedValues, val])
                                    }
                                } else {
                                    onChange(key, val)
                                }
                            }}
                        >
                            <SelectTrigger className={cn(baseInputStyles, "h-12")}>
                                <SelectValue placeholder={placeholder || `Select ${label}`} />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200 shadow-xl overflow-hidden max-h-[300px]">
                                {optionsList?.map((opt: any) => (
                                    <SelectItem 
                                        key={opt.id || opt.value} 
                                        value={opt.id || opt.value} 
                                        className="rounded-lg py-2.5 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer"
                                    >
                                        {opt.name} ({opt.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )
            }
            case 'select': {
                return (
                    <Select 
                        disabled={readOnly} 
                        value={value} 
                        onValueChange={(val) => onChange(key, val)}
                    >
                        <SelectTrigger className={cn(baseInputStyles, "h-12")}>
                            <SelectValue placeholder={placeholder || `Select ${label}`} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 shadow-xl overflow-hidden">
                            {options?.map((opt: any) => (
                                <SelectItem 
                                    key={opt.value} 
                                    value={opt.value} 
                                    className="rounded-lg py-2.5 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer"
                                >
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            }
            case 'date':
                return (
                    <Input
                        disabled={readOnly}
                        type="date"
                        value={value}
                        onChange={(e) => onChange(key, e.target.value)}
                        className={cn(baseInputStyles, "h-12")}
                    />
                )
            case 'number':
                return (
                    <Input
                        disabled={readOnly}
                        type="number"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(key, e.target.value)}
                        className={cn(baseInputStyles, "h-12")}
                    />
                )
            case 'url':
                return (
                    <Input
                        disabled={readOnly}
                        type="url"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(key, e.target.value)}
                        className={cn(baseInputStyles, "h-12")}
                    />
                )
            case 'file':
                const filesArray = Array.isArray(value) ? value : (value ? [value] : [])

                return (
                    <div className="space-y-4">
                        <div className="relative group/file">
                            <Input
                                disabled={readOnly}
                                type="file"
                                multiple={field.multiple} 
                                onChange={(e) => {
                                    const files = e.target.files
                                    if (files && files.length > 0) {
                                        const newFiles = Array.from(files)
                                        onChange(key, field.multiple ? [...filesArray, ...newFiles] : newFiles[0])
                                    }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={cn(
                                "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-300 gap-3 shadow-sm",
                                value 
                                    ? "border-primary bg-primary/5 ring-4 ring-primary/5" 
                                    : "border-slate-300 bg-slate-50 dark:bg-slate-900 dark:border-slate-800 group-hover/file:border-primary/50 group-hover/file:bg-primary/5"
                            )}>
                                <div className={cn(
                                    "p-3 rounded-full transition-colors",
                                    value ? "bg-primary text-white" : "bg-white text-slate-400 shadow-sm"
                                )}>
                                    <UploadCloud className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        Click or drag to upload {field.multiple ? 'documents' : 'document'}
                                    </p>
                                    {!value && <p className="text-xs text-slate-500 mt-1">{field.multiple ? "PDF, DOCX, Images" : "PDF, DOCX up to 10MB"}</p>}
                                </div>
                            </div>
                        </div>

                        {/* File Preview List (Simplified Rows) */}
                        {filesArray.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {filesArray.map((file: any, index: number) => {
                                    let fileName = 'Document';
                                    let isExisting = false;
                                    let url = '';

                                    if (file instanceof File) {
                                        fileName = file.name;
                                    } else if (typeof file === 'string') {
                                        isExisting = true;
                                        url = file;
                                        try {
                                            const decoded = decodeURIComponent(file);
                                            const parts = decoded.split('/');
                                            const filenameWithParams = parts[parts.length - 1];
                                            fileName = filenameWithParams.split('?')[0].split('%2F').pop() || 'Existing File';
                                        } catch (e) {
                                            fileName = file.split('/').pop() || 'Existing File';
                                        }
                                    }

                                    return (
                                        <AssetRow
                                            key={index}
                                            url={url}
                                            fileName={fileName}
                                            isExisting={isExisting}
                                            onDelete={() => {
                                                if (isExisting && onDeleteAsset) {
                                                    onDeleteAsset(url)
                                                }
                                                if (field.multiple) {
                                                    onChange(key, filesArray.filter((_, i) => i !== index))
                                                } else {
                                                    onChange(key, null)
                                                }
                                            }}
                                        />
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )
            default:
                return (
                    <Input
                        disabled={readOnly}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(key, e.target.value)}
                        className={cn(baseInputStyles, "h-12")}
                    />
                )
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {fields.map((field) => {
                const isFullWidth = field.gridSpan === 2 || field.type === 'file' || field.type === 'textarea'
                
                return (
                    <div key={field.key} className={isFullWidth ? 'col-span-1 md:col-span-2' : 'col-span-1'}>
                        <Label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                            {field.label} {field.required && <span className="text-rose-500">*</span>}
                        </Label>
                        <div className="relative group transition-all duration-300">
                            {renderField(field)}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
