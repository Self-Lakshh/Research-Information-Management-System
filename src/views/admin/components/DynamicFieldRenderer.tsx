import { cn } from '@/components/shadcn/utils'
import type { FieldConfig, RecordType } from '../types'
import { recordFieldConfig } from '../config/recordFieldConfig'

interface DynamicFieldRendererProps {
    recordType: RecordType
    data: Record<string, unknown>
    className?: string
    layout?: 'grid' | 'list'
}

export const DynamicFieldRenderer = ({
    recordType,
    data,
    className,
    layout = 'grid'
}: DynamicFieldRendererProps) => {
    const fields = recordFieldConfig[recordType]

    if (layout === 'list') {
        return (
            <div className={cn('space-y-3', className)}>
                {fields.map((field) => (
                    <FieldValue key={field.key} field={field} value={data[field.key]} />
                ))}
            </div>
        )
    }

    return (
        <div className={cn('grid grid-cols-2 gap-4', className)}>
            {fields.map((field) => (
                <div
                    key={field.key}
                    className={field.gridSpan === 2 ? 'col-span-2' : ''}
                >
                    <FieldValue field={field} value={data[field.key]} />
                </div>
            ))}
        </div>
    )
}

// ============================================
// FIELD VALUE RENDERER
// ============================================

interface FieldValueProps {
    field: FieldConfig
    value: unknown
}

const FieldValue = ({ field, value }: FieldValueProps) => {
    const displayValue = formatValue(field, value)

    return (
        <div className="space-y-1">
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {field.label}
            </dt>
            <dd className="text-sm text-foreground">{displayValue}</dd>
        </div>
    )
}

// ============================================
// VALUE FORMATTER
// ============================================

function formatValue(field: FieldConfig, value: unknown): string {
    if (value === undefined || value === null || value === '') {
        return '—'
    }

    switch (field.type) {
        case 'date':
            return formatDate(value as string)

        case 'select':
            const option = field.options?.find((o) => o.value === value)
            return option?.label || String(value)

        case 'multiselect':
            const values = value as string[]
            if (!Array.isArray(values) || values.length === 0) return '—'
            return values
                .map((v) => field.options?.find((o) => o.value === v)?.label || v)
                .join(', ')

        case 'number':
            const num = Number(value)
            if (isNaN(num)) return String(value)
            // Format large numbers with commas
            if (num >= 1000) return num.toLocaleString()
            return String(num)

        case 'url':
            return String(value)

        case 'file':
            return String(value) || 'No file uploaded'

        default:
            return String(value)
    }
}

function formatDate(dateStr: string): string {
    try {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    } catch {
        return dateStr
    }
}

// ============================================
// DYNAMIC FORM RENDERER
// ============================================

interface DynamicFormRendererProps {
    recordType: RecordType
    values: Record<string, unknown>
    onChange: (key: string, value: unknown) => void
    errors?: Record<string, string>
    className?: string
}

export const DynamicFormRenderer = ({
    recordType,
    values,
    onChange,
    errors = {},
    className
}: DynamicFormRendererProps) => {
    const fields = recordFieldConfig[recordType]

    return (
        <div className={cn('grid grid-cols-2 gap-4', className)}>
            {fields.map((field) => (
                <div
                    key={field.key}
                    className={field.gridSpan === 2 ? 'col-span-2' : ''}
                >
                    <FormField
                        field={field}
                        value={values[field.key]}
                        onChange={(value) => onChange(field.key, value)}
                        error={errors[field.key]}
                    />
                </div>
            ))}
        </div>
    )
}

// ============================================
// FORM FIELD RENDERER
// ============================================

interface FormFieldProps {
    field: FieldConfig
    value: unknown
    onChange: (value: unknown) => void
    error?: string
}

const FormField = ({ field, value, onChange, error }: FormFieldProps) => {
    const baseInputClasses = cn(
        'w-full px-3 py-2 text-sm rounded-lg',
        'bg-muted/50 border border-border/50',
        'placeholder:text-muted-foreground',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50',
        'transition-all',
        error && 'border-rose-500 focus:ring-rose-200'
    )

    const renderField = () => {
        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        value={(value as string) || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className={baseInputClasses}
                    />
                )

            case 'select':
                return (
                    <select
                        value={(value as string) || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className={baseInputClasses}
                    >
                        <option value="">{field.placeholder || `Select ${field.label}`}</option>
                        {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )

            case 'number':
                return (
                    <input
                        type="number"
                        value={(value as number) ?? ''}
                        onChange={(e) => onChange(e.target.valueAsNumber || '')}
                        placeholder={field.placeholder}
                        className={baseInputClasses}
                    />
                )

            case 'date':
                return (
                    <input
                        type="date"
                        value={(value as string) || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className={baseInputClasses}
                    />
                )

            case 'url':
                return (
                    <input
                        type="url"
                        value={(value as string) || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder}
                        className={baseInputClasses}
                    />
                )

            case 'file':
                return (
                    <input
                        type="file"
                        onChange={(e) => onChange(e.target.files?.[0]?.name || '')}
                        className={cn(
                            baseInputClasses,
                            'file:mr-3 file:px-3 file:py-1 file:rounded-md file:border-0',
                            'file:bg-primary file:text-primary-foreground file:text-sm file:font-medium',
                            'file:cursor-pointer'
                        )}
                    />
                )

            default:
                return (
                    <input
                        type="text"
                        value={(value as string) || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder}
                        className={baseInputClasses}
                    />
                )
        }
    }

    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
                {field.label}
                {field.required && <span className="text-rose-500 ml-0.5">*</span>}
            </label>
            {renderField()}
            {error && <p className="text-xs text-rose-500">{error}</p>}
        </div>
    )
}

export default DynamicFieldRenderer
