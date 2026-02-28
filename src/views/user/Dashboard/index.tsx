import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/ui/card'
import { Badge } from '@/components/shadcn/ui/badge'
import { Button } from '@/components/shadcn/ui/button'
import {
    Plus,
    FileText,
    CheckCircle2,
    Clock,
    XCircle,
    BookOpen,
    Users,
    GraduationCap,
    Trophy,
    Briefcase,
    Globe,
    MoreHorizontal
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/shadcn/ui/dropdown-menu'
import { ResearchCategory } from '@/@types/rims.types'
import { RecordFormModal } from '@/components/custom'
import { StatCard } from '@/components/custom'
import { useNavigate } from 'react-router-dom'
import { useUserRecords } from '@/hooks/useRecords'
import { formatDistanceToNow } from 'date-fns'

const categories: { label: string; value: ResearchCategory; icon: any }[] = [
    { label: 'IPR', value: 'ipr', icon: Globe },
    { label: 'PhD Student Data', value: 'phd_student', icon: GraduationCap },
    { label: 'Journal', value: 'journal', icon: BookOpen },
    { label: 'Conference', value: 'conference', icon: Users },
    { label: 'Book', value: 'book', icon: FileText },
    { label: 'Consultancy', value: 'consultancy', icon: Briefcase },
    { label: 'Awards', value: 'award', icon: Trophy },
    { label: 'Others', value: 'other', icon: MoreHorizontal },
]

const UserDashboard = () => {
    const [selectedCategory, setSelectedCategory] = React.useState<ResearchCategory | null>(null)
    const navigate = useNavigate()
    const { data: records = [], isLoading } = useUserRecords()

    const totalSubmissions = records.length
    const approved = records.filter(r => (r as any).status === 'approved').length
    const pending = records.filter(r => (r as any).status === 'pending').length
    const rejected = records.filter(r => (r as any).status === 'rejected').length
    const recentRecords = records.slice(0, 3)

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        My Research Dashboard
                    </h1>
                    <p className="text-muted-foreground">Manage and track your research activity and submissions.</p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all gap-2 px-6">
                            <Plus className="h-5 w-5" />
                            Add New Submission
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                        {categories.map((cat) => (
                            <DropdownMenuItem
                                key={cat.value}
                                className="flex items-center gap-2 py-3 cursor-pointer rounded-lg"
                                onClick={() => setSelectedCategory(cat.value)}
                            >
                                <cat.icon className="h-4 w-4 text-muted-foreground" />
                                <span>{cat.label}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="cursor-pointer" onClick={() => navigate('/user/submissions')}>
                    <StatCard
                        title="Total Submissions"
                        value={totalSubmissions.toString()}
                        icon={FileText}
                        description={isLoading ? "Loading..." : "All time records"}
                        colorClass="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20"
                    />
                </div>
                <div className="cursor-pointer" onClick={() => navigate('/user/submissions')}>
                    <StatCard
                        title="Approved"
                        value={approved.toString()}
                        icon={CheckCircle2}
                        description={totalSubmissions > 0 ? `${Math.round((approved / totalSubmissions) * 100)}% approval rate` : "No records"}
                        colorClass="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20"
                    />
                </div>
                <div className="cursor-pointer" onClick={() => navigate('/user/submissions')}>
                    <StatCard
                        title="Pending"
                        value={pending.toString()}
                        icon={Clock}
                        description="Awaiting review"
                        colorClass="bg-amber-500/10 text-amber-600 dark:bg-amber-500/20"
                    />
                </div>
                <div className="cursor-pointer" onClick={() => navigate('/user/submissions')}>
                    <StatCard
                        title="Rejected"
                        value={rejected.toString()}
                        icon={XCircle}
                        description="Needs revision"
                        colorClass="bg-rose-500/10 text-rose-600 dark:bg-rose-500/20"
                    />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-none shadow-premium">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Submissions</CardTitle>
                            <p className="text-sm text-muted-foreground">Track the status of your latest research requests.</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/user/submissions')}>View All</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="p-4 text-center text-muted-foreground text-sm flex items-center justify-center h-20">Loading submissions...</div>
                            ) : recentRecords.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground text-sm flex items-center justify-center h-20">No recent submissions found.</div>
                            ) : recentRecords.map((record) => {
                                const categoryMeta = categories.find(c => c.value === ((record as any).category || (record as any).type)) || categories[7];
                                const RecordIcon = categoryMeta.icon;
                                const timestampStr = (record as any).createdAt?.toDate ? formatDistanceToNow((record as any).createdAt.toDate(), { addSuffix: true }) : ((record as any).createdAt ? formatDistanceToNow(new Date((record as any).createdAt), { addSuffix: true }) : 'Recently');
                                return (
                                    <div key={record.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors group cursor-pointer" onClick={() => navigate('/user/submissions')}>
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <RecordIcon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium group-hover:text-primary transition-colors line-clamp-1">{(record as any).title}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{categoryMeta.label}</span>
                                                    <span>•</span>
                                                    <span>{timestampStr}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant={(record as any).status === 'approved' ? "default" : (record as any).status === 'pending' ? "secondary" : "outline"} className="capitalize">
                                            {(record as any).status}
                                        </Badge>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-premium">
                    <CardHeader>
                        <CardTitle>My Profile Stats</CardTitle>
                        <p className="text-sm text-muted-foreground">Quick overview of your impact.</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Publications</span>
                                <span className="font-semibold">24</span>
                            </div>
                            <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                <div className="h-full bg-primary w-[70%]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Citations</span>
                                <span className="font-semibold">156</span>
                            </div>
                            <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                <div className="h-full bg-blue-500 w-[45%]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Impact Factor</span>
                                <span className="font-semibold">3.8</span>
                            </div>
                            <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[60%]" />
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <Button variant="outline" className="w-full rounded-xl" onClick={() => navigate('/user/profile')}>
                                View Detailed Profile
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <RecordFormModal
                isOpen={!!selectedCategory}
                onClose={() => setSelectedCategory(null)}
                type={selectedCategory || 'journal'}
                onSubmit={(data) => {
                    console.log('Submission:', data)
                    setSelectedCategory(null)
                }}
            />
        </div>
    )
}


export default UserDashboard
