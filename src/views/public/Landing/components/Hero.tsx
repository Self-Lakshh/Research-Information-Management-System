import { Badge } from "@/components/shadcn/ui/badge"
import { StatCard } from "../components/shared/StatCard"
import { Database, BookOpen, FileText, Users } from "lucide-react"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

export const Hero = () => {
  const [heroRef, isHeroVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 })

  return (
    <section id="home" className="relative min-h-fit flex items-center pt-4 pb-4 sm:pt-8 sm:pb-8 lg:pt-8 lg:pb-12 px-6 sm:px-10 lg:px-12 xl:px-16 overflow-hidden">

      <div
        ref={heroRef}
        className="max-w-7xl mx-auto text-center space-y-4 sm:space-y-6 lg:space-y-8 relative z-10"
      >

        {/* Top Badge */}
        <div
          className={`transition-all duration-1000 ease-out ${isHeroVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-10'
            }`}
        >
          <Badge className="bg-warning text-[10px] sm:text-xs lg:text-sm rounded-full px-6 sm:px-8 lg:px-10 py-2 hover:bg-warning hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-default border-none">
            Research Management Platform
          </Badge>
        </div>

        {/* Title */}
        <div
          className={`space-y-4 sm:space-y-5 transition-all duration-1000 delay-200 ease-out ${isHeroVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
            }`}
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-primary leading-[1.2] tracking-tight">
            Sir Padampat Singhania University RIMS
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4 font-medium opacity-80">
            Transforming academic milestones into institutional excellence. RIMS provides a unified infrastructure to document research output, track impact, and accelerate the growth of our scholarly community.
          </p>
        </div>

        {/* Stats Row */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 pt-4 sm:pt-6 transition-all duration-1000 delay-500 ease-out ${isHeroVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
            }`}
        >
          {[
            { icon: <Database className="w-5 h-5 sm:w-6 sm:h-6" />, value: "1L+", label: "IPR & Patents", delay: 0 },
            { icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />, value: "50Cr+", label: "Journal Publications", delay: 100 },
            { icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />, value: "200+", label: "Conference Publications", delay: 200 },
            { icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />, value: "200+", label: "Book Publications", delay: 300 },
          ].map((stat, i) => (
            <div
              key={i}
              className={`transition-all duration-500 h-full ${isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
              style={{ transitionDelay: `${600 + stat.delay}ms` }}
            >
              <StatCard {...stat} />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Hero