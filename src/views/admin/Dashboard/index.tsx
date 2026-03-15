import { useState, useMemo } from 'react'
import {
    FileText, Users, Award, Clock, TrendingUp, BarChart3, PieChart, Activity, Calendar,
    Shield,
    BookOpen,
    Briefcase,
    Search,
    ChevronDown,
    ChevronUp,
    LineChart as LineIcon,
    AreaChart as AreaCircleIcon,
    BarChart as BarIcon
} from 'lucide-react'
import { StatCard, ChartHeader, ComparisionFilter, YearFilter, DomainFilter } from '@/components/custom'
import { RecordsSummaryTable } from './components'
import { useDashboardData } from '@/hooks/useDashboard'
import { RECORD_TYPE_CONFIG } from '@/configs/rims.config'
import type { RecordType } from '@/@types/rims.types'
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
    const now = new Date()
    const currentYear = now.getFullYear()
    const endYear = now.getMonth() === 11 ? currentYear + 1 : currentYear

    const [selectedYear, setSelectedYear] = useState('all')
    const [statsDomain, setStatsDomain] = useState('all')

    const [chartYear, setChartYear] = useState(currentYear.toString())
    const [chartDomain, setChartDomain] = useState('all')
    const [compareYears, setCompareYears] = useState<string[]>([])
    const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area')

    const availableYears = ['all']
    for (let year = endYear; year >= 2021; year--) {
        availableYears.push(year.toString())
    }

    const chartYears = availableYears.filter(y => y !== 'all')

    // 1. USE THE NEW CLOUD FUNCTION HOOK
    const { data, isLoading } = useDashboardData({
        statsYear: selectedYear,
        statsDomain,
        chartYear,
        chartDomain,
        compareYears
    })

    // Get aggregated data from result
    const stats = data?.stats || {
        totalRecords: 0,
        pendingApprovals: 0,
        totalUsers: 0,
        monthlySubmissions: 0,
        iprs: 0,
        journals: 0,
        conferences: 0,
        grants: 0
    }

    const monthlyData = data?.chartData || []
    const summaryData = data?.summaryData || []

    const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#0ea5e9']

    const renderChart = () => {
        const sharedProps = {
            data: monthlyData,
            margin: { top: 10, right: 10, left: -20, bottom: 0 }
        }

        switch (chartType) {
            case 'line':
                return (
                    <LineChart {...sharedProps}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ fontWeight: 'bold' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                        <Line type="monotone" dataKey="current" name={`Year ${chartYear}`} stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
                        {compareYears.map((year, i) => (
                            <Line key={year} type="monotone" dataKey={`year_${year}`} name={`Year ${year}`} stroke={COLORS[i % COLORS.length]} strokeDasharray="5 5" strokeWidth={2} dot={{ r: 3 }} />
                        ))}
                    </LineChart>
                )
            case 'area':
                return (
                    <AreaChart {...sharedProps}>
                        <defs>
                            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                            {compareYears.map((year, i) => (
                                <linearGradient key={year} id={`color_${year}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.1} />
                                    <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="current" name={`Year ${chartYear}`} stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCurrent)" strokeWidth={2} />
                        {compareYears.map((year, i) => (
                            <Area key={year} type="monotone" dataKey={`year_${year}`} name={`Year ${year}`} stroke={COLORS[i % COLORS.length]} fillOpacity={1} fill={`url(#color_${year})`} strokeWidth={2} strokeDasharray="4 4" />
                        ))}
                    </AreaChart>
                )
            case 'bar':
                return (
                    <BarChart {...sharedProps}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="current" name={`Year ${chartYear}`} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={16} />
                        {compareYears.map((year, i) => (
                            <Bar key={year} dataKey={`year_${year}`} name={`Year ${year}`} fill={COLORS[i % COLORS.length]} opacity={0.6} radius={[4, 4, 0, 0]} barSize={16} />
                        ))}
                    </BarChart>
                )
        }
    }

    return (
        <div className="flex flex-col h-full min-w-0 overflow-hidden">
            <div className="flex-auto overflow-y-auto no-scrollbar space-y-6 pb-12 pr-1">

                {/* 1st Container: Statistical Overview */}
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-premium flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-foreground tracking-tight uppercase">Statistical Overview</h2>
                        <div className="flex items-center gap-3">
                            <DomainFilter
                                value={statsDomain}
                                onChange={setStatsDomain}
                                className="w-[160px] h-9"
                            />
                            <YearFilter
                                value={selectedYear}
                                onChange={setSelectedYear}
                            />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            { label: "Researchers", value: stats.totalUsers, icon: Users, variant: 'indigo' },
                            { label: "Publications", value: stats.totalRecords, icon: FileText, variant: 'primary' },
                            { label: "Journals", value: stats.journals, icon: BookOpen, variant: 'azure' },
                            { label: "IPR / Patents", value: stats.iprs, icon: Shield, variant: 'rose' },
                            { label: "Conf. Papers", value: stats.conferences, icon: Activity, variant: 'amber' },
                            { label: "Research Grants", value: stats.grants, icon: Briefcase, variant: 'emerald' },
                            { label: "Books & Chapters", value: (stats as any).books || 0, icon: FileText, variant: 'primary' },
                            { label: "Other Activity", value: (stats as any).others || 0, icon: TrendingUp, variant: 'indigo' },
                            { label: "Review Pending", value: stats.pendingApprovals, icon: Clock, variant: 'warning' },
                            { label: "Monthly Progress", value: stats.monthlySubmissions, icon: PieChart, variant: 'primary' }
                        ].map((stat, idx) => (
                            <StatCard
                                key={idx}
                                label={stat.label}
                                value={stat.value.toLocaleString()}
                                variant={stat.variant as any}
                                icon={stat.icon}
                            />
                        ))}
                    </div>
                </div>

                {/* 2nd Container: Graphical Representation */}
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-premium flex flex-col gap-6">

                    {/* Unified Header & Filter Row */}
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-border/30">
                        <div className="flex flex-wrap items-center gap-6">
                            <h2 className="text-xl font-bold text-foreground tracking-tight uppercase whitespace-nowrap">Analytics</h2>

                            <div className="h-8 w-px bg-border/50 hidden xl:block" />

                            <div className="flex items-center gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Domain</span>
                                    <DomainFilter
                                        value={chartDomain}
                                        onChange={setChartDomain}
                                        className="w-[160px] h-9"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Target</span>
                                    <YearFilter
                                        value={chartYear}
                                        onChange={setChartYear}
                                        years={chartYears}
                                        className="w-[120px] h-9"
                                    />
                                </div>
                                <ComparisionFilter
                                    availableYears={chartYears.filter(y => y !== chartYear)}
                                    selectedYears={compareYears}
                                    onChange={setCompareYears}
                                    className="w-auto"
                                />
                            </div>
                        </div>

                        {/* Chart Type Toggles (Extracted from ChartHeader logic) */}
                        <div className="flex items-center bg-muted/20 p-1 rounded-xl border border-border/50 self-end xl:self-center">
                            <button
                                onClick={() => setChartType('area')}
                                className={cn(
                                    "p-2 rounded-lg transition-all",
                                    chartType === 'area' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <AreaCircleIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setChartType('line')}
                                className={cn(
                                    "p-2 rounded-lg transition-all",
                                    chartType === 'line' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <LineIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setChartType('bar')}
                                className={cn(
                                    "p-2 rounded-lg transition-all",
                                    chartType === 'bar' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <BarIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="h-[320px] w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            {renderChart()}
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard