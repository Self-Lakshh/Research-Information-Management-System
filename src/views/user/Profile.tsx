import { useState } from 'react';
import { useAuth } from '@/auth';
import { useUpdateUser } from '@/hooks/useUsers';
import { Card } from '@/components/shadcn/ui/card';
import { Button } from '@/components/shadcn/ui/button';
import { Input } from '@/components/shadcn/ui/input';
import { User, Mail, Phone, MapPin, Briefcase, Building2, Save, Edit2 } from 'lucide-react';
import { uploadProfilePhoto } from '@/services/firebase';

const UserProfile = () => {
    const { user } = useAuth();
    const updateUserMutation = useUpdateUser();
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone_number: user?.phone_number || '',
        address: user?.address || '',
        designation: user?.designation || '',
        department: user?.department || '',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!user?.uid) return;

        try {
            await updateUserMutation.mutateAsync({
                userId: user.uid,
                data: formData,
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !user?.uid) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const photoURL = await uploadProfilePhoto(file, user.uid);
            await updateUserMutation.mutateAsync({
                userId: user.uid,
                data: { profile_picture_url: photoURL },
            });
        } catch (error) {
            console.error('Failed to upload photo:', error);
        } finally {
            setUploading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-slate-600 dark:text-slate-400">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            My Profile
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Manage your personal information
                        </p>
                    </div>
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                            <Edit2 className="w-4 h-4" />
                            Edit Profile
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="default" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={updateUserMutation.isPending}>
                                <Save className="w-4 h-4 mr-2" />
                                {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Profile Photo */}
                <Card className="p-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center overflow-hidden">
                                {user.profile_picture_url ? (
                                    <img
                                        src={user.profile_picture_url || undefined}
                                        alt={user.name || 'User Profile'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-700 transition-colors">
                                    <Edit2 className="w-4 h-4 text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {user.name}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400">{user.email}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                                Role: <span className="font-medium capitalize">{user.user_role}</span>
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Personal Information */}
                <Card className="p-6">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
                        Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </label>
                            {isEditing ? (
                                <Input
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter your full name"
                                />
                            ) : (
                                <p className="text-slate-900 dark:text-slate-100 py-2">
                                    {user.name || 'Not provided'}
                                </p>
                            )}
                        </div>

                        {/* Email (Read-only) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </label>
                            <p className="text-slate-900 dark:text-slate-100 py-2">{user.email}</p>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Phone Number
                            </label>
                            {isEditing ? (
                                <Input
                                    value={formData.phone_number}
                                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                    placeholder="Enter your phone number"
                                />
                            ) : (
                                <p className="text-slate-900 dark:text-slate-100 py-2">
                                    {user.phone_number || 'Not provided'}
                                </p>
                            )}
                        </div>

                        {/* Designation */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                Designation
                            </label>
                            {isEditing ? (
                                <Input
                                    value={formData.designation}
                                    onChange={(e) => handleInputChange('designation', e.target.value)}
                                    placeholder="Enter your designation"
                                />
                            ) : (
                                <p className="text-slate-900 dark:text-slate-100 py-2">
                                    {user.designation || 'Not provided'}
                                </p>
                            )}
                        </div>

                        {/* Department */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                Department
                            </label>
                            {isEditing ? (
                                <Input
                                    value={formData.department}
                                    onChange={(e) => handleInputChange('department', e.target.value)}
                                    placeholder="Enter your department"
                                />
                            ) : (
                                <p className="text-slate-900 dark:text-slate-100 py-2">
                                    {user.department || 'Not provided'}
                                </p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Address
                            </label>
                            {isEditing ? (
                                <Input
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    placeholder="Enter your address"
                                />
                            ) : (
                                <p className="text-slate-900 dark:text-slate-100 py-2">
                                    {user.address || 'Not provided'}
                                </p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Account Status */}
                <Card className="p-6">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                        Account Status
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${user.is_active
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Account created on {user.created_at?.toDate?.()?.toLocaleDateString() || 'N/A'}
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default UserProfile;
