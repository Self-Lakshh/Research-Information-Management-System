import { AnimatedBackdrop } from '@/components/shared'

const PartnerPortalSection = () => {
    const portals = [
        {
            title: 'SPSU RIMS',
            description:
                'Faculty and research management system for tracking publications, grants, and academic activities.',
            icon: '🎓',
            bgColor: 'bg-cyan-100',
            link: 'Visit',
        },
        {
            title: 'SPSU ERPCOA',
            description:
                'An ERP solution to streamline operations, integrating student management, finance, and HR.',
            icon: '💼',
            bgColor: 'bg-blue-100',
            link: 'Visit',
        },
        {
            title: 'SALNET',
            description:
                'An advanced LMS designed to manage online learning, course delivery, and student engagement.',
            icon: '📚',
            bgColor: 'bg-cyan-100',
            link: 'Visit',
        },
    ]

    return (
        <section className="w-full py-16 md:py-24 relative">
            <AnimatedBackdrop />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
                        Our Partner Portal
                    </h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Explore our network of integrated partner portals,
                        designed to streamline operations, enhance learning, and
                        drive efficiency across the academic ecosystem.
                    </p>
                </div>

                {/* Portals Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {portals.map((portal, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 border border-gray-100"
                        >
                            {/* Icon */}
                            <div
                                className={`${portal.bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-6`}
                            >
                                <span className="text-3xl">{portal.icon}</span>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {portal.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {portal.description}
                            </p>

                            {/* Link */}
                            <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 group">
                                {portal.link}
                                <svg
                                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-12">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
            </div>
        </section>
    )
}

export default PartnerPortalSection
