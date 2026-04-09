import { useState } from "react"
import { useAuth } from "@/auth"
import { useUpdateUser } from "@/hooks/useUsers"
import { useSessionUser } from "@/store/authStore"
import { getUserById, resetPassword } from "@/services/firebase"

import { Button } from "@/components/shadcn/ui/button"
import { Input } from "@/components/shadcn/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/ui/select"

import {
    User,
    Camera,
    Save,
    Edit2,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    Briefcase,
    Calendar,
    X,
    Linkedin,
    ExternalLink,
    Globe,
    Lock,
    ShieldCheck
} from "lucide-react"

import { uploadProfilePhoto } from "@/services/firebase"
import { createMedia } from "@/services/firebase/media/media.services"
import { doc } from "firebase/firestore"
import { db } from "@/configs/firebase.config"
import type { Faculty, UpdateUserData } from "@/services/firebase/users/types"

const Profile = () => {
    const { user } = useAuth()
    const setUser = useSessionUser((s) => s.setUser)
    const updateUserMutation = useUpdateUser()

    const [isEditing, setIsEditing] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [resettingPassword, setResettingPassword] = useState(false)

    const [formData, setFormData] = useState<{
        name: string
        phone_number: string
        address: string
        designation: string
        faculty: Faculty | ''
        joining_date: string
        linkedin_link: string
        orcid_link: string
        scopus_link: string
        google_scholar_link: string
    }>({
        name: user?.name || "",
        phone_number: user?.phone_number || "",
        address: user?.address || "",
        designation: user?.designation || "",
        faculty: (user?.faculty as Faculty) || "",
        joining_date: user?.joining_date || (user?.created_at?.toDate ? user.created_at.toDate().toISOString().split('T')[0] : ""),
        linkedin_link: (user as any)?.linkedin_link || "",
        orcid_link: (user as any)?.orcid_link || "",
        scopus_link: (user as any)?.scopus_link || "",
        google_scholar_link: (user as any)?.google_scholar_link || "",
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        if (!user?.id) return

        await updateUserMutation.mutateAsync({
            userId: user.id,
            data: {
                name: formData.name,
                phone_number: formData.phone_number,
                address: formData.address,
                joining_date: formData.joining_date,
                linkedin_link: formData.linkedin_link,
                orcid_link: formData.orcid_link,
                scopus_link: formData.scopus_link,
                google_scholar_link: formData.google_scholar_link,
            },
        })

        // Re-fetch from Firestore and sync the Zustand auth store
        const freshUser = await getUserById(user.id)
        if (freshUser) {
            setUser({
                ...freshUser,
                userId: freshUser.id,
                userName: freshUser.name,
                avatar: freshUser.profile_picture_url || '',
                authority: [freshUser.user_role === 'admin' ? 'admin' : 'user'],
            } as any)

            // Also reset local formData so the next edit session shows fresh values
            setFormData({
                name: freshUser.name || "",
                phone_number: freshUser.phone_number || "",
                address: freshUser.address || "",
                designation: freshUser.designation || "",
                faculty: (freshUser.faculty as Faculty) || "",
                joining_date: freshUser.joining_date || (freshUser.created_at?.toDate ? freshUser.created_at.toDate().toISOString().split('T')[0] : ""),
                linkedin_link: freshUser.linkedin_link || "",
                orcid_link: freshUser.orcid_link || "",
                scopus_link: freshUser.scopus_link || "",
                google_scholar_link: freshUser.google_scholar_link || "",
            })
        }

        setIsEditing(false)
    }

    const handlePhotoUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.files || !e.target.files[0] || !user?.id) return

        const file = e.target.files[0]
        setUploading(true)

        // Show local preview immediately
        const localPreview = URL.createObjectURL(file)
        setPreviewUrl(localPreview)

        try {
            // Upload to Google Cloud Storage via Firebase
            const photoURL = await uploadProfilePhoto(file, user.id)

            // Create a Media Document
            const mediaId = `profile_${user.id}_${Date.now()}`
            const userRef = doc(db, "users", user.id)

            await createMedia(mediaId, {
                media_name: file.name,
                media_type: "profile",
                media_url: photoURL,
                uploaded_by: userRef,
                uploaded_at: new Date() as any, 
                status: "active"
            })

            // Update user collection
            const mediaRef = doc(db, "media", mediaId)
            await updateUserMutation.mutateAsync({
                userId: user.id,
                data: {
                    profile_picture_url: photoURL,
                    profile_picture_media: mediaRef
                },
            })

            // Sync auth store so avatar updates immediately
            const freshUser = await getUserById(user.id)
            if (freshUser) {
                setUser({
                    ...freshUser,
                    userId: freshUser.id,
                    userName: freshUser.name,
                    avatar: freshUser.profile_picture_url || '',
                    authority: [freshUser.user_role === 'admin' ? 'admin' : 'user'],
                } as any)
            }
        } finally {
            setUploading(false)
            setPreviewUrl(null) 
        }
    }

    const handleResetPassword = async () => {
        if (!user?.email) return
        
        if (!window.confirm("Send password reset link to your email?")) return

        setResettingPassword(true)
        try {
            await resetPassword(user.email)
            alert(`A password reset link has been sent to ${user.email}`)
        } catch (error: any) {
            console.error("Password reset error:", error)
            alert(error.message || "Failed to send reset link.")
        } finally {
            setResettingPassword(false)
        }
    }

    if (!user) return <></>

    return (
        <div className="h-full overflow-hidden flex justify-center">
            <div className="w-full h-full overflow-y-auto custom-scrollbar bg-card border rounded-xl p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-10">

                {/* PROFILE HEADER */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">

                        {/* AVATAR */}
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-muted border flex items-center justify-center">
                                {(previewUrl || user.profile_picture_url) ? (
                                    <img
                                        src={previewUrl || user.profile_picture_url}
                                        className="w-full h-full object-cover"
                                        alt="Profile"
                                    />
                                ) : (
                                    <User className="w-10 h-10 text-muted-foreground" />
                                )}
                            </div>

                            {isEditing && (
                                <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow">
                                    <Camera size={14} />
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handlePhotoUpload}
                                    />
                                </label>
                            )}

                            {uploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full">
                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                                </div>
                            )}
                        </div>

                        {/* IDENTITY */}
                        <div className="space-y-1.5">
                            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                                {isEditing ? (
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className="h-9 w-full sm:w-[200px]"
                                    />
                                ) : (
                                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                                        {user.name}
                                    </h2>
                                )}
                                <div className="inline-flex items-center justify-center text-[9px] sm:text-[10px] px-3 py-1 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-widest h-fit">
                                    {user.user_role}
                                </div>
                            </div>

                            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground mt-1">
                                <Mail size={14} className="shrink-0" />
                                <span className="truncate">{user.email}</span>
                            </div>
                        </div>

                    </div>

                    {/* EDIT ACTION */}
                    <div className="w-full sm:w-auto flex justify-center sm:justify-end">
                        {!isEditing ? (
                            <Button
                                variant="default"
                                onClick={() => setIsEditing(true)}
                                className="gap-2 bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
                            >
                                <Edit2 size={14} />
                                Edit Profile
                            </Button>
                        ) : (
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button
                                    variant="destructive"
                                    onClick={() => setIsEditing(false)}
                                    className="gap-2 grow sm:grow-0"
                                >
                                    <X size={14} />
                                    Cancel
                                </Button>

                                <Button
                                    variant="default"
                                    onClick={handleSave}
                                    disabled={updateUserMutation.isPending}
                                    className="gap-2 bg-blue-600 text-white hover:bg-blue-700 grow sm:grow-0"
                                >
                                    <Save size={14} />
                                    Save
                                </Button>
                            </div>
                        )}
                    </div>

                </div>

                {/* DIVIDER */}
                <div className="border-t" />

                {/* PROFILE DETAILS */}
                <div className="space-y-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* PHONE */}
                        <Field
                            icon={<Phone size={16} />}
                            label="Phone"
                            value={user.phone_number}
                            editing={isEditing}
                            inputValue={formData.phone_number}
                            onChange={(v: string) => handleInputChange("phone_number", v)}
                        />

                        {/* FACULTY */}
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <GraduationCap size={16} />
                                Faculty
                            </p>
                            {isEditing ? (
                                <Select
                                    value={formData.faculty}
                                    onValueChange={(v: string) => handleInputChange("faculty", v)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select faculty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FCI">FCI</SelectItem>
                                        <SelectItem value="FOM">FOM</SelectItem>
                                        <SelectItem value="FIAT">FIAT</SelectItem>
                                        <SelectItem value="FDLS">FDLS</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className="font-medium">
                                    {user.faculty || "Not Provided"}
                                </p>
                            )}
                        </div>

                        {/* DESIGNATION */}
                        <Field
                            icon={<Briefcase size={16} />}
                            label="Designation"
                            value={user.designation}
                            editing={isEditing}
                            inputValue={formData.designation}
                            onChange={(v: string) => handleInputChange("designation", v)}
                        />

                        {/* JOINING DATE */}
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <Calendar size={16} />
                                Joining Date
                            </p>
                            {isEditing ? (
                                <Input
                                    type="date"
                                    value={formData.joining_date}
                                    onChange={(e) => handleInputChange("joining_date", e.target.value)}
                                />
                            ) : (
                                <p className="font-medium">
                                    {user.joining_date
                                        ? new Date(user.joining_date).toLocaleDateString()
                                        : user.created_at?.toDate?.()?.toLocaleDateString() || "N/A"
                                    }
                                </p>
                            )}
                        </div>

                        {/* ADDRESS */}
                        <div className="md:col-span-2 space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <MapPin size={14} />
                                Address
                            </p>

                            {isEditing ? (
                                <Input
                                    value={formData.address}
                                    onChange={(e) =>
                                        handleInputChange("address", e.target.value)
                                    }
                                />
                            ) : (
                                <p className="font-medium">
                                    {user.address || "No Address Provided"}
                                </p>
                            )}
                        </div>

                        {/* PROFESSIONAL LINKS */}
                        <div className="md:col-span-2 pt-6 border-t">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                                Professional Links
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <LinkField
                                    icon={<Linkedin size={16} className="text-[#0077b5]" />}
                                    label="LinkedIn"
                                    value={(user as any).linkedin_link}
                                    editing={isEditing}
                                    inputValue={formData.linkedin_link}
                                    onChange={(v: string) => handleInputChange("linkedin_link", v)}
                                    placeholder="https://linkedin.com/in/..."
                                />
                                <LinkField
                                    icon={<Globe size={16} className="text-[#A6CE39]" />}
                                    label="ORCID ID"
                                    value={(user as any).orcid_link}
                                    editing={isEditing}
                                    inputValue={formData.orcid_link}
                                    onChange={(v: string) => handleInputChange("orcid_link", v)}
                                    placeholder="https://orcid.org/..."
                                />
                                <LinkField
                                    icon={<ExternalLink size={16} className="text-[#f68212]" />}
                                    label="Scopus Profile"
                                    value={(user as any).scopus_link}
                                    editing={isEditing}
                                    inputValue={formData.scopus_link}
                                    onChange={(v: string) => handleInputChange("scopus_link", v)}
                                    placeholder="https://www.scopus.com/..."
                                />
                                <LinkField
                                    icon={<GraduationCap size={16} className="text-[#4285F4]" />}
                                    label="Google Scholar"
                                    value={(user as any).google_scholar_link}
                                    editing={isEditing}
                                    inputValue={formData.google_scholar_link}
                                    onChange={(v: string) => handleInputChange("google_scholar_link", v)}
                                    placeholder="https://scholar.google.com/..."
                                />
                            </div>
                        </div>

                        {/* SECURITY SECTION */}
                        <div className="md:col-span-2 pt-6 border-t overflow-hidden">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-emerald-500" />
                                Account Security
                            </h3>
                            <div className="bg-muted/30 rounded-2xl p-4 sm:p-6 border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold flex items-center gap-2 text-foreground">
                                        <Lock size={14} className="text-muted-foreground" />
                                        Password Management
                                    </p>
                                    <p className="text-xs text-muted-foreground max-w-sm">
                                        Send a secure link to your registered email to reset your account password.
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={handleResetPassword}
                                    disabled={resettingPassword}
                                    className="w-full sm:w-auto shrink-0 font-bold border-rose-200/50 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 dark:border-rose-500/10 dark:hover:bg-rose-500/10 dark:hover:border-rose-500/20"
                                >
                                    {resettingPassword ? (
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent animate-spin rounded-full mr-2" />
                                    ) : (
                                        <Lock size={14} className="mr-2" />
                                    )}
                                    Reset Password
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

const LinkField = ({ icon, label, value, editing, inputValue, onChange, placeholder }: any) => (
    <div className="space-y-1">
        <p className="text-xs text-muted-foreground flex items-center gap-2">
            {icon}
            {label}
        </p>
        {editing ? (
            <Input
                value={inputValue}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-9 text-xs"
            />
        ) : (
            value ? (
                <a
                    href={value.startsWith('http') ? value : `https://${value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1.5"
                >
                    Visit Link <ExternalLink size={10} />
                </a>
            ) : (
                <p className="text-sm font-medium text-muted-foreground italic">Not Linked</p>
            )
        )}
    </div>
)

export default Profile



/* reusable field component */

const Field = ({
    icon,
    label,
    value,
    editing,
    inputValue,
    onChange
}: any) => (
    <div className="space-y-1">

        <p className="text-xs text-muted-foreground flex items-center gap-2">
            {icon}
            {label}
        </p>

        {editing ? (
            <Input
                value={inputValue}
                onChange={(e) => onChange(e.target.value)}
            />
        ) : (
            <p className="font-medium">
                {value || "Not Provided"}
            </p>
        )}

    </div>
)