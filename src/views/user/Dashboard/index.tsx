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
import { RecordFormModal } from '@/components/common'

import { useNavigate } from 'react-router-dom'

const StatsCard = ({ title, value, icon: Icon, description, colorClass }: any) => (
    <Card className="overflow-hidden border-none shadow-premium transition-all hover:shadow-premium-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className={`p-2 rounded-xl ${colorClass}`}>
                <Icon className="h-4 w-4" />
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </CardContent>
    </Card>
)

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

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
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
                    <StatsCard
                        title="Total Submissions"
                        value="12"
                        icon={FileText}
                        description="+2 from last month"
                        colorClass="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20"
                    />
                </div>
                <div className="cursor-pointer" onClick={() => navigate('/user/submissions')}>
                    <StatsCard
                        title="Approved"
                        value="8"
                        icon={CheckCircle2}
                        description="66% approval rate"
                        colorClass="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20"
                    />
                </div>
                <div className="cursor-pointer" onClick={() => navigate('/user/submissions')}>
                    <StatsCard
                        title="Pending"
                        value="3"
                        icon={Clock}
                        description="Awaiting review"
                        colorClass="bg-amber-500/10 text-amber-600 dark:bg-amber-500/20"
                    />
                </div>
                <div className="cursor-pointer" onClick={() => navigate('/user/submissions')}>
                    <StatsCard
                        title="Rejected"
                        value="1"
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
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors group cursor-pointer" onClick={() => navigate('/user/submissions')}>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <FileText className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium group-hover:text-primary transition-colors">Improving AI Efficiency in Healthcare</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>Journal</span>
                                                <span>•</span>
                                                <span>2 hours ago</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant={i === 1 ? "default" : i === 2 ? "secondary" : "outline"} className="capitalize">
                                        {i === 1 ? "Approved" : i === 2 ? "Pending" : "Rejected"}
                                    </Badge>
                                </div>
                            ))}
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
