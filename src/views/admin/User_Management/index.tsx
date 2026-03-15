import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Plus,
    Edit2,
    Trash2,
    Mail,
    UserCheck,
    Search,
    X,
    RefreshCw,
} from 'lucide-react'
import { Spinner } from '@/components/shadcn/ui/spinner'
import {
    Searchbar,
    ConfirmDialog,
    RoleFilter,
    DataTable,
} from '@/components/custom'
import { UserFormModal, UserFormData } from './components'
import type { User as AdminUser, UserRole as AdminUserRole } from '@/@types/admin'
import { User, RecordType } from '@/@types/rims.types';
import { CreateUserData, UpdateUserData } from '@/services/firebase/users/types';
import { useAdminUI } from '@/utils/hooks/useAdminUI'
import {
    adminGetAllUsers,
    adminCreateUser,
    adminUpdateUser,
    adminDeactivateUser,
    adminActivateUser,
    sendPasswordResetLink,
    type AdminUserRecord,
} from '@/services/firebase/admin.service'
import { ColumnDef } from '@tanstack/react-table'

type TableUser = AdminUserRecord & { id: string }

// ============================================
// USER MANAGEMENT PAGE (Netlify Functions)
// All user mutations go through admin-users Netlify Function.
// ============================================

const UserManagement = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState<TableUser[]>([])
    const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState<{ searchQuery: string; role: string }>({
        searchQuery: '',
        role: 'all',
    })
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isActivateOpen, setIsActivateOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<TableUser | null>(null)
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
    const { RoleBadge, UserStatusBadge } = useAdminUI()

    // ── Fetch ──────────────────────────────────────────────────────────────
    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const data = await adminGetAllUsers()
            setUsers(data.map(u => ({ ...u, id: u.uid ?? u.id ?? '' })))
        } catch (error: any) {
            console.error('[UserManagement] fetchUsers error:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    // ── Filter helpers ──────────────────────────────────────────────────────
    const setFilter = (key: keyof typeof filters, value: string) =>
        setFilters(prev => ({ ...prev, [key]: value }))

    const clearFilters = () => setFilters({ searchQuery: '', role: 'all' })

    const hasFilters = !!filters.searchQuery || filters.role !== 'all'

    const displayedUsers = users.filter(user => {
        const q = filters.searchQuery.toLowerCase()
        const role = filters.role

        const matchesSearch = !q || (
            (user.name || '').toLowerCase().includes(q) ||
            (user.email || '').toLowerCase().includes(q) ||
            (user.faculty || '').toLowerCase().includes(q)
        )
        const matchesRole = role === 'all' || user.user_role === role
        return matchesSearch && matchesRole
    })

    // ── Open handlers ───────────────────────────────────────────────────────
    const openCreate = () => { setSelectedUser(null); setFormMode('create'); setIsFormOpen(true) }
    const openEdit = (user: TableUser) => { setSelectedUser(user); setFormMode('edit'); setIsFormOpen(true) }
    const openDelete = (user: TableUser) => { setSelectedUser(user); setIsDeleteOpen(true) }
    const openActivate = (user: TableUser) => { setSelectedUser(user); setIsActivateOpen(true) }

    // ── Form submit (Create / Edit) ─────────────────────────────────────────
    const handleFormSubmit = async (data: UserFormData) => {
        setLoading(true)
        try {
            if (formMode === 'create') {
                // ── POST /.netlify/functions/admin-users ──────────────────────
                const result = await adminCreateUser({
                    email: data.email,
                    name: data.name,
                    user_role: (data.role as 'user' | 'admin') || 'user',
                    faculty: data.faculty,
                    phone_number: data.phone_number,
                    designation: data.designation,
                })
                alert(
                    result.resetLinkSent
                        ? `✓ "${data.name}" created. Password setup email sent to ${data.email}.`
                        : `✓ "${data.name}" created. No email service configured — send reset manually.`
                )
            } else if (selectedUser) {
                // ── PUT /.netlify/functions/admin-users ───────────────────────
                await adminUpdateUser({
                    user_id: selectedUser.id,
                    name: data.name,
                    faculty: data.faculty,
                    phone_number: data.phone_number,
                    designation: data.designation,
                    is_active: data.status === 'active',
                    user_role: data.role as 'user' | 'admin',
                })
            }

            await fetchUsers()
            setIsFormOpen(false)
        } catch (error: any) {
            console.error('[UserManagement] handleFormSubmit error:', error)
            alert(`Failed: ${error?.message || 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }

    // ── Soft-delete (deactivate) ────────────────────────────────────────────
    const handleConfirmDelete = async () => {
        if (!selectedUser) return
        try {
            // ── DELETE /.netlify/functions/admin-users ────────────────────────
            await adminDeactivateUser(selectedUser.id)
            await fetchUsers()
            setIsDeleteOpen(false)
        } catch (error: any) {
            console.error('[UserManagement] deactivate error:', error)
            alert(`Failed to deactivate: ${error?.message || 'Unknown error'}`)
        }
    }

    // ── Re-activate ─────────────────────────────────────────────────────────
    const handleConfirmActivate = async () => {
        if (!selectedUser) return
        try {
            // ── PUT /.netlify/functions/admin-users { is_active: true } ────────
            await adminActivateUser(selectedUser.id)
            await fetchUsers()
            setIsActivateOpen(false)
        } catch (error: any) {
            console.error('[UserManagement] activate error:', error)
            alert(`Failed to activate: ${error?.message || 'Unknown error'}`)
        }
    }

    // ── Send reset email ────────────────────────────────────────────────────
    const handleSendEmail = async (user: TableUser) => {
        if (!user.email) { alert('No email address on file.'); return }
        if (!confirm(`Send password reset email to ${user.email}?`)) return
        try {
            // ── POST /.netlify/functions/send-reset-link ──────────────────────
            await sendPasswordResetLink(user.email)
            alert(`✓ Password reset email sent to ${user.email}`)
        } catch (error: any) {
            console.error('[UserManagement] sendEmail error:', error)
            alert(`Failed to send email: ${error?.message || 'Unknown error'}`)
        }
    }

    // ── Table columns ───────────────────────────────────────────────────────
    const columns: ColumnDef<TableUser>[] = [
        {
            accessorKey: 'name',
            header: 'Researcher',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shadow-inner shrink-0">
                        {(row.original.name || '?').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground leading-tight">{row.original.name || 'Anonymous'}</p>
                        <p className="text-[11px] text-muted-foreground font-medium">{row.original.email || 'No email'}</p>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'user_role',
            header: 'Role',
            cell: ({ row }) => <RoleBadge role={row.original.user_role as AdminUserRole} />,
        },
        {
            accessorKey: 'faculty',
            header: 'Faculty',
            cell: ({ row }) => <span className="text-sm font-medium">{row.original.faculty || '—'}</span>,
        },
        {
            accessorKey: 'designation',
            header: 'Designation',
            cell: ({ row }) => <span className="text-sm font-medium text-muted-foreground">{row.original.designation || '—'}</span>,
        },
        {
            accessorKey: 'created_at',
            header: 'Joined',
            cell: ({ row }) => <span className="text-sm font-medium tabular-nums">{formatDate(row.original.created_at)}</span>,
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => <UserStatusBadge status={row.original.is_active ? 'active' : 'inactive'} />,
        },
    ]

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col h-full min-w-0 overflow-hidden gap-6">

            {/* Header & Controls */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-5 shadow-premium flex flex-col gap-4 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-foreground tracking-tight">User Management</h1>
                        {!loading && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {displayedUsers.length} of {users.length} researcher{users.length !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchUsers}
                            disabled={loading}
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all duration-200 disabled:opacity-40"
                            title="Refresh"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={openCreate}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft transition-all duration-300"
                        >
                            <Plus className="w-4 h-4" />
                            Add User
                        </button>
                    </div>
                </div>

                {/* Filter bar */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border/50">
                    <Searchbar
                        value={filters.searchQuery}
                        onChange={val => setFilter('searchQuery', val)}
                        className="w-full sm:max-w-xs"
                    />
                    <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
                        <RoleFilter
                            value={filters.role}
                            onChange={val => setFilter('role', val)}
                        />
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                title="Clear filters"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-premium overflow-hidden flex flex-col flex-auto min-h-0">
                {loading ? (
                    <div className="flex-auto flex flex-col items-center justify-center py-20">
                        <Spinner className="w-8 h-8 text-primary" />
                        <p className="text-sm text-muted-foreground mt-3 font-medium">Loading users…</p>
                    </div>
                ) : displayedUsers.length === 0 ? (
                    <div className="flex-auto flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">No users found</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">
                            {hasFilters
                                ? 'No users match your current filters. Try adjusting your search or role filter.'
                                : 'No users have been added yet. Create the first user using the button above.'}
                        </p>
                        {hasFilters && (
                            <button onClick={clearFilters} className="mt-6 text-sm font-bold text-primary hover:underline">
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex-auto flex flex-col min-h-0 p-0">
                        <DataTable<TableUser, any>
                            columns={columns}
                            data={displayedUsers}
                            rowActions={(row) => {
                                const u = row as TableUser
                                return [
                                    {
                                        label: 'View Profile',
                                        onClick: () => navigate(`/admin/user-profile/${u.id}`),
                                        icon: <Search className="w-4 h-4" />,
                                    },
                                    {
                                        label: 'Edit Info',
                                        onClick: () => openEdit(u),
                                        icon: <Edit2 className="w-4 h-4" />,
                                    },
                                    {
                                        label: 'Send Reset Email',
                                        onClick: () => handleSendEmail(u),
                                        icon: <Mail className="w-4 h-4" />,
                                    },
                                    // Toggle between activate / deactivate based on current status
                                    u.is_active
                                        ? {
                                            label: 'Deactivate',
                                            onClick: () => openDelete(u),
                                            icon: <Trash2 className="w-4 h-4" />,
                                            variant: 'danger' as const,
                                        }
                                        : {
                                            label: 'Re-activate',
                                            onClick: () => openActivate(u),
                                            icon: <UserCheck className="w-4 h-4" />,
                                            variant: 'success' as const,
                                        },
                                ]
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            <UserFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                mode={formMode}
                initialData={
                    selectedUser
                        ? {
                            name: selectedUser.name ?? '',
                            email: selectedUser.email ?? '',
                            role: selectedUser.user_role ?? 'user',
                            faculty: selectedUser.faculty ?? '',
                            designation: selectedUser.designation ?? '',
                            phone_number: selectedUser.phone_number ?? '',
                            status: selectedUser.is_active ? 'active' : 'inactive',
                        }
                        : undefined
                }
                loading={loading}
            />

            {/* Deactivate Confirm */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Deactivate User"
                message={`Deactivate "${selectedUser?.name || 'this user'}"? Their account will be disabled but all data is preserved. You can re-activate them later.`}
                confirmLabel="Deactivate"
                variant="danger"
            />

            {/* Re-activate Confirm */}
            <ConfirmDialog
                isOpen={isActivateOpen}
                onClose={() => setIsActivateOpen(false)}
                onConfirm={handleConfirmActivate}
                title="Activate User"
                message={`Re-activate "${selectedUser?.name || 'this user'}"? They will be able to sign in again immediately.`}
                confirmLabel="Activate"
                variant="default"
            />
        </div>
    )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(date: any): string {
    if (!date) return '—'
    try {
        const d = date.toDate ? date.toDate() : new Date(date)
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
        return '—'
    }
}

export default UserManagement
