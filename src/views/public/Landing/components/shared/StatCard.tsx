import { Card } from "@/components/shadcn/ui/card"

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
}

export const StatCard = ({ icon, value, label }: StatCardProps) => {
  return (
    <Card className="relative bg-white/55 rounded-2xl sm:rounded-[32px] px-4 sm:px-5 lg:px-6 py-4 sm:py-5 lg:py-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
      <div className="flex flex-col items-start gap-2 sm:gap-3 lg:gap-4">

        {/* Icon Bubble */}
        <div className="h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 flex items-center justify-center rounded-full bg-blue-700 text-white shadow-md transition-transform duration-300 hover:scale-110">
          {icon}
        </div>

        {/* Value */}
        <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-700 leading-none tracking-tight">
          {value}
        </p>

        {/* Label */}
        <p className="text-sm sm:text-base lg:text-lg font-semibold text-teal-600">
          {label}
        </p>

      </div>
    </Card>
  )
}

export default StatCard