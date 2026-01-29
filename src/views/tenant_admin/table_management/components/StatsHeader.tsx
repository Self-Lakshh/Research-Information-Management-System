import { TableStats } from '@/@types/table'
import { Building2, Table2, CheckCircle2, Users, XCircle } from 'lucide-react'

type StatsHeaderProps = {
    stats: TableStats
}

const StatsHeader = ({ stats }: StatsHeaderProps) => {
    const statCards = [
        {
            label: 'Total Floors',
            value: stats.totalFloors,
            icon: Building2,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
        },
        {
            label: 'Total Tables',
            value: stats.totalTables,
            icon: Table2,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
        },
        {
            label: 'Available Tables',
            value: stats.availableTables,
            icon: CheckCircle2,
            color: 'text-green-500',
            bgColor: 'bg-green-50',
        },
        {
            label: 'Occupied Tables',
            value: stats.occupiedTables,
            icon: Users,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50',
        },
        {
            label: 'Inactive Tables',
            value: stats.inactiveTables,
            icon: XCircle,
            color: 'text-gray-500',
            bgColor: 'bg-gray-50',
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-muted/30">
            {statCards.map((stat) => (
                <div key={stat.label} className="bg-card rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                        <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default StatsHeader
