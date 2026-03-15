import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    User, Mail, Phone, MapPin, Briefcase, Building2,
    ArrowLeft, Calendar, FileText, Search, X
} from 'lucide-react'
import { Card } from '@/components/shadcn/ui/card'
import { Button } from '@/components/shadcn/ui/button'
import { Spinner } from '@/components/shadcn/ui/spinner'
import { useUserLifetimeSubmissions } from '@/hooks/useRecords'
import { useQuery } from '@tanstack/react-query'
import { adminGetUserById } from '@/services/firebase/admin.service'
import { RecordTable, Searchbar, DomainFilter, YearFilter } from '@/components/custom'
import { cn } from '@/components/shadcn/utils'

const AdminUserProfile = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [search, setSearch] = useState('')
    const [domainFilter, setDomainFilter] = useState('all')
    const [yearFilter, setYearFilter] = useState('all')

    // ── User Data ──────────────────────────────────────────────────────────
    const { data: user, isLoading: userLoading } = useQuery({
        queryKey: ['admin-user', id],
        queryFn: () => adminGetUserById(id!),
        enabled: !!id
    })

    // ── Lifetime Records ──────────────────────────────────────────────────
    const { data: records = [], isLoading: recordsLoading } = useUserLifetimeSubmissions(id!)

    // ── Filtering Logic ───────────────────────────────────────────────────
    const availableYears = useMemo(() => {
        const years = new Set<string>()
        records.forEach((r: any) => {
            const d = r.created_at?.toDate ? r.created_at.toDate() : new Date(r.created_at)
            if (!isNaN(d.getTime())) years.add(d.getFullYear().toString())
            if (r.publicationYear) years.add(r.publicationYear.toString())
        })
        return Array.from(years).sort((a, b) => b.localeCompare(a))
    }, [records])

    const filteredRecords = useMemo(() => {
        return records.filter((r: any) => {
            const title = (r.title || r.title_of_paper || r.title_of_book || r.award_name || r.project_title || '').toLowerCase()
            const matchesSearch = !search || title.includes(search.toLowerCase())
            const matchesDomain = domainFilter === 'all' || r.type === domainFilter

            let matchesYear = yearFilter === 'all'
            if (!matchesYear) {
                const d = r.created_at?.toDate ? r.created_at.toDate() : new Date(r.created_at)
                matchesYear = d.getFullYear().toString() === yearFilter || r.publicationYear?.toString() === yearFilter
            }

            return matchesSearch && matchesDomain && matchesYear
        })
    }, [records, search, domainFilter, yearFilter])

    if (userLoading) return (
        <div className="flex items-center justify-center p-20">
            <Spinner className="w-10 h-10" />
        </div>
    )

    if (!user) return (
        <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-500 font-bold">User Not Found</p>
            <Button onClick={() => navigate(-1)} variant="outline" className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
            </Button>
        </div>
    )

    return (
        <div className="p-4 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-xl">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Researcher Profile</h1>
                        <p className="text-sm text-muted-foreground font-medium">Detailed history and account information</p>
                    </div>
                </div>
            </div>

            {/* Top Section: User Information */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 p-6 flex flex-col items-center text-center space-y-4 shadow-soft">
                    <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary shadow-inner">
                        {user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-muted-foreground font-medium">{user.email}</p>
                    </div>
                    <div className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        user.is_active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    )}>
                        {user.is_active ? 'Active Account' : 'Inactive Account'}
                    </div>
                </Card>

                <Card className="lg:col-span-2 p-6 shadow-soft grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoItem icon={<Briefcase className="w-4 h-4" />} label="Designation" value={user.designation} />
                    <InfoItem icon={<Building2 className="w-4 h-4" />} label="Faculty / Department" value={user.faculty} />
                    <InfoItem icon={<Phone className="w-4 h-4" />} label="Contact Number" value={user.phone_number} />
                    <InfoItem icon={<Mail className="w-4 h-4" />} label="Official Email" value={user.email} />
                    <InfoItem icon={<MapPin className="w-4 h-4" />} label="Address" value={user.address} className="md:col-span-2" />
                    <InfoItem icon={<Calendar className="w-4 h-4" />} label="Joined Date" value={user.created_at?.toDate ? user.created_at.toDate().toLocaleDateString() : 'N/A'} />
                </Card>
            </div>

            {/* Bottom Section: Lifetime Submissions */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold tracking-tight uppercase">Lifetime Submissions ({records.length})</h2>
                </div>

                {/* Filters */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-4 rounded-3xl border border-border/50 shadow-premium">
                    <div className="flex flex-col sm:flex-row flex-1 items-center gap-4 w-full">
                        <Searchbar value={search} onChange={setSearch} className="w-full max-w-none sm:max-w-md" />
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <DomainFilter value={domainFilter} onChange={setDomainFilter} />
                            <YearFilter value={yearFilter} onChange={setYearFilter} years={availableYears} />
                            {(search || domainFilter !== 'all' || yearFilter !== 'all') && (
                                <button
                                    onClick={() => { setSearch(''); setDomainFilter('all'); setYearFilter('all') }}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-500"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <Card className="overflow-hidden shadow-premium border-none rounded-2xl">
                    {recordsLoading ? (
                        <div className="py-20 flex justify-center"><Spinner className="w-8 h-8" /></div>
                    ) : filteredRecords.length > 0 ? (
                        <RecordTable
                            records={filteredRecords}
                            selectedDomain={domainFilter}
                            onView={() => { }}
                            showActions={false}
                        />
                    ) : (
                        <div className="py-20 text-center space-y-4">
                            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto opacity-50">
                                <FileText className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground font-bold font-mont">No records found for this user.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}

const InfoItem = ({ icon, label, value, className }: { icon: React.ReactNode, label: string, value?: string, className?: string }) => (
    <div className={cn("space-y-1.5", className)}>
        <div className="flex items-center gap-2 text-muted-foreground">
            {icon}
            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-sm font-bold text-foreground pl-6">{value || 'N/A'}</p>
    </div>
)

export default AdminUserProfile
