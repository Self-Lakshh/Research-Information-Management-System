import { Card, CardContent } from "@/components/shadcn/ui/card"
import { OptimizedImage } from "./OptimizedImage"

interface PartnerCardProps {
  icon: string
  name: string
  description: string
  url?: string
}

export const PartnerCard = ({ icon, name, description, url = "#" }: PartnerCardProps) => {
  return (
    <Card
      className="
        group
        h-[280px] sm:h-[320px] lg:h-[340px]
        w-full
        max-w-[320px]
        rounded-xl sm:rounded-2xl
        border
        bg-card
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-xl
        hover:border-primary/30
      "
    >
      <CardContent className="flex h-full flex-col p-4 sm:p-5 lg:p-6">
        <div className="mb-3 sm:mb-4 lg:mb-5">
          <div className="flex h-16 sm:h-18 lg:h-20 w-full items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary/15 overflow-hidden">
            <OptimizedImage
              src={icon}
              alt={name}
              className="object-cover overflow-hidden max-h-12 sm:max-h-14 lg:max-h-16 transition-transform duration-300 group-hover:scale-105"
              skeletonClassName="max-h-12 sm:max-h-14 lg:max-h-16 w-24"
            />
          </div>
        </div>

        <h3 className="text-sm sm:text-base font-semibold text-primary transition-colors duration-300 group-hover:text-primary/80">
          {name}
        </h3>

        <p className="mt-1.5 sm:mt-2 lg:mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {description}
        </p>

        <div className="flex-grow" />

        <div className="my-2 sm:my-3 lg:my-4 h-px w-full bg-border transition-colors duration-300 group-hover:bg-primary/20" />

        <a
          href={url}
          className="inline-flex items-center text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-all duration-300 group-hover:translate-x-1"
        >
          Visit <span className="ml-1.5 sm:ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </CardContent>
    </Card>
  )
}

export default PartnerCard
