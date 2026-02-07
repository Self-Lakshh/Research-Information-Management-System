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
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'indigo' | 'rose' | 'amber' | 'emerald' | 'azure'
}

const variantStyles = {
    default: 'bg-card border-border/50 hover:border-border',
    primary: 'bg-primary/5 border-primary/20 hover:border-primary/40',
    success: 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40',
    warning: 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40',
    error: 'bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40',
    indigo: 'bg-indigo-500/5 border-indigo-500/20 hover:border-indigo-500/40',
    rose: 'bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40',
    amber: 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40',
    emerald: 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40',
    azure: 'bg-sky-500/5 border-sky-500/20 hover:border-sky-500/40',
}

const iconStyles = {
    default: 'bg-muted/50 text-muted-foreground',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-emerald-500/10 text-emerald-600',
    warning: 'bg-amber-500/10 text-amber-600',
    error: 'bg-rose-500/10 text-rose-600',
    indigo: 'bg-indigo-500/10 text-indigo-600',
    rose: 'bg-rose-500/10 text-rose-600',
    amber: 'bg-amber-500/10 text-amber-600',
    emerald: 'bg-emerald-500/10 text-emerald-600',
    azure: 'bg-sky-500/10 text-sky-600',
}

export const StatCard = ({
    label,
    value,
    icon,
    className,
    variant = 'default'
}: StatCardProps) => {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-2xl border p-4 transition-all duration-300',
                'group hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5',
                variantStyles[variant],
                className
            )}
        >
            {/* Background Decorative Element */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-current opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.05] transition-opacity pointer-events-none" />

            <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                    {/* Icon Container */}
                    {icon && (
                        <div className={cn(
                            "flex-shrink-0 p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110",
                            iconStyles[variant]
                        )}>
                            {icon}
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    {/* Label */}
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        {label}
                    </p>

                    {/* Value */}
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-black text-foreground tracking-tighter">
                            {value}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatCard
