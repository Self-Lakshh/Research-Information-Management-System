import { Button } from '@/components/shadcn/ui/button'
import { ArrowRight } from 'lucide-react'

// Integration Logo Components
const SwiggyLogo = () => (
    <svg viewBox="0 0 48 48" className="w-10 h-10">
        <circle cx="24" cy="24" r="20" fill="#FC8019" />
        <path
            d="M18 20h12v2H18zm0 4h12v2H18zm0 4h8v2h-8z"
            fill="white"
            opacity="0.9"
        />
    </svg>
)

const ZomatoLogo = () => (
    <svg viewBox="0 0 48 48" className="w-10 h-10">
        <circle cx="24" cy="24" r="20" fill="#E23744" />
        <path
            d="M16 18h16l-8 12h8v2H16l8-12h-8v-2z"
            fill="white"
        />
    </svg>
)

const RazorpayLogo = () => (
    <svg viewBox="0 0 48 48" className="w-10 h-10">
        <rect x="4" y="4" width="40" height="40" rx="8" fill="#3395FF" />
        <path
            d="M14 18l10 6-10 6v-12zm16 0v12l4-6-4-6z"
            fill="white"
        />
    </svg>
)

const PaytmLogo = () => (
    <svg viewBox="0 0 48 48" className="w-10 h-10">
        <defs>
            <linearGradient id="paytm-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#00BAF2' }} />
                <stop offset="100%" style={{ stopColor: '#0F4FA8' }} />
            </linearGradient>
        </defs>
        <rect x="4" y="4" width="40" height="40" rx="8" fill="url(#paytm-gradient)" />
        <text
            x="24"
            y="30"
            textAnchor="middle"
            fill="white"
            fontSize="16"
            fontWeight="bold"
        >
            P
        </text>
    </svg>
)

const PhonePeLogo = () => (
    <svg viewBox="0 0 48 48" className="w-10 h-10">
        <rect x="4" y="4" width="40" height="40" rx="8" fill="#5F259F" />
        <circle cx="18" cy="24" r="4" fill="white" />
        <circle cx="30" cy="24" r="4" fill="white" />
        <path d="M18 24h12" stroke="white" strokeWidth="2" />
    </svg>
)

const GooglePayLogo = () => (
    <svg viewBox="0 0 48 48" className="w-10 h-10">
        <rect x="4" y="4" width="40" height="40" rx="8" fill="white" />
        <path d="M24 16v16" stroke="#4285F4" strokeWidth="3" />
        <path d="M32 20l-8 8" stroke="#34A853" strokeWidth="3" />
        <path d="M16 20l8 8" stroke="#FBBC04" strokeWidth="3" />
        <circle cx="24" cy="24" r="3" fill="#EA4335" />
    </svg>
)

const TallyLogo = () => (
    <svg viewBox="0 0 48 48" className="w-10 h-10">
        <rect x="4" y="4" width="40" height="40" rx="8" fill="#FF0000" />
        <text
            x="24"
            y="30"
            textAnchor="middle"
            fill="white"
            fontSize="18"
            fontWeight="bold"
        >
            T
        </text>
    </svg>
)

const WhatsAppLogo = () => (
    <svg viewBox="0 0 48 48" className="w-10 h-10">
        <circle cx="24" cy="24" r="20" fill="#25D366" />
        <path
            d="M31 17c-1.5-1.5-3.5-2.3-5.7-2.3-4.4 0-8 3.6-8 8 0 1.4.4 2.8 1 4l-1.1 4 4.1-1.1c1.2.7 2.5 1 3.9 1h.1c4.4 0 8-3.6 8-8 0-2.1-.8-4.1-2.3-5.6zm-5.7 12.3c-1.2 0-2.4-.3-3.4-.9l-.2-.1-2.5.7.7-2.4-.2-.3c-.6-1.1-1-2.3-1-3.6 0-3.7 3-6.7 6.7-6.7 1.8 0 3.5.7 4.7 2 1.3 1.3 2 3 2 4.7 0 3.7-3 6.7-6.8 6.6z"
            fill="white"
        />
    </svg>
)

const Integrations = () => {
    const integrations = [
        { name: 'Swiggy', category: 'Delivery', logo: SwiggyLogo },
        { name: 'Zomato', category: 'Delivery', logo: ZomatoLogo },
        { name: 'Razorpay', category: 'Payments', logo: RazorpayLogo },
        { name: 'Paytm', category: 'Payments', logo: PaytmLogo },
        { name: 'PhonePe', category: 'Payments', logo: PhonePeLogo },
        { name: 'Google Pay', category: 'Payments', logo: GooglePayLogo },
        { name: 'Tally', category: 'Accounting', logo: TallyLogo },
        { name: 'WhatsApp', category: 'Communication', logo: WhatsAppLogo },
    ]

    return (
        <section id="integrations" className="py-16 lg:py-24">
            <div className="px-4 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
                    <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
                        Integrations
                    </span>
                    <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4">
                        Multiple integrations - single dashboard
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Integrate with all your favorite apps and manage
                        everything from one place
                    </p>
                </div>

                {/* Integrations Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6 mb-12">
                    {integrations.map((integration, index) => {
                        const LogoComponent = integration.logo
                        return (
                            <div
                                key={index}
                                className="group p-6 rounded-xl bg-card border border-border hover:border-teal-500/50 hover:shadow-lg transition-all duration-300 text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <LogoComponent />
                                </div>
                                <h3 className="font-semibold text-foreground">
                                    {integration.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {integration.category}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Button size="lg" variant="outline" className="gap-2">
                        View All Integrations
                        <ArrowRight size={18} />
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default Integrations
