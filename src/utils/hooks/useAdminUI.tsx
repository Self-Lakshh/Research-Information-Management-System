import { cn } from '@/components/shadcn/utils'
import type { ApprovalStatus, RecordType, UserRole } from '@/@types/admin'
import { recordTypeMeta } from '@/configs/admin.config'

export const useAdminUI = () => {

    const baseBadge =
        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border'

    /* ---------------- STATUS BADGE ---------------- */
    const StatusBadge = ({ status, className }: { status: ApprovalStatus; className?: string }) => {
        const styles: Record<ApprovalStatus, string> = {
            pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
            approved: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
            rejected: 'bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/10 dark:text-destructive dark:border-destructive/20',
            draft: 'bg-muted text-muted-foreground border-border'
        }

        const labels: Record<ApprovalStatus, string> = {
            pending: 'Pending',
            approved: 'Approved',
            rejected: 'Rejected',
            draft: 'Draft'
        }

        return (
            <span className={cn(baseBadge, styles[status], className)}>
                {labels[status]}
            </span>
        )
    }

    /* ---------------- RECORD TYPE BADGE ---------------- */
    const RecordTypeBadge = ({
        type,
        className,
        showLabel = true,
    }: {
        type: RecordType
        className?: string
        showLabel?: boolean
    }) => {
        const meta = recordTypeMeta[type]
        if (!meta) return null

        return (
            <span className={cn(baseBadge, meta.badgeColor, className)}>
                {showLabel ? meta.shortLabel : meta.label}
            </span>
        )
    }

    /* ---------------- ROLE BADGE ---------------- */
    const RoleBadge = ({ role, className }: { role: UserRole; className?: string }) => {
        const styles: Record<UserRole, string> = {
            admin: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900',
            faculty: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
            hod: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-900',
            dean: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
            viewer: 'bg-muted text-muted-foreground border-border'
        }

        const labels: Record<UserRole, string> = {
            admin: 'Admin',
            faculty: 'Faculty',
            hod: 'HOD',
            dean: 'Dean',
            viewer: 'Viewer'
        }

        return (
            <span className={cn(baseBadge, styles[role], className)}>
                {labels[role]}
            </span>
        )
    }

    /* ---------------- USER STATUS BADGE ---------------- */
    const UserStatusBadge = ({
        status,
        className,
    }: {
        status: 'active' | 'inactive'
        className?: string
    }) => {
        return (
            <span
                className={cn(
                    'inline-flex items-center gap-1.5 text-xs font-medium',
                    status === 'active'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-muted-foreground',
                    className
                )}
            >
                <span
                    className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        status === 'active'
                            ? 'bg-emerald-500'
                            : 'bg-muted-foreground/50'
                    )}
                />
                {status === 'active' ? 'Active' : 'Inactive'}
            </span>
        )
    }

    return {
        StatusBadge,
        RecordTypeBadge,
        RoleBadge,
        UserStatusBadge,
    }
}