import { FeatureCard } from "../components/shared/FeatureCard"
import { Database, RefreshCcw, Workflow, BarChart } from "lucide-react"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

const features = [
  {
    icon: <Database className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "Centralized Repository",
    description: "All research outputs documented, verified, and stored in one unified digital environment.",
  },
  {
    icon: <RefreshCcw className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "Real-time Updates",
    description: "Live tracking of all research activities.",
  },
  {
    icon: <Workflow className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "Smart Workflows",
    description: "Streamlined submission and approval processes.",
  },
  {
    icon: <BarChart className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "Data Insights",
    description: "Analytics supporting decision-making.",
  },
]

export const Features = () => {
  const [headerRef, isHeaderVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 })
  const [cardsRef, isCardsVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 })

  return (
    <section
      id="features"
      className="min-h-screen flex items-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 xl:px-16 relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto space-y-8 sm:space-y-10 lg:space-y-12 relative z-10">

        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center space-y-2 sm:space-y-3 transition-all duration-1000 ease-out ${isHeaderVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-10'
            }`}
        >
          <span className="text-xs sm:text-sm font-semibold text-primary/70 uppercase tracking-wider">What We Offer</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
            Key Features of RIMS
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl lg:max-w-2xl mx-auto px-2">
            Comprehensive tools designed to streamline research management
          </p>
          <div className="flex justify-center pt-2">
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full" />
          </div>
        </div>

        {/* Feature Cards */}
        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 max-w-4xl mx-auto"
        >
          {features.map((feature, i) => (
            <div
              key={i}
              className={`transform hover:scale-[1.02] hover:-translate-y-2 transition-all duration-500 h-full ${isCardsVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
                }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features