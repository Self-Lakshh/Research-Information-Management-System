import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/shadcn/ui/dialog"
import { Button } from "@/components/shadcn/ui/button"
import { Input } from "@/components/shadcn/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/ui/select"
import { Label } from "@/components/shadcn/ui/label"
import { cn } from "@/components/shadcn/utils"

export interface UserFormData {
    name: string
    email: string
    role: string
    faculty: string
    designation: string
    phone_number: string
    status: 'active' | 'inactive'
    joining_date?: string
    linkedin_link?: string
    orcid_link?: string
    scopus_link?: string
}

interface UserFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: UserFormData) => void
    initialData?: UserFormData
    mode: 'create' | 'edit'
    loading?: boolean
}

export const UserFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    mode,
    loading = false
}: UserFormModalProps) => {

    const [formData, setFormData] = React.useState<UserFormData>({
        name: '',
        email: '',
        role: '',
        faculty: '',
        designation: '',
        phone_number: '',
        status: 'active',
        joining_date: '',
        linkedin_link: '',
        orcid_link: '',
        scopus_link: ''
    })

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                joining_date: initialData.joining_date || '',
                linkedin_link: initialData.linkedin_link || '',
                orcid_link: initialData.orcid_link || '',
                scopus_link: initialData.scopus_link || ''
            })
        } else {
            setFormData({
                name: '',
                email: '',
                role: '',
                faculty: '',
                designation: '',
                phone_number: '',
                status: 'active',
                joining_date: '',
                linkedin_link: '',
                orcid_link: '',
                scopus_link: ''
            })
        }
    }, [initialData, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Add New User' : 'Edit User'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter full name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter email address"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => setFormData({ ...formData, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Faculty</Label>
                            <Select
                                value={formData.faculty}
                                onValueChange={(value) => setFormData({ ...formData, faculty: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select faculty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FCI">FCI</SelectItem>
                                    <SelectItem value="FDLS">FDLS</SelectItem>
                                    <SelectItem value="FOM">FOM</SelectItem>
                                    <SelectItem value="FIAT">FIAT</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="designation">Designation</Label>
                            <Input
                                id="designation"
                                value={formData.designation}
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                placeholder="Enter designation"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                value={formData.phone_number}
                                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                placeholder="Enter phone number"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="joining_date">Joining Date</Label>
                            <Input
                                id="joining_date"
                                type="date"
                                value={formData.joining_date}
                                onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="border-t border-border/50 pt-4 mt-2">
                        <h4 className="text-sm font-semibold mb-3">Links & Portals</h4>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                                <Input
                                    id="linkedin"
                                    value={formData.linkedin_link}
                                    onChange={(e) => setFormData({ ...formData, linkedin_link: e.target.value })}
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="orcid">ORCID ID Link</Label>
                                    <Input
                                        id="orcid"
                                        value={formData.orcid_link}
                                        onChange={(e) => setFormData({ ...formData, orcid_link: e.target.value })}
                                        placeholder="https://orcid.org/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="scopus">Scopus Profile Link</Label>
                                    <Input
                                        id="scopus"
                                        value={formData.scopus_link}
                                        onChange={(e) => setFormData({ ...formData, scopus_link: e.target.value })}
                                        placeholder="https://www.scopus.com/..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : mode === 'create' ? 'Add User' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
