import { cn } from '@/components/shadcn/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
    label: string
    value: string | number
    trend?: {
        value: number
        direction: 'up' | 'down'
    }
    subtext?: string
    icon?: React.ReactNode
    className?: string
}

export const StatCard = ({
    label,
    value,
    trend,
    subtext,
    icon,
    className
}: StatCardProps) => {
    return (
        <div
            className={cn(
                'bg-card rounded-xl border border-border/50 p-5',
                'transition-all duration-200',
                'hover:shadow-sm hover:border-border',
                className
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {/* Label */}
                    <p className="text-sm text-muted-foreground font-medium truncate">
                        {label}
                    </p>

                    {/* Value */}
                    <p className="text-2xl font-semibold text-foreground mt-1.5 tracking-tight">
                        {value}
                    </p>

                    {/* Trend or Subtext */}
                    {(trend || subtext) && (
                        <div className="mt-2 flex items-center gap-1.5">
                            {trend && (
                                <>
                                    {trend.direction === 'up' ? (
                                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                        <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                                    )}
                                    <span
                                        className={cn(
                                            'text-xs font-medium',
                                            trend.direction === 'up'
                                                ? 'text-emerald-600'
                                                : 'text-rose-600'
                                        )}
                                    >
                                        {trend.value > 0 ? '+' : ''}
                                        {trend.value}%
                                    </span>
                                </>
                            )}
                            {subtext && (
                                <span className="text-xs text-muted-foreground">{subtext}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Icon */}
                {icon && (
                    <div className="flex-shrink-0 p-2.5 bg-muted/50 rounded-lg text-muted-foreground">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    )
}

export default StatCard
