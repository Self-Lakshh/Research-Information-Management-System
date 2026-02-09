import { useEffect, useState } from 'react'
import {
    Plus,
    Edit2,
    Trash2,
    Mail
} from 'lucide-react'
import {
    FilterBar,
    ConfirmDialog,
} from '@/components/admin'
import { DataTable } from '@/components/common'
import { UserFormModal, UserFormData } from './components'
import { userFilters } from '@/configs/admin.config'
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
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState<Record<string, unknown>>({})
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
    const { RoleBadge, UserStatusBadge } = useAdminUI()

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const data = await getAllUsers()
            setUsers(data)
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

                // 2. Create firestore user record (Required for client-side fallback)
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
                console.log('User created via Client-Side Logic (Spark Plan)')

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
        if (!selectedUser) return

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

    const columns: ColumnDef<TableUser>[] = [
        {
            accessorKey: 'name',
            header: 'Researcher',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shadow-inner">
                        {row.original.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground leading-tight">{row.original.name}</p>
                        <p className="text-[11px] text-muted-foreground font-medium">{row.original.email}</p>
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
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        User Management
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage users and their access permissions
                    </p>
                </div>
                <button
                    onClick={handleCreateUser}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft transition-all duration-300"
                >
                    <Plus className="w-4 h-4" />
                    Add User
                </button>
            </div>

            {/* Filters */}
            <FilterBar
                filters={userFilters}
                values={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
            />

            {/* Users Table */}
            <DataTable
                columns={columns}
                data={users.map(u => ({ ...u, id: u.uid }))}
                rowActions={(row) => [
                    {
                        label: 'Edit Profile',
                        onClick: () => handleEditUser(row as User),
                        icon: <Edit2 className="w-4 h-4" />
                    },
                    {
                        label: 'Send Email',
                        onClick: () => console.log('Email:', (row as User).email),
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

            {/* User Form Modal */}
            <UserFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                mode={formMode}
                initialData={
                    selectedUser
                        ? {
                            name: selectedUser.name,
                            email: selectedUser.email,
                            role: selectedUser.user_role,
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
                message={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone.`}
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
