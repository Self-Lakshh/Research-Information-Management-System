import { PartnerCard } from '../components/shared/PartnerCard'

const partners = [
    {
        icon: '/img/others/irins.png',
        name: 'SPSU IRINS',
        description:
            'Faculty Profile a major provider of research resources for libraries, offering databases, e-journals, e-books',
    },
    {
        icon: '/img/others/ebsco.png',
        name: 'SPSU EBSCO',
        description:
            'A major provider of research resources for libraries, offering databases, e-journals, e-books',
    },
    {
        icon: '/img/others/delnet.png',
        name: 'DELNET',
        description:
            'Access Millions of Networked Library Resources through DELNET',
    },
    {
        icon: '/img/others/jstor.png',
        name: 'JSTOR',
        description:
            'Digital library providing access to academic journals, books, and primary sources',
    },
    {
        icon: '/img/others/scopus.png',
        name: 'SCOPUS',
        description:
            'Abstract and citation database of peer-reviewed literature',
    },
]

export const Partners = () => {
    // Create a quadrupled list for seamless looping on wide screens
    const marqueePartners = [...partners, ...partners, ...partners, ...partners]

    return (
        <section
            id="partners"
            className="min-h-fit flex flex-col justify-center py-6 sm:py-8 lg:py-12 relative overflow-hidden"
        >
            <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .partner-marquee {
          display: flex;
          width: max-content;
          animation: scroll 40s linear infinite;
        }
        .partner-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-t from-primary/5 to-transparent rounded-full blur-3xl" />
                <div className="absolute top-1/4 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
                <div className="absolute top-1/3 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full relative z-10">
                {/* Header */}
                <div className="text-center space-y-2 sm:space-y-3 mb-8 sm:mb-12 lg:mb-16 px-4">
                    <span className="text-[10px] sm:text-xs font-bold text-primary/70 uppercase tracking-[0.2em] animate-fade-in-up">
                        Collaborations
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary animate-fade-in-up delay-100">
                        Our Partner Portal
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto animate-fade-in-up delay-200">
                        Building bridges across academia, industry, and
                        government for impactful research and sustainable
                        innovation.
                    </p>
                    <div className="flex justify-center pt-2 sm:pt-4 animate-fade-in-up delay-300">
                        <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-gradient-to-r from-primary to-secondary rounded-full" />
                    </div>
                </div>

                {/* Marquee Wrapper */}
                <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
                    <div className="partner-marquee py-4 pl-4">
                        {marqueePartners.map((partner, i) => (
                            <div
                                key={i}
                                className="mx-4 w-[260px] sm:w-[300px] lg:w-[320px] transition-transform duration-300 hover:scale-105"
                            >
                                <PartnerCard {...partner} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom stats */}
                <div className="flex justify-center mt-10 sm:mt-12 lg:mt-16 px-4">
                    <div className="flex items-center gap-3 sm:gap-4 px-6 py-3 sm:py-4 bg-primary/5 rounded-full border border-primary/10 backdrop-blur-sm animate-fade-in-up delay-500">
                        <div className="flex -space-x-3">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background"
                                />
                            ))}
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                            Trusted by{' '}
                            <span className="font-bold text-primary">500+</span>{' '}
                            Researchers worldwide
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Partners
