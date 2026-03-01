import { X, Search } from 'lucide-react'
import { FilterConfig } from '@/configs/rims.config'
import classNames from '@/utils/classNames'

interface FilterBarProps {
    filters: FilterConfig[]
    values: Record<string, any>
    onChange: (key: string, value: any) => void
    onClear: () => void
    className?: string
}

export const FilterBar = ({
    filters,
    values,
    onChange,
    onClear,
    className
}: FilterBarProps) => {
    const hasFilters = Object.values(values).some(val => val !== undefined && val !== '' && val !== 'all')

    return (
        <div className={classNames(
            "flex flex-wrap items-center gap-3 bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-premium",
            className
        )}>
            {/* Search Input (Global for FilterBar if needed, but usually handled by Searchbar component) */}
            {/* Here we Map the Dynamic Filters */}
            {filters.map((filter) => (
                <div key={filter.key} className="flex flex-col gap-1">
                    {filter.type === 'select' && (
                        <select
                            value={values[filter.key] || 'all'}
                            onChange={(e) => onChange(filter.key, e.target.value)}
                            className="h-10 px-3 py-2 text-sm bg-background border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer min-w-[140px]"
                        >
                            {filter.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            ))}

            {hasFilters && (
                <button
                    onClick={onClear}
                    className="h-10 px-4 flex items-center gap-2 text-sm font-bold text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 ml-auto"
                >
                    <X className="w-4 h-4" />
                    Reset
                </button>
            )}
        </div>
    )
}

export default FilterBar
