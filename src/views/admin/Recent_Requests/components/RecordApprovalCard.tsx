import { cn } from '@/components/shadcn/utils'
import { Check, X, Eye, Clock, User, FileText } from 'lucide-react'
import type { ApprovalRequest } from '@/@types/admin'
import { useAdminUI } from '@/utils/hooks/useAdminUI'

interface RecordApprovalCardProps {
    request: ApprovalRequest
    onApprove: (id: string) => void
    onReject: (id: string) => void
    onView: (id: string) => void
    className?: string
}

export const RecordApprovalCard = ({
    request,
    onApprove,
    onReject,
    onView,
    className
}: RecordApprovalCardProps) => {
    const { record, submittedBy, submittedAt } = request
    const { RecordTypeBadge, StatusBadge } = useAdminUI()

    return (
        <div
            className={cn(
                'bg-card rounded-xl border border-border/50 p-5',
                'transition-all duration-200',
                'hover:shadow-sm hover:border-border',
                className
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                    <RecordTypeBadge type={record.type} />
                    <StatusBadge status={record.status} />
                </div>
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2">
                {record.title}
            </h3>

            {/* Description */}
            {record.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {record.description}
                </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{submittedBy.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDate(submittedAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{record.domain}</span>
                </div>
            </div>

            {/* Actions */}
            <ApprovalActionBar
                onApprove={() => onApprove(request.id)}
                onReject={() => onReject(request.id)}
                onView={() => onView(request.id)}
            />
        </div>
    )
}

// ============================================
// APPROVAL ACTION BAR
// ============================================

interface ApprovalActionBarProps {
    onApprove: () => void
    onReject: () => void
    onView: () => void
    loading?: boolean
    className?: string
}

export const ApprovalActionBar = ({
    onApprove,
    onReject,
    onView,
    loading = false,
    className
}: ApprovalActionBarProps) => {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <button
                onClick={onApprove}
                disabled={loading}
                className={cn(
                    'flex-1 inline-flex items-center justify-center gap-1.5',
                    'px-3 py-2 text-sm font-medium rounded-lg',
                    'bg-emerald-600 hover:bg-emerald-700 text-white',
                    'transition-colors',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
            >
                <Check className="w-4 h-4" />
                Approve
            </button>

            <button
                onClick={onReject}
                disabled={loading}
                className={cn(
                    'flex-1 inline-flex items-center justify-center gap-1.5',
                    'px-3 py-2 text-sm font-medium rounded-lg',
                    'bg-rose-600 hover:bg-rose-700 text-white',
                    'transition-colors',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
            >
                <X className="w-4 h-4" />
                Reject
            </button>

            <button
                onClick={onView}
                disabled={loading}
                className={cn(
                    'inline-flex items-center justify-center gap-1.5',
                    'px-3 py-2 text-sm font-medium rounded-lg',
                    'bg-muted hover:bg-muted/80 text-foreground',
                    'transition-colors',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
            >
                <Eye className="w-4 h-4" />
                View
            </button>
        </div>
    )
}

// ============================================
// COMPACT APPROVAL CARD (for list view)
// ============================================

interface CompactApprovalCardProps {
    request: ApprovalRequest
    onApprove: (id: string) => void
    onReject: (id: string) => void
    onView: (id: string) => void
    className?: string
}

export const CompactApprovalCard = ({
    request,
    onApprove,
    onReject,
    onView,
    className
}: CompactApprovalCardProps) => {
    const { record, submittedBy, submittedAt } = request
    const { RecordTypeBadge } = useAdminUI()

    return (
        <div
            className={cn(
                'flex items-center gap-4 p-4 rounded-lg border border-border/50',
                'bg-card hover:bg-muted/30 transition-colors',
                className
            )}
        >
            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <RecordTypeBadge type={record.type} />
                    <span className="text-xs text-muted-foreground">
                        by {submittedBy.name}
                    </span>
                </div>
                <h4 className="text-sm font-medium text-foreground truncate">
                    {record.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Submitted {formatDate(submittedAt)}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                    onClick={() => onApprove(request.id)}
                    className="p-2 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors"
                    title="Approve"
                >
                    <Check className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onReject(request.id)}
                    className="p-2 rounded-md bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"
                    title="Reject"
                >
                    <X className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onView(request.id)}
                    className="p-2 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                    title="View details"
                >
                    <Eye className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatDate(dateStr: string): string {
    try {
        const date = new Date(dateStr)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} days ago`

        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    } catch {
        return dateStr
    }
}

export default RecordApprovalCard
