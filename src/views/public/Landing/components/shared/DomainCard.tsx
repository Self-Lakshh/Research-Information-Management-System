import { Card, CardContent } from "@/components/shadcn/ui/card"
import { OptimizedImage } from "./OptimizedImage"
import { cn } from "@/components/shadcn/utils"

interface DomainCardProps {
  title: string
  description?: string
  points?: string[]
  image: string
}

export const DomainCard = ({ title, description, points, image }: DomainCardProps) => {
  return (
    <Card
      className={cn(
        "group rounded-xl sm:rounded-2xl overflow-hidden h-full",
        "border bg-card",
        "shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]",
        "transition-all duration-500 ease-out",
        "hover:-translate-y-2"
      )}
    >
      {/* Image Container */}
      <div className="relative m-2 sm:m-3 lg:m-4 rounded-lg overflow-hidden h-32 sm:h-36 lg:h-40 xl:h-45">
        <OptimizedImage
          src={image}
          alt={title}
          className={cn(
            "w-full h-full object-cover",
            "transition-transform duration-500 ease-out",
            "group-hover:scale-105"
          )}
          skeletonClassName="rounded-lg"
        />
      </div>

      <CardContent className="p-3 sm:p-4 lg:p-5">
        {/* Title */}
        <h3
          className={cn(
            "font-semibold text-base sm:text-lg mb-1.5 sm:mb-2",
            "transition-transform duration-300 ease-out",
            "group-hover:translate-x-0.5"
          )}
        >
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
            {description}
          </p>
        )}

        {/* Points list */}
        {points && points.length > 0 && (
          <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 sm:space-y-1.5">
            {points.map((p, i) => (
              <li
                key={i}
                className={cn(
                  "flex items-start gap-2",
                  "transition-transform duration-300 ease-out",
                  "group-hover:translate-x-0.5"
                )}
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/50 mt-1.5 flex-shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default DomainCard