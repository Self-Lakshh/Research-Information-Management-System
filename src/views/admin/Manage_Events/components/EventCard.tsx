import { Card, CardContent } from '@/components/shadcn/ui/card'
import { OptimizedImage } from '@/views/public/Landing/components/shared/OptimizedImage'
import { Edit, Trash2, Calendar } from 'lucide-react'
import { EventRecord } from '@/services/firebase/events/types'
import { Button } from '@/components/shadcn/ui/button'
import { cn } from '@/components/shadcn/utils'

interface EventCardProps {
    event: EventRecord
    onEdit: (event: EventRecord) => void
    onDelete: (id: string) => void
}

export const EventCard = ({
    event,
    onEdit,
    onDelete,
}: EventCardProps) => {
    return (
        <Card
            className={cn(
                "group relative h-full w-full rounded-2xl border bg-card shadow-sm transition-all duration-500 overflow-hidden hover:shadow-premium hover:-translate-y-1",
                !event.is_active && "opacity-70 grayscale-[0.5]"
            )}
        >
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden bg-muted">
                {event.image_url ? (
                    <OptimizedImage
                        src={event.image_url}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-primary/5 italic text-xs">
                        No Event Image
                    </div>
                )}
                
                {/* Status Badge */}
                {!event.is_active && (
                    <div className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-md z-20">
                        Inactive
                    </div>
                )}
            </div>

            {/* Content Section */}
            <CardContent className="flex flex-col p-5 h-[calc(100%-12rem)]">
                <div className="space-y-2">
                    <h3 className="text-primary font-bold text-base leading-tight line-clamp-2 min-h-[40px]">
                        {event.title}
                    </h3>
                    <div className="flex items-center text-muted-foreground text-xs font-medium">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary/60" />
                        {event.event_date || 'Date TBD'}
                    </div>
                </div>

                <div className="grow" />

                {/* Admin Actions Footer */}
                <div className="pt-4 border-t w-full flex items-center gap-2 mt-4">
                    <Button 
                        variant="secondary" 
                        size="sm"
                        className="flex-1 h-9 bg-blue-500/10 hover:bg-blue-500 text-blue-600 hover:text-white border-none transition-all shadow-none font-bold text-xs"
                        onClick={() => onEdit(event)}
                    >
                        <Edit className="h-3.5 w-3.5 mr-2" />
                        Edit
                    </Button>
                    <Button 
                        variant="destructive" 
                        size="sm"
                        className="flex-1 h-9 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border-none transition-all shadow-none font-bold text-xs"
                        onClick={() => {
                            if (window.confirm('Are you sure you want to deactivate this event?')) {
                                onDelete(event.id)
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

export default EventCard
