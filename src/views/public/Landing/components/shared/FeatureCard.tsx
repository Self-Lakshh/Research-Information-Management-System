import { Card, CardContent } from "@/components/shadcn/ui/card"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="group rounded-xl sm:rounded-2xl border shadow-sm hover:bg-secondary hover:shadow-xl transition-all duration-300 h-full">
      <CardContent className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
        <div className="h-10 w-10 sm:h-11 sm:w-11 lg:h-13 lg:w-13 rounded-full bg-secondary flex items-center justify-center text-background transition-all duration-300 group-hover:bg-background group-hover:text-secondary group-hover:scale-110 flex-shrink-0">
          {icon}
        </div>
        <h3 className="font-bold text-secondary text-lg sm:text-xl lg:text-2xl transition-colors duration-300 group-hover:text-background mt-2 sm:mt-3">
          {title}
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-background/90 mt-2 sm:mt-3 flex-grow">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

export default FeatureCard