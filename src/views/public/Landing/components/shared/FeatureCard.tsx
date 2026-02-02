import { Card, CardContent } from "@/components/shadcn/ui/card"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="group rounded-2xl border shadow-sm hover:bg-secondary hover:shadow-md transition-all duration-300">
      <CardContent className="p-6 space-y-3">
        <div className="h-13 w-13 rounded-full bg-secondary flex items-center justify-center text-background transition-colors duration-300 group-hover:bg-background group-hover:text-secondary">
          {icon}
        </div>
        <h3 className="font-bold text-secondary text-2xl transition-colors duration-300 group-hover:text-background">
          {title}
        </h3>
        <p className="text-xl text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-background">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

export default FeatureCard