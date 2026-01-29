import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
    useTables,
    useFloors,
    useTableStats,
    useCreateTable,
    useUpdateTable,
    useToggleTableStatus,
    useTableOrders,
} from '@/hooks/useTable'
import {
    StatsHeader,
    FloorSection,
    AddTableDialog,
    TableDetailsDialog,
} from './components'
import Loading from '@/components/shared/Loading'
import type { Table } from '@/@types/table'

const TableManagement = () => {
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showDetailsDialog, setShowDetailsDialog] = useState(false)
    const [selectedTable, setSelectedTable] = useState<Table | null>(null)

    const { data: tables = [], isLoading: loadingTables } = useTables()
    const { data: floors = [], isLoading: loadingFloors } = useFloors()
    const { data: stats } = useTableStats()
    const { data: orders = [] } = useTableOrders(selectedTable?.id || '')

    const createTableMutation = useCreateTable()
    const updateTableMutation = useUpdateTable()
    const toggleStatusMutation = useToggleTableStatus()

    const handleAddTable = async (input: any) => {
        if (selectedTable) {
            await updateTableMutation.mutateAsync({ ...input, id: selectedTable.id })
        } else {
            await createTableMutation.mutateAsync(input)
        }
    }

    const handleEditTable = (table: Table) => {
        setSelectedTable(table)
        setShowAddDialog(true)
    }

    const handleTableClick = (table: Table) => {
        setSelectedTable(table)
        setShowDetailsDialog(true)
    }

    const handleToggleStatus = async (id: string) => {
        await toggleStatusMutation.mutateAsync(id)
    }

    const handleCloseDialog = () => {
        setShowAddDialog(false)
        setSelectedTable(null)
    }

    const handleCloseDetailsDialog = () => {
        setShowDetailsDialog(false)
        setSelectedTable(null)
    }

    if (loadingTables || loadingFloors) {
        return (
            <div className="flex h-full items-center justify-center min-h-100">
                <Loading loading={true} />
            </div>
        )
    }

    const tablesByFloor = floors.map((floor) => ({
        floor,
        tables: tables.filter((table) => table.floorId === floor.id),
    }))

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Stats */}
            {stats && <StatsHeader stats={stats} />}

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-card">
                <h1 className="text-xl font-bold text-foreground">Tables Overview</h1>
                <button
                    onClick={() => setShowAddDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus size={20} />
                    Add Table
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {tablesByFloor.map(({ floor, tables: floorTables }) => (
                    <FloorSection
                        key={floor.id}
                        floor={floor}
                        tables={floorTables}
                        onEditTable={handleEditTable}
                        onToggleTableStatus={handleToggleStatus}
                        onTableClick={handleTableClick}
                    />
                ))}

                {tablesByFloor.length === 0 && (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <p className="text-muted-foreground mb-4">No tables found</p>
                            <button
                                onClick={() => setShowAddDialog(true)}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                            >
                                Add Your First Table
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Dialogs */}
            <AddTableDialog
                isOpen={showAddDialog}
                onClose={handleCloseDialog}
                onSubmit={handleAddTable}
                floors={floors}
                editTable={selectedTable}
            />

            {selectedTable && (
                <TableDetailsDialog
                    isOpen={showDetailsDialog}
                    onClose={handleCloseDetailsDialog}
                    table={selectedTable}
                    orders={orders}
                    onToggleStatus={handleToggleStatus}
                />
            )}
        </div>
    )
}

export default TableManagement
