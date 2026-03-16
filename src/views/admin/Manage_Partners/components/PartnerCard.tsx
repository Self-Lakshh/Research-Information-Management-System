import { Card, CardContent } from '@/components/shadcn/ui/card'
import { OptimizedImage } from '@/views/public/Landing/components/shared/OptimizedImage'
import { ArrowRight, Edit, Trash2 } from 'lucide-react'
import { Partner } from '@/services/firebase/partners/types'
import { Button } from '@/components/shadcn/ui/button'
import { cn } from '@/components/shadcn/utils'

interface PartnerCardProps {
    partner: Partner
    onEdit: (partner: Partner) => void
    onDelete: (id: string) => void
}

export const PartnerCard = ({
    partner,
    onEdit,
    onDelete,
}: PartnerCardProps) => {
    return (
        <Card
            className={cn(
                "group relative h-full w-full max-w-[320px] rounded-2xl border bg-card shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-premium hover:border-primary/20",
                !partner.is_active && "opacity-70 grayscale-[0.5]"
            )}
        >
            <CardContent className="flex h-full flex-col items-center text-center p-5 overflow-hidden">
                <div className="mb-4 w-full flex justify-center">
                    <div className="flex h-20 w-full items-center justify-center rounded-xl bg-primary/5 transition-all duration-300 overflow-hidden">
                        {partner.logo_url ? (
                            <OptimizedImage
                                src={partner.logo_url}
                                alt={partner.name}
                                className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                                skeletonClassName="h-full w-full"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                                No Logo
                            </div>
                        )}
                    </div>
                </div>

                <h3 className="text-base font-bold text-primary line-clamp-1">
                    {partner.name}
                </h3>

                <p className="mt-2 text-xs text-muted-foreground line-clamp-2 min-h-[32px] leading-relaxed">
                    {partner.description}
                </p>

                <div className="grow" />

                <div className="mt-4 mb-4">
                    <a
                        href={partner.link || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-all duration-300 group-hover:translate-x-1"
                    >
                        Visit Partner
                        <ArrowRight className="h-3 w-3 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                </div>

                {/* Admin Actions Footer */}
                <div className="pt-4 border-t w-full flex items-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1 h-9 bg-blue-500/10 hover:bg-blue-500 text-blue-600 hover:text-white border-none transition-all shadow-none font-bold text-xs"
                        onClick={() => onEdit(partner)}
                    >
                        <Edit className="h-3.5 w-3.5 mr-2" />
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 h-9 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border-none transition-all shadow-none font-bold text-xs"
                        onClick={() => {
                            if (window.confirm('Are you sure you want to deactivate this partner?')) {
                                onDelete(partner.id)
                            }
                        }}
                    >
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default PartnerCard