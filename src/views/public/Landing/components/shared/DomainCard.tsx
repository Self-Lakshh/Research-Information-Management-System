import { Card, CardContent } from "@/components/shadcn/ui/card"
import { OptimizedImage } from "./OptimizedImage"
import { cn } from "@/components/shadcn/utils"

interface DomainCardProps {
  title: string
  description: string
  tags: string[]
  image: string
}

export const DomainCard = ({ title, description, tags, image }: DomainCardProps) => {
  return (
    <Card
      className={cn(
        "group rounded-2xl overflow-hidden h-full",
        "border border-gray-100 bg-white dark:bg-gray-900",
        "shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]",
        "transition-all duration-700 ease-out hover:-translate-y-1 hover:border-primary/10"
      )}
    >
      {/* Image */}
      <div className="relative m-3 rounded-xl overflow-hidden h-40 sm:h-44 lg:h-48">
        <OptimizedImage
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          skeletonClassName="rounded-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      <CardContent className="p-5 sm:p-6 flex flex-col gap-4">
        {/* Title */}
        <h3 className="font-bold text-lg sm:text-xl lg:text-2xl leading-none text-primary transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-secondary/5 text-secondary border border-secondary/10 transition-colors duration-300 group-hover:bg-secondary/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default DomainCard