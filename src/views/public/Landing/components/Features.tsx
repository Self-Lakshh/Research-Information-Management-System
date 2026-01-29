import { FeatureCard } from "../components/shared/FeatureCard"
import { Database, RefreshCcw, Workflow, BarChart } from "lucide-react"

export const Features = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-primary">Key Features of RIMS</h2>
          <p className="text-muted-foreground">
            Comprehensive tools designed to streamline research management
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard icon={<Database size={20} />} title="Centralized Repository" description="All research outputs stored in one unified system." />
          <FeatureCard icon={<RefreshCcw size={20} />} title="Real-time Updates" description="Live tracking of all research activities." />
          <FeatureCard icon={<Workflow size={20} />} title="Smart Workflows" description="Streamlined submission and approval processes." />
          <FeatureCard icon={<BarChart size={20} />} title="Data Insights" description="Analytics supporting decision-making." />
        </div>
      </div>
    </section>
  )
}

export default Features