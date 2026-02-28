import React from 'react'
import { cn } from '@/components/shadcn/utils'
import { FieldConfig } from '@/@types/admin'
import { Label } from '@/components/shadcn/ui/label'
import { Input } from '@/components/shadcn/ui/input'
import { Textarea } from '@/components/shadcn/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/ui/select'
import { Card, CardContent } from '@/components/shadcn/ui/card'

interface DynamicFormProps {
    fields: FieldConfig[]
    data?: any
    onChange: (key: string, value: any) => void
    readOnly?: boolean
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ fields, data = {}, onChange, readOnly = false }) => {

    const renderField = (field: FieldConfig) => {
        const { key, label, placeholder, required, options } = field
        const value = data[key] || ''

        const baseInputStyles = "rounded-xl border-muted-foreground/20 bg-background/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"

        switch (field.type) {
            case 'textarea':
                return (
                    <Textarea
                        disabled={readOnly}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(key, e.target.value)}
                        className={cn(baseInputStyles, "min-h-[120px] resize-none")}
                    />
                )
            case 'select':
                return (
                    <Select disabled={readOnly} value={value} onValueChange={(val) => onChange(key, val)}>
                        <SelectTrigger className={cn(baseInputStyles, "h-11 font-medium")}>
                            <SelectValue placeholder={placeholder || `Select ${label}`} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-primary/5 shadow-premium">
                            {options?.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="rounded-lg">
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            case 'date':
                return (
                    <Input
                        disabled={readOnly}
                        type="date"
                        value={value}
                        onChange={(e) => onChange(key, e.target.value)}
                        className={cn(baseInputStyles, "h-11 font-medium")}
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
                        className={cn(baseInputStyles, "h-11 font-medium")}
                    />
                )
            case 'file':
                return (
                    <Input
                        disabled={readOnly}
                        type="file"
                        onChange={(e) => onChange(key, e.target.files?.[0])}
                        className={cn(baseInputStyles, "h-11 py-2 text-xs cursor-pointer")}
                    />
                )
            default:
                return (
                    <Input
                        disabled={readOnly}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(key, e.target.value)}
                        className={cn(baseInputStyles, "h-11 font-medium")}
                    />
                )
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {fields.map((field) => (
                <div key={field.key} className={field.gridSpan === 2 ? 'col-span-1 md:col-span-2' : 'col-span-1'}>
                    <Label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </Label>
                    <div className="relative group transition-all duration-300">
                        {renderField(field)}
                    </div>
                </div>
            ))}
        </div>
    )
}
