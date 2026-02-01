import { Card } from "@/components/shadcn/ui/card"

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
}

export const StatCard = ({ icon, value, label }: StatCardProps) => {
  return (
    <Card className="relative bg-white/55 rounded-[32px] px-6 py-6 shadow-sm border border-gray-100">
      <div className="flex flex-col items-start gap-4">
        
        {/* Icon Bubble */}
        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-700 text-white shadow-md">
          {icon}
        </div>

        {/* Value */}
        <p className="text-4xl font-extrabold text-blue-700 leading-none tracking-tight">
          {value}
        </p>

        {/* Label */}
        <p className="text-lg font-semibold text-teal-600">
          {label}
        </p>

      </div>
    </Card>
  )
}

export default StatCard