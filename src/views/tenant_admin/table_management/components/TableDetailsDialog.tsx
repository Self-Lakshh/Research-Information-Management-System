import { useState } from 'react'
import { X, Download, DollarSign, Clock, Users } from 'lucide-react'
import { Table, TableOrder } from '@/@types/table'
import { Switch } from '@/components/shadcn/ui/switch'
import TabHeader from '@/components/shared/TabHeader'

type TableDetailsDialogProps = {
    isOpen: boolean
    onClose: () => void
    table: Table
    orders: TableOrder[]
    onToggleStatus: (id: string) => void
}

const TableDetailsDialog = ({
    isOpen,
    onClose,
    table,
    orders,
    onToggleStatus,
}: TableDetailsDialogProps) => {
    const [activeTab, setActiveTab] = useState('orders')

    if (!isOpen) return null

    const tabs = [
        { id: 'orders', label: 'Orders' },
        { id: 'details', label: 'Table Details' },
        { id: 'qr', label: 'QR Details' },
    ]

    const handleDownloadQR = () => {
        console.log('Downloading QR code for', table.name)
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground font-semibold">
                            {table.number}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                {table.name}
                            </h2>
                            <p className="text-sm text-muted-foreground">{table.floorName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Switch
                            checked={table.enabled}
                            onCheckedChange={() => onToggleStatus(table.id)}
                        />
                        <span className="text-sm text-muted-foreground">Enabled</span>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30">
                    <div className="bg-card rounded-lg p-3 flex items-center gap-3">
                        <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Total Revenue (Till Now)
                            </p>
                            <p className="text-lg font-bold text-foreground">
                                ₹{table.totalRevenue.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg p-3 flex items-center gap-3">
                        <div className="bg-purple-50 text-purple-600 p-2 rounded-lg">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Total Orders (Till Now)
                            </p>
                            <p className="text-lg font-bold text-foreground">
                                {table.totalOrders}
                            </p>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg p-3 flex items-center gap-3">
                        <div className="bg-green-50 text-green-600 p-2 rounded-lg">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Capacity</p>
                            <p className="text-lg font-bold text-foreground">{table.capacity}</p>
                        </div>
                    </div>
                </div>

                {/* Table Status Dropdown */}
                <div className="p-4 border-b">
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Table Status
                    </label>
                    <select
                        value={table.status}
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">All</option>
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="reserved">Reserved</option>
                    </select>
                </div>

                {/* Tabs */}
                <TabHeader tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'orders' && (
                        <div className="p-4">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                                                Time ↕
                                            </th>
                                            <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                                                Order
                                            </th>
                                            <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                                                Customers ↕
                                            </th>
                                            <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                                                Items ↕
                                            </th>
                                            <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                                                Amount
                                            </th>
                                            <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                                                Created By ↕
                                            </th>
                                            <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                                                Status ↕
                                            </th>
                                            <th className="w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id} className="border-b hover:bg-muted/50">
                                                <td className="py-3 px-2 text-sm text-foreground">
                                                    {new Date(order.createdAt).toLocaleString()}
                                                </td>
                                                <td className="py-3 px-2 text-sm text-foreground">
                                                    {order.orderId}
                                                </td>
                                                <td className="py-3 px-2 text-sm text-blue-600 cursor-pointer">
                                                    Customer_Details
                                                </td>
                                                <td className="py-3 px-2 text-sm text-foreground">
                                                    {order.items.length} Items
                                                </td>
                                                <td className="py-3 px-2 text-sm text-foreground">
                                                    ${order.totalAmount.toFixed(2)}
                                                </td>
                                                <td className="py-3 px-2 text-sm text-foreground">
                                                    {order.createdBy}
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium capitalize">
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <button className="text-muted-foreground hover:text-foreground">
                                                        ⋮
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                                <span>20 of 700 rows are shown.</span>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 border rounded hover:bg-muted">
                                        Previous
                                    </button>
                                    <button className="px-3 py-1 border rounded hover:bg-muted">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="p-4">
                            <div className="p-4 border rounded-lg space-y-4">
                                <div>
                                    <h3 className="font-medium text-foreground mb-1">
                                        Table Details
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Change the details of table if required
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">
                                            Select Floor
                                        </label>
                                        <select className="w-full px-3 py-2 border rounded-lg bg-background text-foreground">
                                            <option>{table.floorName}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">
                                            Capacity
                                        </label>
                                        <input
                                            type="number"
                                            value={table.capacity}
                                            className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button className="px-4 py-2 border rounded-lg text-foreground hover:bg-muted">
                                        Cancel
                                    </button>
                                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'qr' && (
                        <div className="p-4 flex items-center justify-center">
                            <div className="text-center max-w-md">
                                <div className="w-64 h-64 mx-auto mb-4 border-2 border-dashed rounded-lg flex items-center justify-center bg-white">
                                    <div className="w-48 h-48 bg-black/10 flex items-center justify-center text-6xl">
                                        📱
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    QR Menu - {table.name}
                                </h3>
                                <a
                                    href={table.qrCode}
                                    className="text-blue-600 hover:underline text-sm mb-4 block"
                                >
                                    {table.qrCode}
                                </a>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Print this QR code and stick it on {table.name} so customers
                                    can scan and place their own orders.
                                </p>
                                <button
                                    onClick={handleDownloadQR}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                                >
                                    <Download size={16} />
                                    Download QR
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TableDetailsDialog
