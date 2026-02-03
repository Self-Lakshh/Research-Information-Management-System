import React from 'react'
import { ChevronRight } from 'lucide-react'

interface SummaryItem {
    type: string
    total: number
    pending: number
}

interface RecordsSummaryTableProps {
    data: SummaryItem[]
    onRowClick?: (type: string) => void
    className?: string
}

export function RecordsSummaryTable({
    data,
    onRowClick,
    className = ''
}: RecordsSummaryTableProps) {
    return (
        <div className={`bg-card border border-border rounded-xl overflow-hidden flex flex-col ${className}`}>
            <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Records Summary</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Quick overview by type</p>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-card border-b border-border z-10">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                                Total
                            </th>
                            <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                                Pending
                            </th>
                            <th className="w-10 px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {data.map((item) => (
                            <tr
                                key={item.type}
                                onClick={() => onRowClick?.(item.type)}
                                className="group cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-foreground">
                                        {item.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-sm text-foreground font-mono">
                                        {item.total}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {item.pending > 0 ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                            {item.pending}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-muted-foreground/50 font-mono">
                                            0
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-3 bg-muted/30 border-t border-border mt-auto text-center">
                <button className="text-xs font-medium text-primary hover:underline">
                    View Full Report
                </button>
            </div>
        </div>
    )
}

export default RecordsSummaryTable
