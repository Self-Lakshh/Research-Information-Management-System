import { Card, CardContent } from "@/components/shadcn/ui/card"

interface DomainCardProps {
  title: string
  points: string[]
  image: string
}

export const DomainCard = ({ title, points, image }: DomainCardProps) => {
  return (
    <Card className="rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition">
      <img src={image} alt={title} className="w-full h-28 object-cover" />
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
          {points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default DomainCard