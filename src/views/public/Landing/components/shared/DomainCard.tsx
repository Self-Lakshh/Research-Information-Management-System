import { Card, CardContent } from "@/components/shadcn/ui/card"

interface DomainCardProps {
  title: string
  description?: string
  points?: string[]
  image: string
}

export const DomainCard = ({ title, description, points, image }: DomainCardProps) => {
  return (
    <Card className="rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition">
      <div className="m-4 rounded-lg overflow-hidden">
        <img src={image} alt={title} className="w-full h-45 object-cover" />
      </div>
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>

        {/* Description (optional) */}
        {description && (
          <p className="text-sm text-secondary mb-3">{description}</p>
        )}

        {/* Points/Bullet list (optional) */}
        {points && points.length > 0 && (
          <ul className="text-sm text-secondary space-y-1 list-disc pl-4">
            {points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default DomainCard