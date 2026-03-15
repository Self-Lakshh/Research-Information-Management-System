import React from 'react'
import { cn } from '@/components/shadcn/utils'
import { Card } from '@/components/shadcn/ui/card'

export interface StatCardProps {
    label?: string
    title?: string
    value: string | number
    icon?: React.ElementType | React.ReactNode
    description?: string
    subtext?: string
    variant?: 'primary' | 'indigo' | 'azure' | 'rose' | 'amber' | 'emerald' | 'warning' | 'cyan' | 'teal' | 'success' | 'error' | 'default'
    colorClass?: string
    className?: string
    onClick?: () => void
    isLoading?: boolean
}

const variantStyles: Record<string, { bg: string; border: string; color: string }> = {
    default: { bg: 'bg-muted/5', border: 'border-muted/10', color: 'text-muted-foreground' },
    primary: { bg: 'bg-primary/5', border: 'border-primary/10', color: 'text-primary' },
    indigo: { bg: 'bg-indigo-500/5', border: 'border-indigo-500/10', color: 'text-indigo-500' },
    azure: { bg: 'bg-sky-500/5', border: 'border-sky-500/10', color: 'text-sky-500' },
    rose: { bg: 'bg-rose-500/5', border: 'border-rose-500/10', color: 'text-rose-500' },
    amber: { bg: 'bg-amber-500/5', border: 'border-amber-500/10', color: 'text-amber-500' },
    emerald: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/10', color: 'text-emerald-500' },
    teal: { bg: 'bg-teal-500/5', border: 'border-teal-500/10', color: 'text-teal-500' },
    cyan: { bg: 'bg-cyan-500/5', border: 'border-cyan-500/10', color: 'text-cyan-500' },
    warning: { bg: 'bg-amber-500/5', border: 'border-amber-500/10', color: 'text-amber-500' },
    success: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/10', color: 'text-emerald-500' },
    error: { bg: 'bg-destructive/5', border: 'border-destructive/10', color: 'text-destructive' },
}

export const StatCard = ({
    label,
    title,
    value,
    icon: IconOrElement,
    description,
    subtext,
    variant = 'default',
    colorClass,
    className,
    onClick,
    isLoading
}: StatCardProps) => {
    const textLabel = label || title
    const textDesc = description || subtext
    const style = variantStyles[variant] || variantStyles.default

    const renderIcon = (size: string) => {
        if (!IconOrElement) return null
        if (React.isValidElement(IconOrElement)) return IconOrElement
        const Icon = IconOrElement as React.ElementType
        return <Icon className={size} />
    }

    return (
        <Card
            className={cn(
                "p-5 border shadow-soft rounded-[1.5rem] hover:shadow-premium transition-all duration-300 relative cursor-pointer group h-full",
                style.bg,
                style.border,
                className
            )}
            onClick={onClick}
        >
            <div className="flex flex-col h-full gap-3">
                <div className="flex items-start justify-between shrink-0">
                    <div className={cn(
                        "transition-colors duration-300",
                        colorClass ? colorClass : style.color
                    )}>
                        {renderIcon("w-5 h-5")}
                    </div>
                </div>

                <div className="flex flex-col flex-auto min-w-0">
                    <div className="min-h-[2rem] flex items-start">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest line-clamp-2 leading-tight">
                            {textLabel}
                        </span>
                    </div>

                    <span className="text-2xl font-black text-foreground tabular-nums tracking-tight">
                        {isLoading ? '...' : value}
                    </span>

                    {textDesc && (
                        <p className="text-[10px] font-medium text-muted-foreground/60 line-clamp-1 italic mt-auto pt-1">
                            {textDesc}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    )
}

export default StatCard
