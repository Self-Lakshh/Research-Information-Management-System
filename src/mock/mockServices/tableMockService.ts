import type {
    Table,
    Floor,
    TableOrder,
    TableStats,
    CreateTableInput,
    UpdateTableInput,
    CreateFloorInput,
    UpdateFloorInput,
} from '@/@types/table'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock Data
let floors: Floor[] = [
    {
        id: 'floor-1',
        name: 'Ground Floor',
        tableCount: 12,
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
    },
    {
        id: 'floor-2',
        name: '1st Floor',
        tableCount: 12,
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
    },
]

let tables: Table[] = [
    // Ground Floor Tables
    ...Array.from({ length: 12 }, (_, i) => ({
        id: `table-gf-${i + 1}`,
        number: `${i + 1}`,
        name: `Table ${i + 1}`,
        floorId: 'floor-1',
        floorName: 'Ground Floor',
        capacity: 4,
        status: (i % 3 === 0
            ? 'occupied'
            : i % 4 === 0
                ? 'reserved'
                : 'available') as Table['status'],
        enabled: i % 6 !== 0,
        totalRevenue: Math.floor(Math.random() * 50000) + 10000,
        totalOrders: Math.floor(Math.random() * 300) + 50,
        qrCode: `https://forkfly.app/menu?table=${i + 1}`,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-18T00:00:00Z',
    })),
    // 1st Floor Tables
    ...Array.from({ length: 12 }, (_, i) => ({
        id: `table-1f-${i + 1}`,
        number: `${i + 13}`,
        name: `Table ${i + 13}`,
        floorId: 'floor-2',
        floorName: '1st Floor',
        capacity: 4,
        status: (i % 3 === 0
            ? 'occupied'
            : i % 4 === 0
                ? 'reserved'
                : 'available') as Table['status'],
        enabled: true,
        totalRevenue: Math.floor(Math.random() * 50000) + 10000,
        totalOrders: Math.floor(Math.random() * 300) + 50,
        qrCode: `https://forkfly.app/menu?table=${i + 13}`,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-18T00:00:00Z',
    })),
]

let orders: TableOrder[] = Array.from({ length: 20 }, (_, i) => ({
    id: `order-${i + 1}`,
    orderId: `#0042`,
    tableId: tables[Math.floor(Math.random() * tables.length)].id,
    customerId: `customer-${i + 1}`,
    customerName: i % 2 === 0 ? 'Rahul Kumar' : 'Self',
    items: [
        { name: 'Classic Burger', quantity: 2, price: 158 },
        { name: 'French Fries', quantity: 1, price: 50 },
    ],
    totalAmount: 316,
    status: 'completed',
    createdBy: i % 2 === 0 ? 'Rahul Kumar' : 'Self',
    createdAt: '2025-02-12T12:33:00Z',
}))

export const tableMockService = {
    getTables: async (): Promise<Table[]> => {
        await delay(500)
        return tables
    },

    getTableById: async (id: string): Promise<Table | null> => {
        await delay(300)
        return tables.find((table) => table.id === id) || null
    },

    getTablesByFloor: async (floorId: string): Promise<Table[]> => {
        await delay(400)
        return tables.filter((table) => table.floorId === floorId)
    },

    createTable: async (input: CreateTableInput): Promise<Table> => {
        await delay(600)
        const newTable: Table = {
            ...input,
            id: `table-${Date.now()}`,
            totalRevenue: 0,
            totalOrders: 0,
            qrCode: `https://forkfly.app/menu?table=${input.number}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        tables.push(newTable)

        const floor = floors.find((f) => f.id === input.floorId)
        if (floor) {
            floor.tableCount++
        }

        return newTable
    },

    updateTable: async (input: UpdateTableInput): Promise<Table> => {
        await delay(600)
        const index = tables.findIndex((table) => table.id === input.id)
        if (index === -1) throw new Error('Table not found')

        const oldFloorId = tables[index].floorId
        tables[index] = {
            ...tables[index],
            ...input,
            updatedAt: new Date().toISOString(),
        }

        if (input.floorId && input.floorId !== oldFloorId) {
            const oldFloor = floors.find((f) => f.id === oldFloorId)
            const newFloor = floors.find((f) => f.id === input.floorId)
            if (oldFloor) oldFloor.tableCount--
            if (newFloor) newFloor.tableCount++
        }

        return tables[index]
    },

    deleteTable: async (id: string): Promise<void> => {
        await delay(500)
        const table = tables.find((t) => t.id === id)
        if (table) {
            const floor = floors.find((f) => f.id === table.floorId)
            if (floor) floor.tableCount--
        }
        tables = tables.filter((table) => table.id !== id)
    },

    toggleTableStatus: async (id: string): Promise<Table> => {
        await delay(400)
        const table = tables.find((t) => t.id === id)
        if (!table) throw new Error('Table not found')

        table.enabled = !table.enabled
        table.status = table.enabled ? 'available' : 'inactive'
        table.updatedAt = new Date().toISOString()

        return table
    },

    getFloors: async (): Promise<Floor[]> => {
        await delay(400)
        return floors
    },

    createFloor: async (input: CreateFloorInput): Promise<Floor> => {
        await delay(500)
        const newFloor: Floor = {
            ...input,
            id: `floor-${Date.now()}`,
            tableCount: 0,
            createdAt: new Date().toISOString(),
        }
        floors.push(newFloor)
        return newFloor
    },

    updateFloor: async (input: UpdateFloorInput): Promise<Floor> => {
        await delay(500)
        const index = floors.findIndex((floor) => floor.id === input.id)
        if (index === -1) throw new Error('Floor not found')

        floors[index] = {
            ...floors[index],
            ...input,
        }
        return floors[index]
    },

    deleteFloor: async (id: string): Promise<void> => {
        await delay(500)
        const floorTables = tables.filter((t) => t.floorId === id)
        if (floorTables.length > 0) {
            throw new Error('Cannot delete floor with existing tables')
        }
        floors = floors.filter((floor) => floor.id !== id)
    },

    getTableOrders: async (tableId: string): Promise<TableOrder[]> => {
        await delay(400)
        return orders.filter((order) => order.tableId === tableId)
    },

    getTableStats: async (): Promise<TableStats> => {
        await delay(300)
        const availableTables = tables.filter((t) => t.status === 'available').length
        const occupiedTables = tables.filter((t) => t.status === 'occupied').length
        const inactiveTables = tables.filter(
            (t) => t.status === 'inactive' || !t.enabled
        ).length

        return {
            totalFloors: floors.length,
            totalTables: tables.length,
            availableTables,
            occupiedTables,
            inactiveTables,
        }
    },
}
