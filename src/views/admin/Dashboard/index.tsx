import { useState, useMemo } from 'react'
import {
    FileText,
    Users,
    Award,
    Clock,
    TrendingUp,
    BarChart3,
    PieChart,
    Activity,
    Calendar,
    Shield,
    BookOpen,
    Briefcase,
    Search,
    ChevronDown,
    LineChart as LineIcon,
    AreaChart as AreaIcon,
    BarChart as BarIcon
} from 'lucide-react'
import {
    StatCard,
    ChartContainer as DashboardChartContainer,
    RecordsSummaryTable
} from '../components'
import { recordTypeMeta } from '../config'
import { cn } from '@/components/shadcn/utils'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/ui/select'
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts'

// ============================================
// DASHBOARD PAGE
// ============================================

const AdminDashboard = () => {
    const [selectedYear, setSelectedYear] = useState('All')

    const [chartYear, setChartYear] = useState('2026')
    const [chartDomain, setChartDomain] = useState('all')
    const [compareWith, setCompareWith] = useState('none')
    const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area')

    const currentYear = new Date().getFullYear()
    const availableYears = ['All']
    for (let year = currentYear; year >= 2024; year--) {
        availableYears.push(year.toString())
    }

    const chartYears = availableYears.filter(y => y !== 'All')

    // Mock data generation logic
    const monthlyData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        return months.map(month => {
            const seed = chartDomain === 'all' ? 50 : 10
            const currentVal = Math.floor(Math.random() * (seed * 2)) + seed
            const compareVal = compareWith !== 'none' ? Math.floor(Math.random() * (seed * 1.5)) + (seed * 0.8) : undefined

            return {
                name: month,
                current: currentVal,
                comparison: compareVal
            }
        })
    }, [chartYear, chartDomain, compareWith])

    const stats = {
        totalRecords: 1247,
        pendingApprovals: 23,
        totalUsers: 156,
        monthlySubmissions: 48,
        iprs: 156,
        journals: 342,
        conferences: 287,
        grants: 112
    }

    const summaryData = Object.values(recordTypeMeta).map((meta) => ({
        type: meta.label,
        total: Math.floor(Math.random() * 300) + 50,
        pending: Math.floor(Math.random() * 10)
    }))

    const renderChart = () => {
        const sharedProps = {
            data: monthlyData,
            margin: { top: 10, right: 10, left: -20, bottom: 0 }
        }

        switch (chartType) {
            case 'line':
                return (
                    <LineChart {...sharedProps}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ fontWeight: 'bold' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                        <Line type="monotone" dataKey="current" name={`Year ${chartYear}`} stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
                        {compareWith !== 'none' && (
                            <Line type="monotone" dataKey="comparison" name={`Year ${compareWith}`} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" strokeWidth={2} dot={{ r: 3 }} />
                        )}
                    </LineChart>
                )
            case 'area':
                return (
                    <AreaChart {...sharedProps}>
                        <defs>
                            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorCompare" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="current" name={`Year ${chartYear}`} stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCurrent)" strokeWidth={2} />
                        {compareWith !== 'none' && (
                            <Area type="monotone" dataKey="comparison" name={`Year ${compareWith}`} stroke="hsl(var(--muted-foreground))" fillOpacity={1} fill="url(#colorCompare)" strokeWidth={2} strokeDasharray="4 4" />
                        )}
                    </AreaChart>
                )
            case 'bar':
                return (
                    <BarChart {...sharedProps}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                        />
                        <Bar dataKey="current" name={`Year ${chartYear}`} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} />
                        {compareWith !== 'none' && (
                            <Bar dataKey="comparison" name={`Year ${compareWith}`} fill="hsl(var(--muted-foreground))" opacity={0.4} radius={[4, 4, 0, 0]} barSize={20} />
                        )}
                    </BarChart>
                )
        }
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="pb-2 border-b border-border/40">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Research Insights</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Monitor institutional research performance and growth
                </p>
            </div>

            {/* Unified Stats Section */}
            <div className="bg-card rounded-3xl border border-border/60 shadow-sm overflow-hidden">
                {/* Section Header with Filter */}
                <div className="p-6 border-b border-border/40 flex items-center justify-between bg-muted/20">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-6 bg-primary rounded-full" />
                        <h2 className="text-lg font-bold text-foreground">Statistical Overview</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Select Period:</span>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-[120px] h-9 rounded-xl bg-background border-border/60 hover:border-primary/50 transition-colors">
                                <SelectValue placeholder="All Years" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/60">
                                {availableYears.map(year => (
                                    <SelectItem key={year} value={year}>{year === 'All' ? 'All Time' : year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* High Density Stats Grid - 10 Cards with Enhanced Separation */}
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 bg-muted/30">
                    {[
                        { label: "Researchers", value: stats.totalUsers, icon: <Users className="w-4 h-4" />, variant: 'indigo' },
                        { label: "Publications", value: stats.totalRecords.toLocaleString(), icon: <FileText className="w-4 h-4" />, variant: 'primary' },
                        { label: "Journals", value: stats.journals, icon: <BookOpen className="w-4 h-4" />, variant: 'azure' },
                        { label: "IPR / Patents", value: stats.iprs, icon: <Shield className="w-4 h-4" />, variant: 'rose' },
                        { label: "Conf. Papers", value: stats.conferences, icon: <Activity className="w-4 h-4" />, variant: 'amber' },
                        { label: "Research Grants", value: stats.grants, icon: <Briefcase className="w-4 h-4" />, variant: 'emerald' },
                        { label: "Avg. Citations", value: "42.8", icon: <TrendingUp className="w-4 h-4" />, variant: 'indigo' },
                        { label: "H-Index", value: "24", icon: <BarChart3 className="w-4 h-4" />, variant: 'azure' },
                        { label: "Review Pending", value: stats.pendingApprovals, icon: <Clock className="w-4 h-4" />, variant: 'warning' },
                        { label: "Monthly Goal", value: "84%", icon: <PieChart className="w-4 h-4" />, variant: 'primary' }
                    ].map((stat, idx) => (
                        <StatCard
                            key={idx}
                            label={stat.label}
                            value={stat.value}
                            variant={stat.variant as any}
                            icon={stat.icon}
                            className="bg-background border border-border/50 shadow-sm hover:border-primary/30"
                        />
                    ))}
                </div>
            </div>

            {/* Comprehensive Integrated Chart Section */}
            <DashboardChartContainer
                title="Performance Analytics"
                subtitle={`${chartDomain === 'all' ? 'Overall' : recordTypeMeta[chartDomain as keyof typeof recordTypeMeta].label} trend for ${chartYear}`}
                className="lg:col-span-3 min-h-[500px]"
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Chart Type Switcher */}
                        <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/40 mr-2">
                            <button
                                onClick={() => setChartType('area')}
                                className={cn("p-1.5 rounded-md transition-all", chartType === 'area' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
                            >
                                <AreaIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setChartType('line')}
                                className={cn("p-1.5 rounded-md transition-all", chartType === 'line' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
                            >
                                <LineIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setChartType('bar')}
                                className={cn("p-1.5 rounded-md transition-all", chartType === 'bar' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
                            >
                                <BarIcon className="w-4 h-4" />
                            </button>
                        </div>

                        <Select value={chartYear} onValueChange={setChartYear}>
                            <SelectTrigger className="w-[90px] h-8 text-[11px] font-medium">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {chartYears.map(year => (
                                    <SelectItem key={year} value={year}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={chartDomain} onValueChange={setChartDomain}>
                            <SelectTrigger className="w-[120px] h-8 text-[11px] font-medium">
                                <SelectValue placeholder="Domain" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Domains</SelectItem>
                                {Object.values(recordTypeMeta).map(meta => (
                                    <SelectItem key={meta.type} value={meta.type}>{meta.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={compareWith} onValueChange={setCompareWith}>
                            <SelectTrigger className="w-[130px] h-8 text-[11px] font-medium bg-muted/40 border-dashed">
                                <SelectValue placeholder="Comparison" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No Comparison</SelectItem>
                                {chartYears.filter(y => y !== chartYear).map(year => (
                                    <SelectItem key={year} value={year}>Vs Year {year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                }
            >
                <div className="mt-8 h-[380px] w-full flex flex-col">
                    {/* Visualizing dynamic metric based on selection */}
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex gap-10">
                            <div className="relative pl-4">
                                <div className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-full" />
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Current Volume</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-black text-foreground">{monthlyData.reduce((acc, curr) => acc + curr.current, 0)}</p>
                                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
                                        <TrendingUp className="w-3 h-3" /> 12%
                                    </span>
                                </div>
                            </div>
                            {compareWith !== 'none' && (
                                <div className="relative pl-4">
                                    <div className="absolute left-0 top-1 bottom-1 w-1 bg-muted rounded-full" />
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Benchmark ({compareWith})</p>
                                    <p className="text-2xl font-black text-muted-foreground/60">{monthlyData.reduce((acc, curr) => acc + (curr.comparison || 0), 0)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {renderChart()}
                        </ResponsiveContainer>
                    </div>
                </div>
            </DashboardChartContainer>
        </div>
    )
}

export default AdminDashboard
