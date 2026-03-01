import React from 'react'
import { LineChart as LineIcon, AreaChart as AreaCircleIcon, BarChart as BarIcon } from 'lucide-react'
import { cn } from '@/components/shadcn/utils'

interface ChartHeaderProps {
    title: string
    chartType: 'line' | 'area' | 'bar'
    onChartTypeChange: (type: 'line' | 'area' | 'bar') => void
    className?: string
}

const ChartHeader = ({ title, chartType, onChartTypeChange, className }: ChartHeaderProps) => {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", className)}>
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">{title}</h2>
            </div>
            <div className="flex items-center bg-muted/20 p-1 rounded-xl border border-border/50">
                <button
                    onClick={() => onChartTypeChange('area')}
                    className={cn(
                        "p-2 rounded-lg transition-all",
                        chartType === 'area' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <AreaCircleIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onChartTypeChange('line')}
                    className={cn(
                        "p-2 rounded-lg transition-all",
                        chartType === 'line' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <LineIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onChartTypeChange('bar')}
                    className={cn(
                        "p-2 rounded-lg transition-all",
                        chartType === 'bar' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <BarIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

export default ChartHeader
