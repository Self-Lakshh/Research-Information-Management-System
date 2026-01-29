import { Button } from "@/components/shadcn/ui/button"
import { StatCard } from "../components/shared/StatCard"
import { Database, BookOpen, FileText, Users } from "lucide-react"

export const Hero = () => {
  return (
    <section className="relative py-20 ">
      <div className="container mx-auto px-6 text-center space-y-10">
        
        {/* Top Badge */}
        <div>
          <Button variant="default" className="rounded-full px-5">
            Research Management Platform
          </Button>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Sir Padampat Singhania University RIMS
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Software that integrates databases across the entire lifecycle of
            institutions, helping with reporting, analysis, and promotion of
            research activities.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          <StatCard
            icon={<Database size={22} />}
            value="1L+"
            label="IPR & Patents"
          />
          <StatCard
            icon={<BookOpen size={22} />}
            value="50Cr+"
            label="Journal Publications"
          />
          <StatCard
            icon={<FileText size={22} />}
            value="200+"
            label="Conference Publications"
          />
          <StatCard
            icon={<Users size={22} />}
            value="200+"
            label="Book Publications"
          />
        </div>

      </div>
    </section>
  )
}

export default Hero