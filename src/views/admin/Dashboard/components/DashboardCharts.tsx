import { cn } from '@/components/shadcn/utils'
import { MoreHorizontal } from 'lucide-react'

import type { ChartData } from '@/@types/admin'

interface ChartContainerProps {
    title: string
    subtitle?: string
    children: React.ReactNode
    action?: React.ReactNode
    className?: string
}

// Main container for charts
export const ChartContainer = ({
    title,
    subtitle,
    children,
    action,
    className
}: ChartContainerProps) => {
    return (
        <div
            className={cn(
                'bg-card rounded-xl border border-border/50 p-5',
                'flex flex-col',
                className
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
                    )}
                </div>
                {action || (
                    <button className="p-1 rounded-md hover:bg-muted transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                )}
            </div>

            {/* Chart Content */}
            <div className="flex-1 min-h-0">{children}</div>
        </div>
    )
}

// Bar Chart Placeholder
interface BarChartPlaceholderProps {
    data: ChartData[]
    className?: string
}

export const BarChartPlaceholder = ({
    data,
    className
}: BarChartPlaceholderProps) => {
    const maxValue = Math.max(...data.map((d) => d.value))

    return (
        <div className={cn('flex items-end gap-2 h-40', className)}>
            {data.map((item, index) => {
                const height = (item.value / maxValue) * 100

                return (
                    <div
                        key={index}
                        className="flex-1 flex flex-col items-center gap-1.5"
                    >
                        <div
                            className="w-full relative group"
                            style={{ height: '100%' }}
                        >
                            <div
                                className={cn(
                                    'absolute bottom-0 left-0 right-0 rounded-t-md transition-all duration-300',
                                    'bg-primary/80 hover:bg-primary',
                                    item.color
                                )}
                                style={{ height: `${height}%` }}
                            >
                                {/* Tooltip */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                                        {item.value}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground text-center truncate w-full">
                            {item.label}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}

// Donut Chart Placeholder
interface DonutChartPlaceholderProps {
    data: ChartData[]
    className?: string
}

export const DonutChartPlaceholder = ({
    data,
    className
}: DonutChartPlaceholderProps) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    const defaultColors = [
        'bg-primary',
        'bg-emerald-500',
        'bg-amber-500',
        'bg-rose-500',
        'bg-violet-500',
        'bg-cyan-500'
    ]

    return (
        <div className={cn('flex items-center gap-6', className)}>
            {/* Donut visualization placeholder */}
            <div className="relative w-28 h-28 flex-shrink-0">
                <div className="absolute inset-0 rounded-full border-[12px] border-muted" />
                <div className="absolute inset-3 rounded-full bg-card flex items-center justify-center">
                    <span className="text-lg font-semibold text-foreground">{total}</span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className={cn(
                                'w-2.5 h-2.5 rounded-full',
                                item.color || defaultColors[index % defaultColors.length]
                            )}
                        />
                        <span className="text-xs text-muted-foreground flex-1 truncate">
                            {item.label}
                        </span>
                        <span className="text-xs font-medium text-foreground">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Line Chart Placeholder
interface LineChartPlaceholderProps {
    data: ChartData[]
    className?: string
}

export const LineChartPlaceholder = ({
    data,
    className
}: LineChartPlaceholderProps) => {
    const maxValue = Math.max(...data.map((d) => d.value))

    return (
        <div className={cn('relative h-40', className)}>
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="border-t border-border/30" />
                ))}
            </div>

            {/* Points and lines */}
            <svg className="absolute inset-0 w-full h-full overflow-visible">
                <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                    points={data
                        .map((item, index) => {
                            const x = (index / (data.length - 1)) * 100
                            const y = 100 - (item.value / maxValue) * 100
                            return `${x}%,${y}%`
                        })
                        .join(' ')}
                />
                {data.map((item, index) => {
                    const x = (index / (data.length - 1)) * 100
                    const y = 100 - (item.value / maxValue) * 100
                    return (
                        <circle
                            key={index}
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r="4"
                            className="fill-primary"
                        />
                    )
                })}
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between translate-y-5">
                {data.map((item, index) => (
                    <span
                        key={index}
                        className="text-[10px] text-muted-foreground text-center"
                    >
                        {item.label}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default ChartContainer
