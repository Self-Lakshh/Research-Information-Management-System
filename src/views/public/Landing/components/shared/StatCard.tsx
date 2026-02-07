import { Card } from "@/components/shadcn/ui/card"

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
}

export const StatCard = ({ icon, value, label }: StatCardProps) => {
  return (
    <Card className="relative bg-white/55 rounded-2xl sm:rounded-[32px] px-4 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-6 lg:py-8 xl:py-10 shadow-sm border border-gray-100 transition-all duration-500 ease-out hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:border-primary/10 h-full flex flex-col justify-center">
      <div className="flex flex-col items-center sm:items-start gap-3 sm:gap-4 lg:gap-5">

        {/* Icon Bubble */}
        <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16 flex items-center justify-center rounded-2xl sm:rounded-full bg-blue-700 text-white shadow-md transition-transform duration-300 hover:scale-110">
          {icon}
        </div>

        <div className="text-center sm:text-left space-y-1">
          {/* Value */}
          <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-blue-700 leading-none tracking-tight">
            {value}
          </p>

          {/* Label */}
          <p className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-teal-600/90 tracking-wide uppercase">
            {label}
          </p>
        </div>

      </div>
    </Card>
  )
}

export default StatCard