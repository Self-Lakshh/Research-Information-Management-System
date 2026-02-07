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
      <CardContent className="p-0 h-full flex flex-row">
        {/* Image Area - Left Side */}
        <div className="w-24 sm:w-1/3 md:w-1/4 lg:w-1/3 aspect-square relative flex-shrink-0 overflow-hidden border-r border-gray-100 dark:border-gray-800">
          <OptimizedImage
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
        </div>

        {/* Content Area - Right Side */}
        <div className="flex-grow p-3 sm:p-4 lg:p-6 flex flex-col justify-center transition-colors duration-500 ease-out group-hover:bg-secondary">
          <h3 className="font-bold text-secondary text-sm sm:text-lg lg:text-xl mb-1 sm:mb-2 transition-colors duration-500 ease-out group-hover:text-background leading-tight">
            {title}
          </h3>
          <p className="text-[10px] sm:text-sm lg:text-base text-muted-foreground leading-relaxed transition-colors duration-500 ease-out group-hover:text-background/90 line-clamp-3 sm:line-clamp-none">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default FeatureCard