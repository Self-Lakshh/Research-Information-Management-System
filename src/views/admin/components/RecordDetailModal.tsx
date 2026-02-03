import { Modal } from './Modal'
import { DynamicFieldRenderer } from './DynamicFieldRenderer'
import { StatusBadge, RecordTypeBadge } from './Badges'
import type { ResearchRecord } from '../types'
import { cn } from '@/components/shadcn/utils'
import { Calendar, User, FileText, ExternalLink } from 'lucide-react'

interface RecordDetailModalProps {
    isOpen: boolean
    onClose: () => void
    record: ResearchRecord | null
}

export const RecordDetailModal = ({
    isOpen,
    onClose,
    record
}: RecordDetailModalProps) => {
    if (!record) return null

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={record.title}
            subtitle={`${record.type.toUpperCase()} Record`}
            size="lg"
            footer={
                <button
                    onClick={onClose}
                    className={cn(
                        'px-4 py-2 text-sm font-medium rounded-lg',
                        'bg-muted hover:bg-muted/80 text-foreground',
                        'transition-colors'
                    )}
                >
                    Close
                </button>
            }
        >
            {/* Header info */}
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-5 border-b border-border/50">
                <RecordTypeBadge type={record.type} showLabel={false} />
                <StatusBadge status={record.status} />
            </div>

            {/* Meta info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pb-5 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-muted/50 rounded-lg">
                        <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Author</p>
                        <p className="text-sm font-medium text-foreground">{record.author}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="p-2 bg-muted/50 rounded-lg">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Domain</p>
                        <p className="text-sm font-medium text-foreground">{record.domain}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="p-2 bg-muted/50 rounded-lg">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Year</p>
                        <p className="text-sm font-medium text-foreground">{record.year}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="p-2 bg-muted/50 rounded-lg">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Submitted</p>
                        <p className="text-sm font-medium text-foreground">
                            {formatDate(record.submittedAt)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Description */}
            {record.description && (
                <div className="mb-6">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Description
                    </h4>
                    <p className="text-sm text-foreground leading-relaxed">
                        {record.description}
                    </p>
                </div>
            )}

            {/* Dynamic fields */}
            <div className="space-y-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Record Details
                </h4>
                <DynamicFieldRenderer
                    recordType={record.type}
                    data={record.data}
                    layout="grid"
                />
            </div>
        </Modal>
    )
}

// ============================================
// USER FORM MODAL
// ============================================

interface UserFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: UserFormData) => void
    initialData?: UserFormData
    mode: 'create' | 'edit'
    loading?: boolean
}

export interface UserFormData {
    name: string
    email: string
    role: string
    department: string
    status: 'active' | 'inactive'
}

export const UserFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    mode,
    loading = false
}: UserFormModalProps) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        onSubmit({
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            role: formData.get('role') as string,
            department: formData.get('department') as string,
            status: formData.get('status') as 'active' | 'inactive'
        })
    }

    const inputClasses = cn(
        'w-full px-3 py-2 text-sm rounded-lg',
        'bg-muted/50 border border-border/50',
        'placeholder:text-muted-foreground',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50',
        'transition-all'
    )

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === 'create' ? 'Add New User' : 'Edit User'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                        Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={initialData?.name}
                        required
                        placeholder="Enter full name"
                        className={inputClasses}
                    />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                        Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        defaultValue={initialData?.email}
                        required
                        placeholder="Enter email address"
                        className={inputClasses}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Role */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Role <span className="text-rose-500">*</span>
                        </label>
                        <select
                            name="role"
                            defaultValue={initialData?.role || ''}
                            required
                            className={inputClasses}
                        >
                            <option value="">Select role</option>
                            <option value="admin">Admin</option>
                            <option value="faculty">Faculty</option>
                            <option value="hod">HOD</option>
                            <option value="dean">Dean</option>
                            <option value="viewer">Viewer</option>
                        </select>
                    </div>

                    {/* Department */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Department <span className="text-rose-500">*</span>
                        </label>
                        <select
                            name="department"
                            defaultValue={initialData?.department || ''}
                            required
                            className={inputClasses}
                        >
                            <option value="">Select department</option>
                            <option value="cs">Computer Science</option>
                            <option value="ece">Electronics</option>
                            <option value="mech">Mechanical</option>
                            <option value="civil">Civil</option>
                            <option value="biotech">Biotechnology</option>
                            <option value="mgmt">Management</option>
                        </select>
                    </div>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Status</label>
                    <select
                        name="status"
                        defaultValue={initialData?.status || 'active'}
                        className={inputClasses}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className={cn(
                            'px-4 py-2 text-sm font-medium rounded-lg',
                            'bg-muted hover:bg-muted/80 text-foreground',
                            'transition-colors',
                            'disabled:opacity-50'
                        )}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            'px-4 py-2 text-sm font-medium rounded-lg',
                            'bg-primary hover:bg-primary/90 text-primary-foreground',
                            'transition-colors',
                            'disabled:opacity-50'
                        )}
                    >
                        {loading ? 'Saving...' : mode === 'create' ? 'Add User' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatDate(dateStr: string): string {
    try {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    } catch {
        return dateStr
    }
}

export default RecordDetailModal
