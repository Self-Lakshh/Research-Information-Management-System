import { AnimatedBackdrop } from '@/components/shared'

const CategorySection = () => {
    const categories = [
        {
            title: 'IPR & Patents',
            subtitle: 'IPR & Patents',
            description:
                'Manage intellectual property rights and patents systematically, ensuring all research innovations are documented.',
            icon: '💡',
            bgGradient: 'from-blue-600 to-blue-700',
            decorColor: 'bg-yellow-400',
        },
        {
            title: 'Journal Publications',
            subtitle: 'Journal Publications',
            description:
                'Keep detailed records of journal publications including submission to faculty, scholars, and students.',
            icon: '📰',
            bgGradient: 'from-blue-600 to-blue-700',
            decorColor: 'bg-yellow-400',
        },
        {
            title: 'Conference Publications',
            subtitle: 'Conference Publications',
            description:
                'Track conference presentations, proceedings, and other research dissemination activities.',
            icon: '🎤',
            bgGradient: 'from-blue-600 to-blue-700',
            decorColor: 'bg-yellow-400',
        },
        {
            title: 'Book Publications',
            subtitle: 'Book Publications',
            description:
                'Maintain comprehensive details of book publications and scholarly works.',
            icon: '📚',
            bgGradient: 'from-blue-600 to-blue-700',
            decorColor: 'bg-yellow-400',
        },
        {
            title: 'Book Chapter Publications',
            subtitle: 'Book Chapter Publications',
            description:
                'Document contributions to edited volumes and book chapters systematically.',
            icon: '📖',
            bgGradient: 'from-blue-600 to-blue-700',
            decorColor: 'bg-yellow-400',
        },
        {
            title: 'Consultancy & Project Grants',
            subtitle: 'Consultancy & Project Grants',
            description:
                'Manage consultancy projects and grant applications with detailed tracking.',
            icon: '💼',
            bgGradient: 'from-blue-600 to-blue-700',
            decorColor: 'bg-yellow-400',
        },
        {
            title: 'Awards & Recognitions',
            subtitle: 'Awards & Recognitions',
            description:
                'Maintain a comprehensive record of awards, honors, and recognitions received.',
            icon: '🏆',
            bgGradient: 'from-blue-600 to-blue-700',
            decorColor: 'bg-yellow-400',
        },
        {
            title: 'FDP / Seminar / Workshop',
            subtitle: 'FDP / Seminar / Workshop',
            description:
                'Document faculty development programs, seminars, and workshop participation.',
            icon: '🎓',
            bgGradient: 'from-blue-600 to-blue-700',
            decorColor: 'bg-yellow-400',
        },
        {
            title: 'Keynote Speaker',
            subtitle: 'Keynote Speaker',
            description:
                'Track keynote speeches and invited talks delivered at various forums.',
            icon: '🎙️',
            bgGradient: 'from-blue-600 to-blue-700',
            decorColor: 'bg-yellow-400',
        },
        {
            title: 'Ph.D Scholar Data',
            subtitle: 'Ph.D Scholar Data',
            description:
                'Comprehensive management of doctoral student information and progress tracking.',
            icon: '🎓',
            bgGradient: 'from-blue-600 to-blue-700',
            decorColor: 'bg-yellow-400',
        },
    ]

    return (
        <section className="w-full py-16 md:py-24 relative">
            <AnimatedBackdrop />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
                        Domain / Category
                    </h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Explore a comprehensive categorization designed to
                        simplify, document, and accelerate your research
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            {/* Card Header */}
                            <div
                                className={`bg-gradient-to-r ${category.bgGradient} p-6 relative`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center text-2xl">
                                            {category.icon}
                                        </div>
                                        <h3 className="text-white font-bold text-lg">
                                            {category.title}
                                        </h3>
                                    </div>
                                </div>
                                {/* Decorative elements */}
                                <div
                                    className={`absolute top-4 right-4 ${category.decorColor} w-8 h-8 rounded-lg opacity-50`}
                                ></div>
                                <div
                                    className={`absolute bottom-4 right-8 ${category.decorColor} w-6 h-6 rounded-lg opacity-30`}
                                ></div>
                                <div className="absolute bottom-4 right-4 bg-teal-400 w-10 h-10 rounded-lg opacity-40"></div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6">
                                <h4 className="font-bold text-gray-900 mb-2">
                                    {category.subtitle}
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {category.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View Less Button */}
                <div className="text-center mt-12">
                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-lg flex items-center gap-2 mx-auto">
                        View less
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default CategorySection
