import { cn } from '@/components/shadcn/utils'

interface PageHeaderProps {
    title: string
    subtitle?: string
    actions?: React.ReactNode
    className?: string
}

export const PageHeader = ({
    title,
    subtitle,
    actions,
    className
}: PageHeaderProps) => {
    return (
        <div className={cn('flex items-start justify-between gap-4', className)}>
            <div>
                <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
                {subtitle && (
                    <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
                )}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
    )
}

interface PageContainerProps {
    children: React.ReactNode
    className?: string
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
    return <div className={cn('space-y-6', className)}>{children}</div>
}

interface EmptyStateProps {
    icon?: React.ReactNode
    title: string
    description: string
    action?: React.ReactNode
    className?: string
}

export const EmptyState = ({
    icon,
    title,
    description,
    action,
    className
}: EmptyStateProps) => {
    return (
        <div
            className={cn(
                'bg-card rounded-xl border border-border/50 p-12 text-center',
                className
            )}
        >
            {icon && (
                <div className="flex justify-center mb-4 text-muted-foreground">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            {action}
        </div>
    )
}

interface SectionCardProps {
    title?: string
    subtitle?: string
    action?: React.ReactNode
    children: React.ReactNode
    className?: string
    noPadding?: boolean
}

export const SectionCard = ({
    title,
    subtitle,
    action,
    children,
    className,
    noPadding = false
}: SectionCardProps) => {
    return (
        <div
            className={cn('bg-card rounded-xl border border-border/50', className)}
        >
            {(title || action) && (
                <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border/50">
                    <div>
                        {title && (
                            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                        )}
                        {subtitle && (
                            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
                        )}
                    </div>
                    {action}
                </div>
            )}
            <div className={noPadding ? '' : 'p-5'}>{children}</div>
        </div>
    )
}

export default PageContainer
