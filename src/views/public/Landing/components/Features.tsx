import { FeatureCard } from "../components/shared/FeatureCard"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

const features = [
  {
    image: "/img/features/server.svg",
    title: "Centralized Repository",
    description: "All research outputs documented, verified, and stored in one unified digital environment for easy tracking.",
  },
  {
    image: "/img/features/real-time.svg",
    title: "Real-time Updates",
    description: "Live tracking of all research activities and metrics across various departments and individual scholars.",
  },
  {
    image: "/img/features/workflow.svg",
    title: "Smart Workflows",
    description: "Streamlined submission and approval processes designed to reduce administrative burden and save time.",
  },
  {
    image: "/img/features/data-insights.svg",
    title: "Data Insights",
    description: "Powerful analytics supporting strategic decision-making and institutional growth through research.",
  },
]

export const Features = () => {
  const [headerRef, isHeaderVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 })
  const [cardsRef, isCardsVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 })

  return (
    <section
      id="features"
      className="min-h-fit flex items-center py-4 sm:py-6 lg:py-10 px-6 sm:px-10 lg:px-12 xl:px-16 relative overflow-hidden"
    >

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10 relative z-10 w-full">

        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center space-y-2 sm:space-y-3 transition-all duration-1000 ease-out ${isHeaderVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-10'
            }`}
        >
          <span className="text-[10px] sm:text-xs font-bold text-primary/70 uppercase tracking-[0.2em]">What We Offer</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary font-heading">
            Key Features of RIMS
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-sm sm:max-w-xl md:max-w-2xl mx-auto px-4 leading-snug">
            Comprehensive tools designed to streamline research management and foster academic excellence.
          </p>
          <div className="flex justify-center pt-2 sm:pt-4">
            <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-gradient-to-r from-primary to-secondary rounded-full" />
          </div>
        </div>

        {/* Feature Cards */}
        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 w-full"
        >
          {features.map((feature, i) => (
            <div
              key={i}
              className={`transform hover:scale-[1.02] hover:-translate-y-2 transition-all duration-700 ease-out h-full ${isCardsVisible
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