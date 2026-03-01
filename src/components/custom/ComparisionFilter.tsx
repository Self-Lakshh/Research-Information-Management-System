import React from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/components/shadcn/utils'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/shadcn/ui/popover'
import { Checkbox } from '@/components/shadcn/ui/checkbox'

interface ComparisionFilterProps {
    availableYears: string[]
    selectedYears: string[]
    onChange: (years: string[]) => void
    className?: string
}

const ComparisionFilter = ({ availableYears, selectedYears, onChange, className }: ComparisionFilterProps) => {
    const toggleYear = (year: string) => {
        if (selectedYears.includes(year)) {
            onChange(selectedYears.filter(y => y !== year))
        } else {
            onChange([...selectedYears, year])
        }
    }

    const isSelected = selectedYears.length > 0

    return (
        <div className={cn("flex flex-col gap-1", className)}>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Compare</span>
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        className={cn(
                            "flex items-center justify-between w-[150px] h-9 px-3 text-xs font-bold transition-all border rounded-lg",
                            isSelected
                                ? "bg-primary/10 border-primary/50 text-primary shadow-sm"
                                : "bg-card border-border/60 text-muted-foreground hover:bg-muted/50 hover:border-border/80 shadow-sm"
                        )}
                    >
                        <span className="truncate">
                            {selectedYears.length === 0
                                ? "No Comparison"
                                : selectedYears.length === 1
                                    ? `VS ${selectedYears[0]}`
                                    : `${selectedYears.length} Selected`
                            }
                        </span>
                        <ChevronDown className="w-4 h-4 opacity-50 shrink-0" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-[180px] p-2 rounded-xl border-border/60 shadow-premium" align="start">
                    <div className="space-y-1">
                        <button
                            onClick={() => onChange([])}
                            className="flex items-center w-full px-2 py-1.5 text-[11px] font-bold text-muted-foreground hover:bg-muted/50 rounded-md transition-all text-left"
                        >
                            Reset Selection
                        </button>
                        <div className="h-px bg-border/40 my-1" />
                        <div className="max-h-[200px] overflow-y-auto no-scrollbar space-y-0.5">
                            {availableYears.map((year) => (
                                <div
                                    key={year}
                                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/50 rounded-md cursor-pointer transition-all group"
                                    onClick={() => toggleYear(year)}
                                >
                                    <Checkbox
                                        id={`year-${year}`}
                                        checked={selectedYears.includes(year)}
                                        onCheckedChange={() => toggleYear(year)}
                                        className="pointer-events-none"
                                    />
                                    <label
                                        htmlFor={`year-${year}`}
                                        className="text-[11px] font-bold text-foreground cursor-pointer flex-1"
                                    >
                                        VS {year}
                                    </label>
                                    {selectedYears.includes(year) && (
                                        <Check className="w-3.5 h-3.5 text-primary" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default ComparisionFilter
