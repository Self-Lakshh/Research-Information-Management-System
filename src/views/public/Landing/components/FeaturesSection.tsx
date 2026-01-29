import { AnimatedBackdrop } from '@/components/shared'

const FeaturesSection = () => {
    const features = [
        {
            icon: '🗄️',
            title: 'Centralized Repository',
            description:
                'All research outputs are securely stored and made accessible through a centralized digital environment.',
            bgColor: 'bg-cyan-100',
            iconColor: 'bg-cyan-500',
        },
        {
            icon: '⏱️',
            title: 'Real-time Updates',
            description:
                'Real-time tracking of research submissions, approvals and other activities.',
            bgColor: 'bg-emerald-100',
            iconColor: 'bg-emerald-500',
        },
        {
            icon: '⚙️',
            title: 'Smart Workflows',
            description:
                'Streamlined submission and approval processes.',
            bgColor: 'bg-cyan-100',
            iconColor: 'bg-cyan-500',
        },
        {
            icon: '📊',
            title: 'Data Insights',
            description:
                'Automated analytics supporting decision making and accreditation.',
            bgColor: 'bg-emerald-100',
            iconColor: 'bg-emerald-500',
        },
    ]

    return (
        <section className="w-full py-16 md:py-24 relative">
            <AnimatedBackdrop />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
                        Key Features of RIMS
                    </h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Our platform is built designed to streamline research
                        management
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div
                                className={`${feature.iconColor} w-14 h-14 rounded-full flex items-center justify-center mb-4`}
                            >
                                <span className="text-2xl">{feature.icon}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection
