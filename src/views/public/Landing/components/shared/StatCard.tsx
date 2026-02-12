import { Card } from "@/components/shadcn/ui/card"

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
}

export const StatCard = ({ icon, value, label }: StatCardProps) => {
  return (
    <Card className="relative bg-white/55 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 transition-all duration-500 ease-out hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:border-primary/10 h-full flex flex-col justify-center w-full">
      <div className="flex flex-col items-center sm:items-start gap-2.5 sm:gap-3 md:gap-4">

        {/* Icon Bubble */}
        <div className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 flex items-center justify-center rounded-lg sm:rounded-xl bg-blue-700 text-white shadow-md transition-transform duration-300 hover:scale-110 shrink-0">
          <div className="scale-75 sm:scale-90 md:scale-100 flex items-center justify-center">
            {icon}
          </div>
        </div>

        <div className="text-center sm:text-left space-y-0.5 sm:space-y-1 w-full">
          {/* Value */}
          <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-700 leading-none tracking-tight break-words">
            {value}
          </p>

          {/* Label */}
          <p className="text-[10px] sm:text-xs md:text-sm font-bold text-teal-600/90 tracking-wide uppercase leading-tight">
            {label}
          </p>
        </div>

      </div>
    </Card>
  )
}

export default StatCard