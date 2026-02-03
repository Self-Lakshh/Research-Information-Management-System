import { cn } from '@/components/shadcn/utils'
import { Search, X, Calendar, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { FilterConfig } from '../types'

interface FilterBarProps {
    filters: FilterConfig[]
    values: Record<string, unknown>
    onChange: (key: string, value: unknown) => void
    onClear?: () => void
    className?: string
}

export const FilterBar = ({
    filters,
    values,
    onChange,
    onClear,
    className
}: FilterBarProps) => {
    const hasActiveFilters = Object.values(values).some(
        (v) => v !== undefined && v !== '' && v !== null
    )

    return (
        <div
            className={cn(
                'bg-card rounded-xl border border-border/50 p-4',
                className
            )}
        >
            <div className="flex flex-wrap gap-3">
                {filters.map((filter) => (
                    <FilterField
                        key={filter.key}
                        config={filter}
                        value={values[filter.key]}
                        onChange={(value) => onChange(filter.key, value)}
                    />
                ))}

                {/* Clear filters button */}
                {hasActiveFilters && onClear && (
                    <button
                        onClick={onClear}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                        Clear
                    </button>
                )}
            </div>
        </div>
    )
}

// ============================================
// INDIVIDUAL FILTER FIELD
// ============================================

interface FilterFieldProps {
    config: FilterConfig
    value: unknown
    onChange: (value: unknown) => void
}

const FilterField = ({ config, value, onChange }: FilterFieldProps) => {
    switch (config.type) {
        case 'text':
            return (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder={config.placeholder || config.label}
                        value={(value as string) || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className={cn(
                            'h-9 pl-9 pr-3 text-sm rounded-lg',
                            'bg-muted/50 border border-border/50',
                            'placeholder:text-muted-foreground',
                            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50',
                            'transition-all w-[200px]'
                        )}
                    />
                </div>
            )

        case 'select':
            return (
                <SelectFilter
                    label={config.label}
                    options={config.options || []}
                    value={value as string}
                    onChange={onChange}
                    placeholder={config.placeholder}
                />
            )

        case 'multiselect':
            return (
                <MultiSelectFilter
                    label={config.label}
                    options={config.options || []}
                    value={(value as string[]) || []}
                    onChange={onChange}
                    placeholder={config.placeholder}
                />
            )

        case 'date':
            return (
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="date"
                        value={(value as string) || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className={cn(
                            'h-9 pl-9 pr-3 text-sm rounded-lg',
                            'bg-muted/50 border border-border/50',
                            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50',
                            'transition-all'
                        )}
                    />
                </div>
            )

        case 'daterange':
            return (
                <DateRangeFilter
                    label={config.label}
                    value={value as { from?: string; to?: string }}
                    onChange={onChange}
                    placeholder={config.placeholder}
                />
            )

        default:
            return null
    }
}

// ============================================
// SELECT FILTER
// ============================================

interface SelectFilterProps {
    label: string
    options: { label: string; value: string }[]
    value: string | undefined
    onChange: (value: unknown) => void
    placeholder?: string
}

const SelectFilter = ({
    options,
    value,
    onChange,
    placeholder
}: SelectFilterProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const selectedOption = options.find((o) => o.value === value)

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'h-9 px-3 text-sm rounded-lg inline-flex items-center gap-2',
                    'bg-muted/50 border border-border/50',
                    'hover:bg-muted transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary/20',
                    value && 'border-primary/30 bg-primary/5'
                )}
            >
                <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
                    {selectedOption?.label || placeholder || 'Select...'}
                </span>
                <ChevronDown
                    className={cn(
                        'w-3.5 h-3.5 text-muted-foreground transition-transform',
                        isOpen && 'rotate-180'
                    )}
                />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-1 z-50 min-w-[160px] bg-card rounded-lg border border-border shadow-lg py-1 max-h-[240px] overflow-auto">
                        {/* Clear option */}
                        {value && (
                            <button
                                onClick={() => {
                                    onChange(undefined)
                                    setIsOpen(false)
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted transition-colors"
                            >
                                Clear selection
                            </button>
                        )}

                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value)
                                    setIsOpen(false)
                                }}
                                className={cn(
                                    'w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors',
                                    option.value === value && 'bg-primary/5 text-primary'
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

// ============================================
// MULTI-SELECT FILTER
// ============================================

interface MultiSelectFilterProps {
    label: string
    options: { label: string; value: string }[]
    value: string[]
    onChange: (value: unknown) => void
    placeholder?: string
}

const MultiSelectFilter = ({
    options,
    value,
    onChange,
    placeholder
}: MultiSelectFilterProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOption = (optionValue: string) => {
        if (value.includes(optionValue)) {
            onChange(value.filter((v) => v !== optionValue))
        } else {
            onChange([...value, optionValue])
        }
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'h-9 px-3 text-sm rounded-lg inline-flex items-center gap-2',
                    'bg-muted/50 border border-border/50',
                    'hover:bg-muted transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary/20',
                    value.length > 0 && 'border-primary/30 bg-primary/5'
                )}
            >
                <span
                    className={
                        value.length > 0 ? 'text-foreground' : 'text-muted-foreground'
                    }
                >
                    {value.length > 0
                        ? `${value.length} selected`
                        : placeholder || 'Select...'}
                </span>
                <ChevronDown
                    className={cn(
                        'w-3.5 h-3.5 text-muted-foreground transition-transform',
                        isOpen && 'rotate-180'
                    )}
                />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-1 z-50 min-w-[180px] bg-card rounded-lg border border-border shadow-lg py-1 max-h-[280px] overflow-auto">
                        {/* Clear all */}
                        {value.length > 0 && (
                            <button
                                onClick={() => onChange([])}
                                className="w-full px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted transition-colors border-b border-border/50 mb-1"
                            >
                                Clear all
                            </button>
                        )}

                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => toggleOption(option.value)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                            >
                                <div
                                    className={cn(
                                        'w-4 h-4 rounded border flex items-center justify-center',
                                        value.includes(option.value)
                                            ? 'bg-primary border-primary'
                                            : 'border-border'
                                    )}
                                >
                                    {value.includes(option.value) && (
                                        <svg
                                            className="w-3 h-3 text-primary-foreground"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    )}
                                </div>
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

// ============================================
// DATE RANGE FILTER
// ============================================

interface DateRangeFilterProps {
    label: string
    value: { from?: string; to?: string } | undefined
    onChange: (value: unknown) => void
    placeholder?: string
}

const DateRangeFilter = ({
    value,
    onChange,
    placeholder
}: DateRangeFilterProps) => {
    const hasValue = value?.from || value?.to

    return (
        <div className="inline-flex items-center gap-1.5">
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="date"
                    placeholder={placeholder || 'From'}
                    value={value?.from || ''}
                    onChange={(e) => onChange({ ...value, from: e.target.value })}
                    className={cn(
                        'h-9 pl-9 pr-3 text-sm rounded-lg w-[150px]',
                        'bg-muted/50 border border-border/50',
                        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50',
                        'transition-all'
                    )}
                />
            </div>
            <span className="text-muted-foreground text-sm">to</span>
            <input
                type="date"
                value={value?.to || ''}
                onChange={(e) => onChange({ ...value, to: e.target.value })}
                className={cn(
                    'h-9 px-3 text-sm rounded-lg w-[150px]',
                    'bg-muted/50 border border-border/50',
                    'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50',
                    'transition-all'
                )}
            />
            {hasValue && (
                <button
                    onClick={() => onChange(undefined)}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                >
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
            )}
        </div>
    )
}

export default FilterBar
