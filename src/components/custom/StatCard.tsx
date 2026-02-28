import React from 'react'
import { cn } from '@/components/shadcn/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/ui/card'

export interface StatCardProps {
    label?: string
    title?: string // Handle both label and title gracefully
    value: string | number
    icon?: React.ElementType | React.ReactNode
    description?: string // from User
    subtext?: string // from admin
    variant?: 'primary' | 'indigo' | 'azure' | 'rose' | 'amber' | 'emerald' | 'warning' | 'default' | 'success' | 'error'
    colorClass?: string // Support custom color class
    className?: string
    onClick?: () => void
}

const variantStyles = {
    default: 'bg-card border-muted/50 hover:border-muted/80',
    primary: 'bg-card border-primary/20 hover:border-primary/40',
    success: 'bg-card border-emerald-500/20 hover:border-emerald-500/40',
    warning: 'bg-card border-amber-500/20 hover:border-amber-500/40',
    error: 'bg-card border-destructive/20 hover:border-destructive/40',
    indigo: 'bg-card border-indigo-500/20 hover:border-indigo-500/40',
    rose: 'bg-card border-rose-500/20 hover:border-rose-500/40',
    amber: 'bg-card border-amber-500/20 hover:border-amber-500/40',
    emerald: 'bg-card border-emerald-500/20 hover:border-emerald-500/40',
    azure: 'bg-card border-sky-500/20 hover:border-sky-500/40',
}

const iconStyles = {
    default: 'bg-muted/50 text-muted-foreground',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-emerald-500/10 text-emerald-600',
    warning: 'bg-amber-500/10 text-amber-600',
    error: 'bg-destructive/10 text-destructive',
    indigo: 'bg-indigo-500/10 text-indigo-600',
    rose: 'bg-rose-500/10 text-rose-600',
    amber: 'bg-amber-500/10 text-amber-600',
    emerald: 'bg-emerald-500/10 text-emerald-600',
    azure: 'bg-sky-500/10 text-sky-600',
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
    onClick
}: StatCardProps) => {
    const textLabel = label || title
    const textDesc = description || subtext

    return (
        <Card
            className={cn(
                'relative overflow-hidden cursor-pointer rounded-2xl border transition-all duration-300',
                'group hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5',
                colorClass ? colorClass : variantStyles[variant],
                className
            )}
            onClick={onClick}
        >
            {/* Background Decorative Element */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-current opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.05] transition-opacity pointer-events-none" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    {textLabel}
                </CardTitle>
                {IconOrElement && (
                    <div className={cn(
                        "shrink-0 p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110",
                        colorClass ? "bg-background/50" : iconStyles[variant]
                    )}>
                        {React.isValidElement(IconOrElement) ? (
                            IconOrElement
                        ) : (
                            // @ts-ignore
                            <IconOrElement className="w-4 h-4" />
                        )}
                    </div>
                )}
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-black text-foreground tracking-tighter">
                        {value}
                    </h3>
                </div>
                {textDesc && (
                    <p className="text-xs text-muted-foreground mt-1">{textDesc}</p>
                )}
            </CardContent>
        </Card>
    )
}

export default StatCard
