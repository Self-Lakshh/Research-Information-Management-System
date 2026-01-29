"use client"

import { useState } from "react"
import {
    CartesianGrid,
    Line,
    LineChart,
    Bar,
    BarChart,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/ui/select"
import { BarChart3, LineChart as LineChartIcon } from "lucide-react"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/shadcn/ui/chart"
import RefetchLoader from "@/components/custom/RefetchLoader"
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/shadcn/ui/tabs"
import { cn } from "@/components/shadcn/utils"

const chartData = [
    { name: "1 Jan", sales: 3500, profit: 7000 },
    { name: "8 Jan", sales: 4200, profit: 7800 },
    { name: "15 Jan", sales: 5100, profit: 9200 },
    { name: "22 Jan", sales: 8100, profit: 10500 },
    { name: "29 Jan", sales: 6500, profit: 9800 },
    { name: "5 Feb", sales: 7200, profit: 6500 },
    { name: "12 Feb", sales: 6500, profit: 6800 },
]

const chartConfig = {
    sales: { label: "Sales", color: "var(--blue-500)" },
    profit: { label: "Profit", color: "var(--orange-500)" },
} satisfies ChartConfig

const DashboardChart = ({ className }: { className?: string }) => {
    const [chartType, setChartType] = useState<"bar" | "line">("line")
    const [activeTab, setActiveTab] = useState<"sales" | "profit" | "both">("both")
    const [isRefetching, setIsRefetching] = useState(false)

    const handleRefetch = () => {
        setIsRefetching(true)
        setTimeout(() => setIsRefetching(false), 1000)
    }

    const getVisibleKeys = () => {
        if (activeTab === "sales") return ["sales"]
        if (activeTab === "profit") return ["profit"]
        return ["sales", "profit"]
    }

    const visibleKeys = getVisibleKeys()

    return (
        <div className={cn("bg-card rounded-lg flex flex-col h-full min-h-0", className)}>
            {/* HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2">
                {/* LEFT: Metric Tabs */}
                <Tabs defaultValue="both" value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
                    <TabsList className="flex gap-1">
                        <TabsTrigger value="sales">Sales</TabsTrigger>
                        <TabsTrigger value="profit">Profit</TabsTrigger>
                        <TabsTrigger value="both">Both</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* RIGHT: Chart type + Date + Refetch */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Chart type toggle */}
                    <Tabs defaultValue={chartType} value={chartType} onValueChange={(v: any) => setChartType(v)}>
                        <TabsList className="flex gap-1">
                            <TabsTrigger
                                value="line"
                                className="p-1.5 rounded-md text-blue-500 data-[state=active]:bg-card dark:data-[state=active]:bg-muted data-[state=active]:text-blue-500 dark:data-[state=active]:text-white"
                            >
                                <LineChartIcon size={16} />
                            </TabsTrigger>
                            <TabsTrigger
                                value="bar"
                                className="p-1.5 rounded-md text-blue-500 data-[state=active]:bg-card dark:data-[state=active]:bg-muted data-[state=active]:text-blue-500 dark:data-[state=active]:text-white"
                            >
                                <BarChart3 size={16} />
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Date Range */}
                    <Select defaultValue="30days">
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="30days">Last 30 Days</SelectItem>
                            <SelectItem value="7days">Last 7 Days</SelectItem>
                            <SelectItem value="90days">Last 90 Days</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Refetch */}
                    <RefetchLoader isRefetching={isRefetching} handleRefetch={handleRefetch} />
                </div>
            </div>

            {/* BODY: CHART */}
            <div className="relative flex-1 p-4 min-h-0">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === "line" ? (
                            <LineChart
                                data={chartData}
                                margin={{ top: 12, right: 12, left: 12, bottom: 12 }}
                            >
                                <CartesianGrid vertical={false} />

                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />

                                {/* LEFT AXIS */}
                                {visibleKeys.includes("profit") && (
                                    <YAxis
                                        yAxisId="left"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(v) => `${v / 1000}K`}
                                        label={{
                                            value: chartConfig.profit.label,
                                            angle: -90,
                                            position: "insideLeft",
                                            offset: 0,
                                            style: {
                                                fill: "var(--orange-500)",
                                                fontSize: 12,
                                                fontWeight: 500,
                                            },
                                        }}
                                    />
                                )}

                                {/* RIGHT AXIS */}
                                {visibleKeys.includes("sales") && (
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(v) => `${v / 1000}K`}
                                        label={{
                                            value: chartConfig.sales.label,
                                            angle: 90,
                                            position: "insideRight",
                                            offset: 0,
                                            style: {
                                                fill: "var(--blue-500)",
                                                fontSize: 12,
                                                fontWeight: 500,
                                            },
                                        }}
                                    />
                                )}

                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

                                {visibleKeys.includes("sales") && (
                                    <Line
                                        yAxisId="right"
                                        dataKey="sales"
                                        type="monotone"
                                        stroke="var(--blue-500)"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                )}

                                {visibleKeys.includes("profit") && (
                                    <Line
                                        yAxisId="left"
                                        dataKey="profit"
                                        type="monotone"
                                        stroke="var(--orange-500)"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                )}
                            </LineChart>
                        ) : (
                            <BarChart
                                data={chartData}
                                margin={{ top: 12, right: 12, left: 12, bottom: 12 }}
                                barGap={6}
                            >
                                <CartesianGrid vertical={false} />

                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />

                                {visibleKeys.includes("profit") && (
                                    <YAxis
                                        yAxisId="left"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(v) => `${v / 1000}K`}
                                        label={{
                                            value: chartConfig.profit.label,
                                            angle: -90,
                                            position: "insideLeft",
                                            offset: -5,
                                            style: {
                                                fill: "var(--orange-500)",
                                                fontSize: 12,
                                                fontWeight: 500,
                                            },
                                        }}
                                    />
                                )}

                                {visibleKeys.includes("sales") && (
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(v) => `${v / 1000}K`}
                                        label={{
                                            value: chartConfig.sales.label,
                                            angle: 90,
                                            position: "insideRight",
                                            offset: -5,
                                            style: {
                                                fill: "var(--blue-500)",
                                                fontSize: 12,
                                                fontWeight: 500,
                                            },
                                        }}
                                    />
                                )}

                                <Tooltip content={<ChartTooltipContent />} />

                                {visibleKeys.includes("sales") && (
                                    <Bar
                                        yAxisId="right"
                                        dataKey="sales"
                                        fill="var(--blue-500)"
                                        radius={[4, 4, 0, 0]}
                                    />
                                )}

                                {visibleKeys.includes("profit") && (
                                    <Bar
                                        yAxisId="left"
                                        dataKey="profit"
                                        fill="var(--orange-500)"
                                        radius={[4, 4, 0, 0]}
                                    />
                                )}
                            </BarChart>

                        )}
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
        </div>
    )
}

export default DashboardChart