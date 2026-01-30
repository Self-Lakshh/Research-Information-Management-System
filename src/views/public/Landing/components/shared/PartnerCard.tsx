import { Card, CardContent } from "@/components/shadcn/ui/card"

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
        mx-auto
        h-[340px] sm:h-[360px]
        w-full
        max-w-[320px]
        rounded-2xl
        border
        bg-card
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-xl
      "
    >
      <CardContent className="flex h-full flex-col p-5 sm:p-6">
        <div className="mb-4 sm:mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <img src={icon} alt={name} className="h-5 w-5 object-contain" />
          </div>
        </div>

        <h3 className="text-sm sm:text-base font-semibold text-primary">
          {name}
        </h3>

        <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="flex-grow" />

        <div className="my-3 sm:my-4 h-px w-full bg-border" />

        <a
          href={url}
          className="inline-flex items-center text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Visit <span className="ml-2">→</span>
        </a>
      </CardContent>
    </Card>
  )
}

export default PartnerCard
