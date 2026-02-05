import { Card } from "@/components/shadcn/ui/card"

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
}

export const StatCard = ({ icon, value, label }: StatCardProps) => {
  return (
    <Card className="relative bg-white/55 rounded-2xl sm:rounded-[32px] px-4 sm:px-5 lg:px-6 py-4 sm:py-5 lg:py-6 shadow-sm border border-gray-100 transition-all duration-500 ease-out hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:border-primary/10">
      <div className="flex flex-col items-start gap-2 sm:gap-3 lg:gap-4">

        {/* Icon Bubble */}
        <div className="h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 flex items-center justify-center rounded-full bg-blue-700 text-white shadow-md transition-transform duration-300 hover:scale-110">
          {icon}
        </div>

        {/* Value */}
        <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-blue-700 leading-none tracking-tight">
          {value}
        </p>

        {/* Label */}
        <p className="text-xs sm:text-sm lg:text-base font-semibold text-teal-600">
          {label}
        </p>

      </div>
    </Card>
  )
}

export default StatCard