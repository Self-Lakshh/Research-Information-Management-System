import { useState } from 'react'
import {
    FileText,
    Users,
    Award,
    Clock,
    TrendingUp,
    BarChart3,
    PieChart,
    Activity
} from 'lucide-react'
import {
    StatCard,
    ChartContainer,
    BarChartPlaceholder,
    DonutChartPlaceholder,
    LineChartPlaceholder,
    RecordsSummaryTable
} from '../components'
import { recordTypeMeta } from '../config'

// ============================================
// DASHBOARD PAGE
// ============================================

const AdminDashboard = () => {
    // Mock data - replace with API calls
    const stats = {
        totalRecords: 1247,
        pendingApprovals: 23,
        totalUsers: 156,
        monthlySubmissions: 48
    }

    const recordsByType = [
        { label: 'Journal', value: 342 },
        { label: 'Conference', value: 287 },
        { label: 'IPR', value: 156 },
        { label: 'Book', value: 98 },
        { label: 'Award', value: 134 },
        { label: 'Grant', value: 112 },
        { label: 'Consult.', value: 89 },
        { label: 'Other', value: 29 }
    ]

    const approvalStatus = [
        { label: 'Approved', value: 1089, color: 'bg-emerald-500' },
        { label: 'Pending', value: 23, color: 'bg-amber-500' },
        { label: 'Rejected', value: 45, color: 'bg-rose-500' },
        { label: 'Draft', value: 90, color: 'bg-slate-400' }
    ]

    const monthlyData = [
        { label: 'Jan', value: 45 },
        { label: 'Feb', value: 52 },
        { label: 'Mar', value: 38 },
        { label: 'Apr', value: 67 },
        { label: 'May', value: 74 },
        { label: 'Jun', value: 48 }
    ]

    const summaryData = Object.values(recordTypeMeta).map((meta) => ({
        type: meta.label,
        total: Math.floor(Math.random() * 300) + 50,
        pending: Math.floor(Math.random() * 10)
    }))

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Overview of research records and activities
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Records"
                    value={stats.totalRecords.toLocaleString()}
                    trend={{ value: 12, direction: 'up' }}
                    subtext="from last month"
                    icon={<FileText className="w-5 h-5" />}
                />
                <StatCard
                    label="Pending Approvals"
                    value={stats.pendingApprovals}
                    trend={{ value: 3, direction: 'down' }}
                    subtext="from last week"
                    icon={<Clock className="w-5 h-5" />}
                />
                <StatCard
                    label="Total Users"
                    value={stats.totalUsers}
                    trend={{ value: 8, direction: 'up' }}
                    subtext="new this month"
                    icon={<Users className="w-5 h-5" />}
                />
                <StatCard
                    label="Monthly Submissions"
                    value={stats.monthlySubmissions}
                    trend={{ value: 15, direction: 'up' }}
                    subtext="vs previous month"
                    icon={<TrendingUp className="w-5 h-5" />}
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartContainer
                    title="Records by Type"
                    subtitle="Distribution across categories"
                >
                    <BarChartPlaceholder data={recordsByType} className="mt-4" />
                </ChartContainer>

                <ChartContainer
                    title="Approval Status"
                    subtitle="Current pipeline overview"
                >
                    <DonutChartPlaceholder data={approvalStatus} className="mt-4" />
                </ChartContainer>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <ChartContainer
                    title="Monthly Submissions"
                    subtitle="Last 6 months trend"
                    className="lg:col-span-2"
                >
                    <LineChartPlaceholder data={monthlyData} className="mt-4" />
                </ChartContainer>

                <RecordsSummaryTable
                    data={summaryData}
                    onRowClick={(type: string) => console.log('Navigate to:', type)}
                />
            </div>
        </div>
    )
}

export default AdminDashboard
