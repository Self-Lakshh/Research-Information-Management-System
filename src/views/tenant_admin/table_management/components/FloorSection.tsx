import { MoreVertical } from 'lucide-react'
import { Floor, Table } from '@/@types/table'
import TableCard from './TableCard'

type FloorSectionProps = {
    floor: Floor
    tables: Table[]
    onEditTable: (table: Table) => void
    onToggleTableStatus: (id: string) => void
    onTableClick: (table: Table) => void
    onEditFloor?: (floor: Floor) => void
}

const FloorSection = ({
    floor,
    tables,
    onEditTable,
    onToggleTableStatus,
    onTableClick,
    onEditFloor,
}: FloorSectionProps) => {
    return (
        <div className="mb-8">
            {/* Floor Header */}
            <div className="flex items-center justify-between mb-4 px-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-foreground">{floor.name}</h2>
                    <span className="px-2 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                        {floor.tableCount} Tables
                    </span>
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${floor.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        {floor.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                {onEditFloor && (
                    <button
                        onClick={() => onEditFloor(floor)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <MoreVertical size={20} className="text-muted-foreground" />
                    </button>
                )}
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
                {tables.map((table) => (
                    <TableCard
                        key={table.id}
                        table={table}
                        onEdit={onEditTable}
                        onToggleStatus={onToggleTableStatus}
                        onClick={onTableClick}
                    />
                ))}
            </div>
        </div>
    )
}

export default FloorSection
