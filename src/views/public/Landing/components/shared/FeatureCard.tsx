import { Card, CardContent } from "@/components/shadcn/ui/card"
import { OptimizedImage } from "./OptimizedImage"

interface FeatureCardProps {
  image: string
  title: string
  description: string
}

export const FeatureCard = ({ image, title, description }: FeatureCardProps) => {
  return (
    <Card className="group rounded-xl sm:rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-700 ease-out h-full overflow-hidden bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
      <CardContent className="p-0 h-full flex flex-col sm:flex-row">
        {/* Image Area - Left Side */}
        <div className="w-full sm:w-1/3 aspect-square relative flex-shrink-0 overflow-hidden">
          <OptimizedImage
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
        </div>

        {/* Content Area - Right Side */}
        <div className="flex-grow p-3 sm:p-4 lg:p-5 flex flex-col justify-center transition-colors duration-500 ease-out group-hover:bg-secondary">
          <h3 className="font-bold text-secondary text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 transition-colors duration-500 ease-out group-hover:text-background">
            {title}
          </h3>
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed transition-colors duration-500 ease-out group-hover:text-background/90">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default FeatureCard