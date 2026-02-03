import { cn } from '@/components/shadcn/utils'
import type { ApprovalStatus, RecordType } from '../types'
import { recordTypeMeta } from '../config/recordTypeMeta'

// ============================================
// STATUS BADGE
// ============================================

interface StatusBadgeProps {
    status: ApprovalStatus
    className?: string
}

const statusStyles: Record<ApprovalStatus, string> = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
}

const statusLabels: Record<ApprovalStatus, string> = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    draft: 'Draft'
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                statusStyles[status],
                className
            )}
        >
            {statusLabels[status]}
        </span>
    )
}

// ============================================
// RECORD TYPE BADGE
// ============================================

interface RecordTypeBadgeProps {
    type: RecordType
    className?: string
    showLabel?: boolean
}

export const RecordTypeBadge = ({
    type,
    className,
    showLabel = true
}: RecordTypeBadgeProps) => {
    const meta = recordTypeMeta[type]

    return (
        <span
            className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                meta.badgeColor,
                className
            )}
        >
            {showLabel ? meta.shortLabel : meta.label}
        </span>
    )
}

// ============================================
// USER ROLE BADGE
// ============================================

type UserRole = 'admin' | 'faculty' | 'hod' | 'dean' | 'viewer'

interface RoleBadgeProps {
    role: UserRole
    className?: string
}

const roleStyles: Record<UserRole, string> = {
    admin: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    faculty: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    hod: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    dean: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    viewer: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
}

const roleLabels: Record<UserRole, string> = {
    admin: 'Admin',
    faculty: 'Faculty',
    hod: 'HOD',
    dean: 'Dean',
    viewer: 'Viewer'
}

export const RoleBadge = ({ role, className }: RoleBadgeProps) => {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                roleStyles[role],
                className
            )}
        >
            {roleLabels[role]}
        </span>
    )
}

// ============================================
// USER STATUS BADGE
// ============================================

interface UserStatusBadgeProps {
    status: 'active' | 'inactive'
    className?: string
}

export const UserStatusBadge = ({ status, className }: UserStatusBadgeProps) => {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 text-xs',
                status === 'active' ? 'text-emerald-600' : 'text-muted-foreground',
                className
            )}
        >
            <span
                className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground/50'
                )}
            />
            {status === 'active' ? 'Active' : 'Inactive'}
        </span>
    )
}

export default StatusBadge
