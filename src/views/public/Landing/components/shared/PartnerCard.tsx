import { Card, CardContent } from "@/components/shadcn/ui/card"
import { Button } from "@/components/shadcn/ui/button"

interface PartnerCardProps {
  logo: string
  name: string
  description: string
}

export const PartnerCard = ({ logo, name, description }: PartnerCardProps) => {
  return (
    <Card className="rounded-2xl border shadow-sm hover:shadow-md transition">
      <CardContent className="p-6 space-y-4">
        <img src={logo} alt={name} className="h-10 object-contain" />
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button variant="link" className="px-0 text-primary">
          Visit →
        </Button>
      </CardContent>
    </Card>
  )
}

export default PartnerCard