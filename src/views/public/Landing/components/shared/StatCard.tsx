import { Card, CardContent } from "@/components/shadcn/ui/card"

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
}

export const StatCard = ({ icon, value, label }: StatCardProps) => {
  return (
    <Card className="rounded-2xl shadow-md border bg-white/80 backdrop-blur">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default StatCard