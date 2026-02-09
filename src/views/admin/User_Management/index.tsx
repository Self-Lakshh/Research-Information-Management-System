import { useState } from 'react'
import {
    Plus,
    Edit2,
    Trash2,
    Mail
} from 'lucide-react'
import {
    DataTable,
    FilterBar,
    ConfirmDialog,
} from '@/components/admin'
import { UserFormModal } from './components'
import type { UserFormData } from './components'
import { userFilters } from '@/configs/admin.config'
import type { User, UserRole } from '@/@types/admin'
import { useAdminUI } from '@/utils/hooks/useAdminUI'

// ============================================
// MOCK DATA
// ============================================

const mockUsers: User[] = [
    {
        id: '1',
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@university.edu',
        role: 'admin',
        department: 'Computer Science',
        joinedDate: '2022-03-15',
        status: 'active'
    },
    {
        id: '2',
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@university.edu',
        role: 'faculty',
        department: 'Electronics',
        joinedDate: '2021-08-20',
        status: 'active'
    },
    {
        id: '3',
        name: 'Dr. Amit Patel',
        email: 'amit.patel@university.edu',
        role: 'hod',
        department: 'Mechanical',
        joinedDate: '2019-01-10',
        status: 'active'
    },
    {
        id: '4',
        name: 'Dr. Sunita Verma',
        email: 'sunita.verma@university.edu',
        role: 'dean',
        department: 'Management',
        joinedDate: '2018-06-05',
        status: 'active'
    },
    {
        id: '5',
        name: 'Mr. Rahul Singh',
        email: 'rahul.singh@university.edu',
        role: 'viewer',
        department: 'Civil',
        joinedDate: '2023-02-01',
        status: 'inactive'
    }
]

// ============================================
// USER MANAGEMENT PAGE
// ============================================

const UserManagement = () => {
    const [users] = useState<User[]>(mockUsers)
    const [filters, setFilters] = useState<Record<string, unknown>>({})
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
    const { RoleBadge, UserStatusBadge } = useAdminUI()

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

    const handleFormSubmit = (data: UserFormData) => {
        console.log('Form submitted:', data)
        setIsFormOpen(false)
        // TODO: API call to create/update user
    }

    const handleConfirmDelete = () => {
        console.log('Delete user:', selectedUser?.id)
        setIsDeleteOpen(false)
        // TODO: API call to delete user
    }

    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (value: unknown, row: User) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                        {row.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">{row.name}</p>
                        <p className="text-xs text-muted-foreground">{row.email}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'role',
            label: 'Role',
            render: (value: unknown) => <RoleBadge role={value as UserRole} />
        },
        {
            key: 'department',
            label: 'Department'
        },
        {
            key: 'joinedDate',
            label: 'Joined',
            render: (value: unknown) => formatDate(value as string)
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: unknown) => (
                <UserStatusBadge status={value as 'active' | 'inactive'} />
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
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
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
                data={users}
                rowActions={(row: User) => [
                    {
                        label: 'Edit',
                        onClick: () => handleEditUser(row),
                        icon: <Edit2 className="w-4 h-4" />
                    },
                    {
                        label: 'Send Email',
                        onClick: () => console.log('Email:', row.email),
                        icon: <Mail className="w-4 h-4" />
                    },
                    {
                        label: 'Delete',
                        onClick: () => handleDeleteUser(row),
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
                            role: selectedUser.role,
                            department: selectedUser.department,
                            status: selectedUser.status
                        }
                        : undefined
                }
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

export default UserManagement
