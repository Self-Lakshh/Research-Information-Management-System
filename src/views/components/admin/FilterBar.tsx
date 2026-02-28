import { Search, X } from 'lucide-react'
import { Input } from "@/components/shadcn/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/ui/select"
import { Button } from "@/components/shadcn/ui/button"
import { FilterConfig } from '@/@types/admin'

interface FilterBarProps {
    filters: FilterConfig[]
    values: Record<string, any>
    onChange: (key: string, value: any) => void
    onClear: () => void
    searchPlaceholder?: string
}

export function FilterBar({
    filters,
    values,
    onChange,
    onClear,
    searchPlaceholder = "Search records..."
}: FilterBarProps) {
    const hasFilters = Object.values(values).some(v => v !== undefined && v !== 'all' && v !== '')

    return (
        <div className="flex flex-wrap items-center gap-3 bg-card p-3 rounded-lg border">
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={searchPlaceholder}
                    className="pl-9 h-9"
                    value={values.search || ''}
                    onChange={(e) => onChange('search', e.target.value)}
                />
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {filters.map((filter) => (
                    <div key={filter.key} className="w-[150px]">
                        <Select
                            value={String(values[filter.key] || 'all')}
                            onValueChange={(val) => onChange(filter.key, val)}
                        >
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder={filter.label} />
                            </SelectTrigger>
                            <SelectContent>
                                {filter.options?.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ))}

                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClear}
                        className="h-9 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    )
}
