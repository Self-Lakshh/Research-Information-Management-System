import { useEffect, useState } from 'react'
import {
    Plus,
    Edit2,
    Trash2,
    Mail,
    Download,
    Search,
    X
} from 'lucide-react'
import { Spinner } from '@/components/shadcn/ui/spinner'
import {
    Searchbar,
    ConfirmDialog,
    RoleFilter,
    DataTable,
} from '@/components/custom'
import { UserFormModal, UserFormData } from './components'
import { COMMON_FILTERS } from '@/configs/rims.config'
import type { User as AdminUser, UserRole as AdminUserRole } from '@/@types/admin'
import type { User, UserRole, CreateUserData, UpdateUserData } from '@/@types/rims.types'
import { useAdminUI } from '@/utils/hooks/useAdminUI'
import {
    getAllUsers,
    createUser as createFirestoreUser,
    updateUser,
    deactivateUser
} from '@/services/firebase/user.service'
import { createUserWithResetLink, createUserByAdmin } from '@/services/firebase/auth.service'
import { ColumnDef } from '@tanstack/react-table'
type TableUser = User & { id: string }


// ============================================
// USER MANAGEMENT PAGE
// ============================================

const UserManagement = () => {
    const [users, setUsers] = useState<TableUser[]>([])
    const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState<Record<string, unknown>>({})
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
    const { RoleBadge, UserStatusBadge } = useAdminUI()
    const fetchUsers = async () => {
        setLoading(true)
        try {
            const data = await getAllUsers()
            setUsers(data.map(u => ({ ...u, id: u.uid || '' } as TableUser)))
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleFilterChange = (key: string, value: unknown) => {
        setFilters((prev: Record<string, unknown>) => ({ ...prev, [key]: value }))
    }

    const handleClearFilters = () => {
        setFilters({})
    }

    const handleCreateUser = () => {
        setSelectedUser(null)
        setFormMode('create')
        setIsFormOpen(true)
    }

    const handleEditUser = (user: User) => {
        setSelectedUser(user)
        setFormMode('edit')
        setIsFormOpen(true)
    }

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user)
        setIsDeleteOpen(true)
    }

    const handleFormSubmit = async (data: UserFormData) => {
        setLoading(true)
        try {
            if (formMode === 'create') {
                // 1. Create auth user (client-side fallback)
                const { user: authUser, resetLink } = await createUserByAdmin({
                    email: data.email,
                    name: data.name,
                    role: data.role,
                    faculty: data.faculty,
                    phone_number: data.phone_number,
                    designation: data.designation
                })

                // 2. Create firestore user record (searchable manually or via client flow)
                const userData: CreateUserData = {
                    email: data.email,
                    name: data.name,
                    user_role: data.role as UserRole,
                    faculty: data.faculty,
                    password: '', // Ignored
                    phone_number: data.phone_number,
                    address: '',
                    designation: data.designation
                }

                await createFirestoreUser(authUser.uid, userData)
                console.log('User created via Client-Side Logic')

                if (resetLink) {
                    // In dev/without SMTP, we might want to show this link
                    console.log('Reset Link:', resetLink);
                    alert(`User created successfully.\n\nPassword Reset Link:\n${resetLink}\n\n(Copy this link as no email service is configured)`);
                } else {
                    alert('User created successfully. A password reset email has been sent to the user.');
                }
            } else if (selectedUser) {
                // Update existing user
                const updateData: UpdateUserData = {
                    name: data.name,
                    faculty: data.faculty,
                    phone_number: data.phone_number,
                    designation: data.designation,
                    is_active: data.status === 'active'
                }
                if (!selectedUser?.uid) {
                    throw new Error('No user selected for update')
                }
                await updateUser(selectedUser.uid, updateData)
                console.log('User updated successfully')
            }

            fetchUsers()
            setIsFormOpen(false)
        } catch (error) {
            console.error('Error saving user:', error)
            alert('Failed to save user. Check console for details.')
        } finally {
            setLoading(false)
        }
    }

    const handleConfirmDelete = async () => {
        if (!selectedUser?.uid) return

        try {
            await deactivateUser(selectedUser.uid)
            console.log('User deactivated:', selectedUser.uid)
            fetchUsers()
            setIsDeleteOpen(false)
        } catch (error) {
            console.error('Error deactivating user:', error)
            alert('Failed to deactivate user.')
        }
    }

    const handleSendEmail = async (user: User) => {
        if (!user.email) {
            alert('User profile does not have an email address.')
            return
        }

        if (!confirm(`Send password reset email to ${user.email}?`)) return

        try {
            const { resetPassword } = await import('@/services/firebase/auth.service')
            await resetPassword(user.email)
            alert(`Password reset email sent to ${user.email}`)
        } catch (error) {
            console.error(error)
            alert('Failed to send email.')
        }
    }

    const columns: ColumnDef<TableUser>[] = [
        {
            accessorKey: 'name',
            header: 'Researcher',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shadow-inner">
                        {row.original.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground leading-tight">{row.original.name || 'Anonymous'}</p>
                        <p className="text-[11px] text-muted-foreground font-medium">{row.original.email || 'No email'}</p>
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'user_role',
            header: 'Role',
            cell: ({ row }) => <RoleBadge role={row.original.user_role as AdminUserRole} />
        },
        {
            accessorKey: 'faculty',
            header: 'Faculty',
            cell: ({ row }) => <span className="text-sm font-medium">{row.original.faculty}</span>
        },
        {
            accessorKey: 'created_at',
            header: 'Joined',
            cell: ({ row }) => <span className="text-sm font-medium tabular-nums">{formatDate(row.original.created_at)}</span>
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => (
                <UserStatusBadge status={row.original.is_active ? 'active' : 'inactive'} />
            )
        }
    ]

    return (
        <div className="flex flex-col h-full min-w-0 overflow-hidden gap-6">
            {/* Page Header & Control Bar */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-5 shadow-premium flex flex-col gap-4 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-foreground tracking-tight">
                            User Management
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleCreateUser}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft transition-all duration-300"
                        >
                            <Plus className="w-4 h-4" />
                            Add User
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border/50">
                    <Searchbar
                        value={(filters.searchQuery as string) || ''}
                        onChange={(val) => handleFilterChange('searchQuery', val)}
                        className="w-full sm:max-w-xs"
                    />
                    <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
                        <RoleFilter
                            value={(filters.role as string) || 'all'}
                            onChange={(val) => handleFilterChange('role', val)}
                        />
                        {Object.keys(filters).length > 0 && (
                            <button
                                onClick={handleClearFilters}
                                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Area - This card now expands and handles internal scrolling */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-premium overflow-hidden flex flex-col flex-auto min-h-0">
                {loading ? (
                    <div className="flex-auto flex flex-col items-center justify-center py-20">
                        <Spinner className="w-8 h-8 text-primary" />
                    </div>
                ) : users.filter(user => {
                    const query = (filters.searchQuery as string || '').toLowerCase()
                    const role = filters.role as string || 'all'
                    const matchesSearch = !query || (
                        user.name?.toLowerCase().includes(query) ||
                        user.email?.toLowerCase().includes(query) ||
                        user.faculty?.toLowerCase().includes(query)
                    )
                    const matchesRole = role === 'all' || user.user_role === role
                    return matchesSearch && matchesRole
                }).length === 0 ? (
                    <div className="flex-auto flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">
                            No users found
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">
                            We couldn't find any users matching your current filters. Try adjusting your search or role filter.
                        </p>
                        {(filters.searchQuery || filters.role !== 'all') && (
                            <button
                                onClick={handleClearFilters}
                                className="mt-6 text-sm font-bold text-primary hover:underline"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex-auto flex flex-col min-h-0 p-0">
                        <DataTable<TableUser, any>
                            columns={columns}
                            data={users.filter(user => {
                                const query = (filters.searchQuery as string || '').toLowerCase()
                                const role = filters.role as string || 'all'

                                const matchesSearch = !query || (
                                    user.name?.toLowerCase().includes(query) ||
                                    user.email?.toLowerCase().includes(query) ||
                                    user.faculty?.toLowerCase().includes(query)
                                )

                                const matchesRole = role === 'all' || user.user_role === role

                                return matchesSearch && matchesRole
                            })}
                            rowActions={(row) => [
                                {
                                    label: 'Edit Profile',
                                    onClick: () => handleEditUser(row as User),
                                    icon: <Edit2 className="w-4 h-4" />
                                },
                                {
                                    label: 'Send Email',
                                    onClick: () => handleSendEmail(row as User),
                                    icon: <Mail className="w-4 h-4" />
                                },
                                {
                                    label: 'Deactivate',
                                    onClick: () => handleDeleteUser(row as User),
                                    icon: <Trash2 className="w-4 h-4" />,
                                    variant: 'danger'
                                }
                            ]}
                        />
                    </div>
                )}
            </div>

            {/* User Form Modal */}
            <UserFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                mode={formMode}
                initialData={
                    selectedUser
                        ? {
                            name: selectedUser.name || '',
                            email: selectedUser.email || '',
                            role: (selectedUser.user_role as string) || '',
                            faculty: selectedUser.faculty || '',
                            designation: selectedUser.designation || '',
                            phone_number: selectedUser.phone_number || '',
                            status: selectedUser.is_active ? 'active' : 'inactive'
                        }
                        : undefined
                }
                loading={loading}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete "${selectedUser?.name || 'this user'}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
            />
        </div>
    )
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatDate(date: any): string {
    if (!date) return '-'
    try {
        const d = date.toDate ? date.toDate() : new Date(date)
        return d.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    } catch {
        return '-'
    }
}

export default UserManagement
